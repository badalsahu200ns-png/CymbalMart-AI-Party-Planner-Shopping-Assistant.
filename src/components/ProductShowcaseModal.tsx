import React, { useState, useEffect } from 'react';
import { useParty } from '../context/PartyContext';
import {
  Film,
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ShoppingCart,
  Calendar,
  Building,
  BarChart3,
  Tablet,
} from 'lucide-react';

interface ShowcaseScene {
  secondRange: string;
  secondNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  targetTab: 'my-hub' | 'planning' | 'shopping' | 'reports';
  headline: string;
  visualMockupType: 'tablet-welcome' | 'screen-a' | 'screen-b' | 'screen-c' | 'screen-d' | 'screen-outro';
  highlights: string[];
}

const SCENES: ShowcaseScene[] = [
  {
    secondRange: '0s - 1s',
    secondNumber: 1,
    title: 'Modern SaaS Platform on Tablet',
    subtitle: 'Clean white & soft-gray dashboard with emerald-green accents.',
    badge: 'Second 0–1: Introduction',
    targetTab: 'my-hub',
    headline: 'CymbalMart AI Party Planner',
    visualMockupType: 'tablet-welcome',
    highlights: [
      'Responsive tablet & desktop optimized layout',
      'Emerald-green accents & clean dark navy typography',
      'Unified 10-item canonical navigation sidebar',
    ],
  },
  {
    secondRange: '2s - 3s',
    secondNumber: 3,
    title: 'Screen A: Celebrationstart AI Party Planner',
    subtitle: '"Tell us about your event…" input with 6 photographic category cards.',
    badge: 'Second 2–3: Screen A',
    targetTab: 'my-hub',
    headline: 'Celebrationstart AI Party Planner',
    visualMockupType: 'screen-a',
    highlights: [
      'Heading: "Celebrationstart AI Party Planner"',
      'Prominent input field with emerald Submit button',
      '6 cards: Anniversary, Office Gala, Birthday, Family, Retirement, Graduation',
    ],
  },
  {
    secondRange: '4s - 5s',
    secondNumber: 5,
    title: 'Screen B: Event Planning Workspace',
    subtitle: 'Event countdown, Planning / Pending / Milestones tabs, and RSVP roster.',
    badge: 'Second 4–5: Screen B',
    targetTab: 'planning',
    headline: 'Event Planning Workspace',
    visualMockupType: 'screen-b',
    highlights: [
      'Event overview: countdown, location, budget status',
      'Checklists with interactive checkboxes',
      'Live guest roster with confirmed/pending RSVP badges',
    ],
  },
  {
    secondRange: '6s - 7s',
    secondNumber: 7,
    title: 'Screen C: Smart Shopping Dashboard',
    subtitle: 'Product photography, checklist, savings, & circular budget ring.',
    badge: 'Second 6–7: Screen C',
    targetTab: 'shopping',
    headline: 'Shopping Dashboard & Circular Gauge',
    visualMockupType: 'screen-c',
    highlights: [
      'Dynamic category filters (Food, Drinks, Cake, Decor, Tableware)',
      'Circular SVG spending progress ring with emerald stroke',
      'Checkboxes, unit pricing, totals, and Green "Add to Cart" button',
    ],
  },
  {
    secondRange: '8s - 9s',
    secondNumber: 9,
    title: 'Screen D: Reports, Budgets & Curated Suppliers',
    subtitle: 'Expense category charts, completeness audit, & hand-vetted vendors.',
    badge: 'Second 8–9: Screen D',
    targetTab: 'reports',
    headline: 'Reports, Spending Analytics & Suppliers',
    visualMockupType: 'screen-d',
    highlights: [
      'Category-by-category expense progress bars',
      'Completeness readiness score (90%+)',
      'Curated suppliers & venue booking integrations',
    ],
  },
  {
    secondRange: '10s',
    secondNumber: 10,
    title: 'Official Brand Title & Creator Attribution',
    subtitle: 'CymbalMart AI Party Planner • Created by Badal Kumar Sahu.',
    badge: 'Second 10: Conclusion',
    targetTab: 'my-hub',
    headline: 'Plan smarter. Shop with purpose. Celebrate more.',
    visualMockupType: 'screen-outro',
    highlights: [
      'Application Name: CymbalMart AI Party Planner',
      'Created by: Badal Kumar Sahu',
      'LinkedIn, Portfolio & GitHub connected',
    ],
  },
];

interface ProductShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductShowcaseModal: React.FC<ProductShowcaseModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentTab } = useParty();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const scene = SCENES[currentSceneIndex];

  // Auto-play timer (transitions every 2 seconds across 6 scenes = 12s total experience)
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSceneIndex((prev) => (prev + 1) % SCENES.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const handleNext = () => {
    setCurrentSceneIndex((prev) => (prev + 1) % SCENES.length);
  };

  const handlePrev = () => {
    setCurrentSceneIndex((prev) => (prev - 1 + SCENES.length) % SCENES.length);
  };

  const handleJumpToLiveScreen = () => {
    setCurrentTab(scene.targetTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black">10-Second Product Video Journey</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold uppercase border border-emerald-500/30">
                  {scene.secondRange}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Visual recreation of the reference video UI architecture.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar Ticker */}
        <div className="w-full h-1.5 bg-slate-800 flex">
          {SCENES.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-full border-r border-slate-900 transition-all duration-300 ${
                idx === currentSceneIndex
                  ? 'bg-emerald-500'
                  : idx < currentSceneIndex
                  ? 'bg-emerald-700'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Scene Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Main Visual Presentation Card */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 border border-slate-200/90 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Details */}
              <div className="space-y-3 flex-1 text-left">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {scene.badge}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {scene.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {scene.subtitle}
                </p>

                {/* Highlights list */}
                <div className="space-y-1.5 pt-2">
                  {scene.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Stylized Mini Preview Frame */}
              <div className="w-full md:w-80 h-52 rounded-2xl bg-slate-900 text-white p-4 shadow-xl border border-slate-700 flex flex-col justify-between shrink-0 relative overflow-hidden">
                {/* Visual badge inside frame */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    cymbalmart.ai/{scene.visualMockupType}
                  </span>
                </div>

                {/* Frame Content Representation */}
                <div className="my-auto text-center space-y-2">
                  {scene.visualMockupType === 'tablet-welcome' && (
                    <>
                      <Tablet className="w-8 h-8 text-emerald-400 mx-auto" />
                      <div className="text-xs font-bold text-slate-200">
                        CymbalMart AI Party Planner
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Clean White &amp; Emerald SaaS Dashboard
                      </div>
                    </>
                  )}

                  {scene.visualMockupType === 'screen-a' && (
                    <>
                      <Sparkles className="w-8 h-8 text-emerald-400 mx-auto" />
                      <div className="text-xs font-bold text-slate-200">
                        Celebrationstart AI Planner
                      </div>
                      <div className="text-[10px] text-emerald-300 font-mono">
                        &quot;Tell us about your event…&quot;
                      </div>
                      <div className="text-[9px] text-slate-400">
                        6 Photographic Category Cards
                      </div>
                    </>
                  )}

                  {scene.visualMockupType === 'screen-b' && (
                    <>
                      <Calendar className="w-8 h-8 text-emerald-400 mx-auto" />
                      <div className="text-xs font-bold text-slate-200">
                        Planning Workspace
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Planning • Pending • Milestones
                      </div>
                    </>
                  )}

                  {scene.visualMockupType === 'screen-c' && (
                    <>
                      <div className="w-10 h-10 rounded-full border-4 border-emerald-400 border-t-transparent mx-auto flex items-center justify-center text-[10px] font-bold">
                        75%
                      </div>
                      <div className="text-xs font-bold text-slate-200">
                        Shopping &amp; Circular Ring
                      </div>
                    </>
                  )}

                  {scene.visualMockupType === 'screen-d' && (
                    <>
                      <BarChart3 className="w-8 h-8 text-emerald-400 mx-auto" />
                      <div className="text-xs font-bold text-slate-200">
                        Reports &amp; Curated Suppliers
                      </div>
                    </>
                  )}

                  {scene.visualMockupType === 'screen-outro' && (
                    <>
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center mx-auto text-xs">
                        CM
                      </div>
                      <div className="text-xs font-bold text-slate-200">
                        CymbalMart AI Party Planner
                      </div>
                      <div className="text-[10px] text-emerald-400">
                        Created by Badal Kumar Sahu
                      </div>
                    </>
                  )}
                </div>

                <div className="text-[9px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
                  <span>Playback: {scene.secondRange}</span>
                  <span className="text-emerald-400 font-bold">4K Production UI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Scene Jump Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {SCENES.map((sc, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSceneIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  idx === currentSceneIndex
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-[10px] font-bold text-emerald-700">{sc.secondRange}</div>
                <div className="text-xs font-bold text-slate-900 truncate mt-0.5">{sc.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Bottom Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Play / Pause & Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause Auto-Play' : 'Start Auto-Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
              title="Previous scene"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
              title="Next scene"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-xs text-slate-500 font-medium ml-2">
              Scene {currentSceneIndex + 1} of {SCENES.length}
            </span>
          </div>

          {/* Jump to Live Interactive Screen */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleJumpToLiveScreen}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <span>Explore Live Screen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
