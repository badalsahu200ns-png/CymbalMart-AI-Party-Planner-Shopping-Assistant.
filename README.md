# CymbalMart AI Party Planner & Shopping Assistant
Visit my application: https://cymbalmart-ai-party-planner.ai.studio  
Alexa+ Simulated Experience Demo: [Alexa+ Demo](/alexa-plus-demo.html) | [Submission Pack](HACKATHON_ALEXA_PLUS.md)

An intelligent, full-stack event planning and retail shopping management application powered by Google Gemini AI, featuring a dedicated **Alexa+ simulated conversational shopping companion** for the Amazon Developer Hackathon. **CymbalMart AI Party Planner** automates party creation, dynamic item quantity calculations based on guest headcounts, budget optimization in Indian Rupees (₹), personalized invitation crafting, venue logistics, and schedule synchronization.

---

## 🎙️ Amazon Developer Hackathon — Alexa+ Track Highlight

CymbalMart includes an **Alexa+ simulated voice-and-text party shopping companion** accessible at `/alexa-plus-demo.html` and through the in-app AI Controller drawer.

### Key Capabilities:
- **Natural-Language Voice & Text Control:** Speak or type natural event planning requests using the Web Speech API with seamless text fallback.
- **Headcount & Budget Locking:** Configure guest count and INR budget simultaneously (e.g. *"Plan a birthday party for 12 guests with a budget of ₹5,000"*).
- **Conversational Grocery Basket Management:** Add items with word or digit quantities (*"Add two bottles of sparkling water"*), automatically disambiguating specialized items from basic commodities.
- **Dynamic Spend & Capacity Tracking:** Real-time budget progress bar, remaining capacity calculations, and over-budget alerts.
- **Immediate State Consistency:** Immediate bidirectional UI synchronization across voice queries and visual catalog views.
- **Full Documentation & Video Flow:** See [`HACKATHON_ALEXA_PLUS.md`](HACKATHON_ALEXA_PLUS.md) for the verified 3-minute video script, setup commands, and honest track disclosure.

---

## 🎯 Key Features & Canonical Architecture

The application is engineered around the **One Canonical Location** architecture, eliminating duplicate state and ensuring a Single Source of Truth across all modules:

### 1. 📊 Dashboard (Executive Overview)
- Real-time event statistics: confirmed RSVPs, total estimated shopping cost, remaining budget, and readiness health score.
- Quick navigation triggers directly linking to dedicated canonical management views.
- Active countdown timer to event start time.

### 2. 🎉 Party Planner (Event Configuration)
- Natural language AI parser: describe any celebration in plain text to automatically configure theme, guest count, budget, age group, dietary preferences, and event schedule.
- Instant item generator with auto-quantities calculated dynamically for the event archetype.
- Multi-event switcher with preset starter templates (Kids Birthday, Corporate Mixer, Rooftop BBQ, etc.).

### 3. 🛒 Shopping List (CymbalMart Aisle Management)
- Categorized across 9 retail aisles: *Beverages & Bar*, *Food & Catering*, *Bakery & Desserts*, *Tableware & Disposables*, *Decorations & Balloons*, *Entertainment & Games*, *Snacks & Finger Foods*, *Ice & Perishables*, and *Return Gifts & Favors*.
- Quantity adjustments with live price recalculation.
- Priority tagging (High, Medium, Low) and dietary badges (Vegetarian, Vegan, Gluten-Free, Nut-Free).
- One-click budget-saving alternative swaps.

### 4. 💰 Budget Manager (Financial Health Hub)
- Interactive visual spend breakdown per retail aisle.
- Over-budget warnings and remaining financial capacity indicators.
- **1-Click AI Budget Optimizer**: automatically prioritizes essential items, trims low-priority luxury items, and swaps high-cost items to stay strictly under the spending ceiling.

### 5. 👥 Guest List & RSVP Manager
- Guest directory tracking dietary preferences, RSVP statuses (*Confirmed*, *Pending*, *Declined*), plus-ones, and contact info.
- Duplicate attendee detection.
- **Guest-Aware Shopping Recalculator**: dynamic 1-click quantity sync that scales party provisions according to confirmed attendees and dietary constraints.

### 6. 💌 AI Personalized Invitations
- Gemini-powered personalized invitation generator creating customized, warm copy for every guest.
- Direct copy-to-clipboard actions and invitation delivery status tracking.

### 7. 📍 Venue & Navigation Hub
- Canonical address, access instructions, and guest parking guidelines.
- Direct Google Maps navigation link generator.
- 1-Hour automated arrival alert countdown and notification scheduler.

### 8. 📅 Calendar & Run-of-Show Schedule
- Structured party timeline from setup to farewell.
- Direct **Add to Google Calendar** integration and universal **.ICS calendar export**.

### 9. ✅ Final Review & CymbalMart Checkout Preparation
- Party Readiness Health Audit analyzing missing party essentials (ice, napkins, cake knife, beverages).
- CymbalMart store order staging and master printable event plan summary.

### 10. 🤖 Context-Aware AI Voice & Text Controller
- Natural language chat drawer backed by Gemini 2.5 Flash and local rule-based intent parsing.
- Intent-based routing (e.g., *"Show my budget"*, *"Where is my venue?"*).
- Operational commands with direct state updates (e.g., *"Remove balloons"*, *"Add 2 bottles of sparkling water"*, *"Set budget to ₹7,000"*).
- Web Speech API integration for hands-free voice commands.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **State Architecture**: React Context (`PartyContext`) with LocalStorage fallback & reactive calculation engines
- **Backend**: Node.js v24, Express 4.21, CORS, Dotenv
- **AI Integration**: `@google/genai` (Google Gen AI SDK with `gemini-2.5-flash`)
- **Speech Integration**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)
- **Build Tooling**: Vite 6.2, TypeScript Compiler (`tsc`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; tested on v24)
- npm

### 1. Environment Setup
Create a `.env` file in the root directory (based on `.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the application runs gracefully with deterministic built-in contextual fallback responses).*

### 2. Install Dependencies
```bash
npm ci
```

### 3. Verify Code Quality & Build
```bash
npm run lint
npm run build
```

### 4. Start Development Server
```bash
npm run dev
```
The application and backend API server will start on port `3000`:
- **Web App**: `http://localhost:3000/`
- **Alexa+ Demo**: `http://localhost:3000/alexa-plus-demo.html`

### 5. Production Start
```bash
npm start
```

---

## 📡 Server API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/gemini/chat` | Context-aware event planner chat and navigational controller |
| `POST` | `/api/gemini/parse-plan` | Natural language event description parser into structured parameters |
| `POST` | `/api/gemini/personalized-invitation` | AI-generated personalized guest invitations with venue & time details |

---

## 📂 Project Structure

```
.
├── server.ts                 # Express backend server & Gemini API endpoints
├── public/
│   └── alexa-plus-demo.html  # Alexa+ Voice Companion Standalone Simulation Demo
├── src/
│   ├── main.tsx              # Application entry point
│   ├── App.tsx               # Root layout & tab router
│   ├── index.css             # Tailwind CSS styling
│   ├── types.ts              # Domain TypeScript interfaces & types
│   ├── context/
│   │   └── PartyContext.tsx  # Unified state management, calculations & intent parser
│   ├── data/
│   │   └── sampleEvents.ts   # Preset party configurations & item catalog
│   ├── utils/
│   │   ├── calculations.ts   # Core math, calendar links & budget optimizer
│   │   └── geminiFallback.ts # Offline fallback response generators
│   └── components/
│       ├── NavbarHeader.tsx       # Global top navigation & quick actions
│       ├── SidebarNav.tsx         # Canonical tab navigation sidebar
│       ├── DashboardView.tsx      # Executive party status overview
│       ├── PartyPlannerView.tsx   # Event creator & AI prompt generator
│       ├── ShoppingListView.tsx   # CymbalMart 9-aisle shopping manager
│       ├── BudgetView.tsx         # Visual spend & AI budget optimizer
│       ├── GuestListView.tsx      # Roster, RSVPs, & guest recalculator
│       ├── InvitationsView.tsx    # AI personalized invitations hub
│       ├── VenueView.tsx          # Google Maps & parking logistics
│       ├── CalendarView.tsx       # Run-of-show & .ICS calendar export
│       ├── FinalReviewView.tsx    # Readiness check & cart staging
│       ├── AIAssistantDrawer.tsx  # Voice & text AI assistant drawer
│       └── ToastContainer.tsx     # Feedback notifications
├── HACKATHON_ALEXA_PLUS.md   # Official Alexa+ Hackathon Submission Pack & Video Guide
├── metadata.json             # Applet configuration
├── package.json              # Project dependencies & build scripts
├── package-lock.json         # Deterministic npm package lockfile
├── tsconfig.json             # TypeScript compiler configuration
└── vite.config.ts            # Vite configuration
```

---

## Author

**Badal Kumar Sahu**  
📧 Email: badalsahu200ns@gmail.com  
🔗 LinkedIn: [Badal Kumar Sahu](https://www.linkedin.com/in/badalsahu200ns/)  

## 📄 License
MIT License. Built for seamless event planning and retail convenience with CymbalMart.
