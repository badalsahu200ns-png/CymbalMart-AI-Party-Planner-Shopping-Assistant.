// Browser Web Speech API Services for Alexa-Inspired Voice Assistant

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.speechSynthesis);
}

let activeRecognitionInstance: any = null;

export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export function startSpeechRecognition(callbacks: SpeechRecognitionCallbacks): boolean {
  if (!isSpeechRecognitionSupported()) {
    callbacks.onError?.('Speech recognition is not supported in this browser. Please use text input.');
    return false;
  }

  // Stop any existing active instance first
  stopSpeechRecognition();

  try {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      callbacks.onStart?.();
    };

    recognition.onresult = (event: any) => {
      if (event.results && event.results.length > 0) {
        const result = event.results[0];
        const transcript = result[0]?.transcript?.trim() || '';
        const isFinal = Boolean(result.isFinal);
        if (transcript) {
          callbacks.onResult(transcript, isFinal);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('SpeechRecognition error:', event);
      let errMsg = 'Speech recognition encountered an issue. Please try again or type.';
      if (event.error === 'not-allowed') {
        errMsg = 'Microphone permission was denied. You can plan using text input.';
      } else if (event.error === 'no-speech') {
        errMsg = 'No speech detected. Please speak clearly or use text input.';
      } else if (event.error === 'audio-capture') {
        errMsg = 'No microphone was found on this device.';
      }
      callbacks.onError?.(errMsg);
    };

    recognition.onend = () => {
      activeRecognitionInstance = null;
      callbacks.onEnd?.();
    };

    activeRecognitionInstance = recognition;
    recognition.start();
    return true;
  } catch (err) {
    console.warn('Failed to start speech recognition:', err);
    callbacks.onError?.('Could not activate microphone. Please type your message.');
    return false;
  }
}

export function stopSpeechRecognition(): void {
  if (activeRecognitionInstance) {
    try {
      activeRecognitionInstance.abort();
    } catch {
      // ignore
    }
    activeRecognitionInstance = null;
  }
}

/**
 * Clean text for friendly, concise text-to-speech without reading long technical lists or markdown
 */
export function sanitizeTextForSpeech(text: string): string {
  if (!text) return '';

  return text
    // Remove markdown symbols like bold, italic, bullet points
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^•\s+/gm, '')
    .replace(/[#_~`]/g, '')
    // Replace INR currency symbol with "Rupees"
    .replace(/₹\s*([\d,]+)/g, '$1 rupees')
    // Remove multiple consecutive newlines
    .replace(/\n\s*\n/g, '. ')
    .replace(/\n/g, '. ')
    // Cut off reading very long lists if too verbose
    .slice(0, 300);
}

export function speakText(
  text: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): void {
  if (!isSpeechSynthesisSupported()) {
    callbacks?.onEnd?.();
    return;
  }

  // Cancel any prior speech
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }

  const cleanText = sanitizeTextForSpeech(text);
  if (!cleanText.trim()) {
    callbacks?.onEnd?.();
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      callbacks?.onError?.(e);
      callbacks?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Failed to speak text:', err);
    callbacks?.onError?.(err);
    callbacks?.onEnd?.();
  }
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}
