# Amazon Developer Hackathon — Alexa+ Track Submission Pack

## 1. Project Overview & Pitch

**Project Name:** CymbalMart AI Party Planner & Shopping Assistant  
**Primary Track:** **Alexa+**  
**Repository:** [GitHub Repository](https://github.com/badalsahu200ns-png/CymbalMart-AI-Party-Planner-Shopping-Assistant..git)  
**Submission Tagline:** A voice-and-text party shopping companion that plans celebrations, manages grocery lists, and tracks real-time budgets through a natural conversational assistant.

### Problem Statement
Hosting an event forces party planners to juggle disconnected tasks: estimating guest requirements, budgeting in Indian Rupees (INR), determining grocery quantities across retail aisles, and adjusting shopping carts when plans change.

### Solution & User Experience
CymbalMart combines a full-stack event planning workspace with an **Alexa+ style simulated conversational shopping companion**. Users can issue natural-language voice or text commands like:
> *"Plan a birthday party for 12 guests with a budget of 5,000 rupees"*  
> *"Add two bottles of sparkling water"*  
> *"Remove balloons"*  
> *"Set the budget to 7,000 rupees"*  
> *"Show my budget"*

The companion updates shared state in real time: recalculating items, quantities, estimated spend, and remaining financial capacity with immediate visual feedback.

---

## 2. Technical Implementation & Track Architecture

### Honesty & System Disclosure
- **Simulated Web Prototype:** This submission is built as a **high-fidelity simulated Alexa+ web experience**. It models the conversational voice-first user journey, dual-modality display (visual party snapshot alongside audio/text dialogue), and stateful shopping cart manipulation.
- **No False Claims:** This project does **not** claim to be an official production Amazon Alexa Skill, an Alexa+ hardware device connection, or an official Amazon Alexa+ MCP endpoint. All integrations are browser/server-side implementations utilizing Web Speech API, Express, React 19, and Google Gemini 2.5 Flash for fallback reasoning.
- **Sample Pricing:** All product prices are illustrative sample estimates in INR (₹) for demonstration and calculation purposes, not live retail pricing or automated retail checkout.

### Technology Stack
- **Frontend:** React 19, TypeScript 5.7, Tailwind CSS v4, Lucide Icons, Vite 6.2
- **Audio & Voice Layer:** Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) for voice input with continuous text fallback; Web Speech Synthesis (`SpeechSynthesisUtterance`) for voice responses
- **Backend:** Node.js v24, Express 4.21, CORS, Dotenv
- **AI Intelligence:** `@google/genai` (Google Gen AI SDK with `gemini-2.5-flash`) for open-ended party reasoning and personalized guest invitations
- **State Engine:** Unified calculation and intent routing engine (`PartyContext` and standalone demo state machine)

---

## 3. Demo Entry Points & Local Verification

The project provides two seamless entry points:

### Entry Point A: Standalone Alexa+ Experience Demo
- **URL Path:** `http://localhost:3000/alexa-plus-demo.html`
- **File Location:** `public/alexa-plus-demo.html` (automatically served by Vite in development and copied to `dist/` in production)
- **Features:** Voice visualizer orb with breathing and pulse states, live audio synthesis, quick action chips, real-time budget utilization bar, responsive mobile layout, and zero-dependency standalone operation.

### Entry Point B: Full CymbalMart Event Management Suite
- **URL Path:** `http://localhost:3000/`
- **Features:** Complete 9-aisle shopping manager, visual spend optimizer, guest RSVP tracker, AI personalized invitation generator, Google Maps venue hub, and universal slide-over AI Controller drawer linked to the Alexa+ demo.

---

## 4. Exact Setup & Run Commands

Tested on Windows (Node.js `v24.22.1`, npm `11.19.1`):

### 1. Install Dependencies
```powershell
npm.cmd ci
```
*Note: Uses `package-lock.json` for deterministic package installation.*

### 2. Verify Linting & TypeScript
```powershell
npm.cmd run lint
```
*Executes `tsc --noEmit`. Verified: 0 TypeScript errors.*

### 3. Build Production Assets
```powershell
npm.cmd run build
```
*Executes `vite build`. Verified: builds `dist/` including `dist/alexa-plus-demo.html` in ~3.0s.*

### 4. Run Development Server
```powershell
npm.cmd run dev
```
*Starts Express + Vite middleware on `http://localhost:3000`.*

### 5. Run Production Server
```powershell
$env:NODE_ENV = "production"
npm.cmd start
```
*Serves production assets and API endpoints on port 3000.*

---

## 5. Verified 3-Minute Demo Video Script & Flow

Use this exact timing and script when recording your English demo video (under 3 minutes):

| Timestamp | Phase | Visual Action | Narration Script |
|---|---|---|---|
| **0:00 – 0:25** | **Introduction** | Show CymbalMart landing page, point to "Alexa+ Demo" pill, then switch to `/alexa-plus-demo.html`. | *"Hello judges! Welcome to CymbalMart Shopping Companion, our submission for the Amazon Developer Hackathon in the Alexa+ track. Today we’re demonstrating a voice-first party planner and shopping companion designed for conversational commerce."* |
| **0:25 – 0:55** | **Step 1: Planning Event** | Click the chip or type: `Plan a birthday party for 12 people with a budget of 5000 rupees`. | *"Let's ask our assistant: 'Plan a birthday party for 12 people with a budget of 5,000 rupees'. Notice how the assistant immediately configures the headcount to 12, locks in our ₹5,000 budget, and populates a starter basket of essentials totaling ₹1,375."* |
| **0:55 – 1:30** | **Step 2: Voice & Item Addition** | Click mic or type: `Add two bottles of sparkling water`. Point out the list update. | *"Now let's order drinks: 'Add two bottles of sparkling water'. Our natural-language parser handles word numbers like 'two' and correctly distinguishes sparkling water from ordinary bottled water, adding 2 bottles at ₹70 each. Total spend dynamically updates to ₹1,515."* |
| **1:30 – 1:55** | **Step 3: Item Removal** | Type or say: `Remove balloons`. | *"Next, we already have decorations, so let's say: 'Remove balloons'. Balloons & decor are instantly removed from the basket, dropping our total spend down to ₹1,235."* |
| **1:55 – 2:25** | **Step 4: Budget Adjustment** | Type: `Set the budget to 7000 rupees`, then `Show my budget`. | *"Now our host increases the celebration budget: 'Set the budget to 7,000 rupees'. Next: 'Show my budget'. The assistant confirms: 'Your estimated shopping total is ₹1,235 against your ₹7,000 budget. You have ₹5,765 remaining'. The spend bar reflects 18% utilization."* |
| **2:25 – 2:50** | **Step 5: Full Suite Integration** | Click `← Full App` in top header to show the full React application and AI Controller. | *"Clicking back to the full app, all data syncs with our 9-aisle shopping manager, budget optimizer, and guest invitations. Everything runs on a single source of truth."* |
| **2:50 – 3:00** | **Closing & Transparency** | Show project footer & repository. | *"As noted in our submission, this is an independent web prototype simulating the Alexa+ conversational experience for UX validation. Thank you!"* |

---

## 6. Official Submission Field Checklist (Devpost)

Use this checklist when completing your Devpost submission form:

- [x] **Primary Track Selected:** **Alexa+**
- [ ] **Secondary Tracks:** Do **NOT** select AWS Builder unless a live AWS service is hooked up; do **NOT** select Open Source unless specific external contribution rules are met. Keep Alexa+ strictly as your primary focus.
- [ ] **Project Title:** `CymbalMart — Alexa+ AI Party Shopping Companion`
- [ ] **Elevator Pitch:** `A voice-first conversational party shopping companion that plans celebrations, manages grocery baskets, and balances real-time INR budgets.`
- [ ] **GitHub Repository URL:** `https://github.com/badalsahu200ns-png/CymbalMart-AI-Party-Planner-Shopping-Assistant.`
- [ ] **Working Demo URL:** `https://<your-live-deployment-url>/alexa-plus-demo.html` *(Verify before submitting!)*
- [ ] **Demo Video URL:** Public YouTube or Vimeo link (in English, strictly under 3 minutes). Test in an incognito window without logging in.
- [x] **Verified Local Test Results:** Included in this submission pack.
- [ ] **Tool/SDK Product Feedback:** Completed using the verified honest responses below.

---

## 7. Required Tool / SDK Product Feedback (Honest Draft)

**Tool Used:**  
React 19, Node.js Express server, Browser Web Speech API (`SpeechRecognition` & `SpeechSynthesis`), and Google Gemini 2.5 Flash API (`@google/genai`).

**What it was used for:**  
Prototyping a voice-and-text party shopping assistant that allows hosts to plan guest counts, manage item quantities across shopping aisles, update budgets in Indian Rupees, and view live state synchronizations.

**What worked well:**  
- The dual-modality approach (voice audio feedback paired with live UI updates) makes shopping list adjustments much faster than traditional dropdowns and modal forms.
- Natural-language quantity parsing (supporting both digits like `2` and words like `two`) provided a fluid conversational interface.
- Graceful degradation: in browsers where speech recognition is unavailable or microphone permissions are blocked, the text composer ensures full functionality.

**What needs work / Friction points encountered:**  
- Browser inconsistencies with Web Speech API: Chrome supports `webkitSpeechRecognition` well, whereas Firefox and Safari require manual configuration or lack full support.
- Ambiguous item disambiguation: matching commands like *"Add sparkling water"* initially risked colliding with ordinary *"Bottled water"*. Strict negative matching and prioritized regex routing were necessary to prevent accidental collisions.
- Budget command precedence: generic query handlers (e.g. matching *"budget"*) initially shadowed budget update commands (*"Set budget to 7000"*). Ordering intent evaluation so modifications precede queries resolved this issue.

**Onboarding experience:**  
Prototyping conversational shopping with web technologies is an effective method for rapid UX validation prior to implementing a full production Alexa Skill or MCP agent. However, clear UI disclosures and documentation are essential to ensure judges understand this is a web simulation rather than a physical Echo device skill.

**Would I build with it again?**  
Yes. For rapid prototyping of multimodal assistant interactions, this stack provides immediate feedback. For a subsequent production milestone, the next step would be deploying an official Alexa Agent Skill or MCP server against Amazon's developer portal.

---

## 8. Deployment Options & Step-by-Step Instructions

To obtain your required public **Working Demo URL**:

### Option 1: Render / Railway / Heroku (Recommended for Full Stack)
1. Push this branch to GitHub:
   ```powershell
   git push origin hackathon/alexa-plus-submission
   ```
2. Connect your repository on [Render.com](https://render.com) as a **Web Service**.
3. Configure build & start settings:
   - **Environment:** Node
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `node server.ts`
   - **Environment Variables:** `NODE_ENV=production`, `PORT=3000`, `GEMINI_API_KEY=<optional>`
4. Once deployed, verify your public URL:
   - App: `https://<your-service>.onrender.com/`
   - Alexa+ Demo: `https://<your-service>.onrender.com/alexa-plus-demo.html`

### Option 2: Vercel (Frontend + Static Demo)
1. Push changes to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**
4. Build Command: `vite build`
5. Output Directory: `dist`
6. Once deployed, `dist/alexa-plus-demo.html` is accessible at `https://<your-project>.vercel.app/alexa-plus-demo.html`.

---

## 9. Hackathon Deadline Note (IST)

- **Current Submission Time:** Friday, October 23, 2026 (IST).
- **Mandatory Final Action:** Verify the exact deadline cutoff time on your Devpost dashboard in IST (Indian Standard Time, UTC+5:30) and submit your video link and deployed URL at least **1 hour before the cutoff** to prevent last-minute network delays.
