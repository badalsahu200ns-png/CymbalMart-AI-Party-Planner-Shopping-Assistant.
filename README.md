# CymbalMart AI Party Planner
**Tagline:** *Plan smarter. Shop with purpose. Celebrate more.*  
**Created by:** Badal Kumar Sahu  
- **Portfolio:** [badalsahu200ns-png.github.io](https://badalsahu200ns-png.github.io/)
- **LinkedIn:** [linkedin.com/in/badalsahu200ns](https://www.linkedin.com/in/badalsahu200ns)
- **GitHub:** [github.com/badalsahu200ns-png](https://github.com/badalsahu200ns-png)
- **Alexa+ Demo Companion:** [`/alexa-plus-demo.html`](/alexa-plus-demo.html) | [`HACKATHON_ALEXA_PLUS.md`](HACKATHON_ALEXA_PLUS.md)

---

## 🌟 Reference Video UI Architecture & Experience

CymbalMart AI Party Planner recreates the modern SaaS reference interface with a clean, premium dashboard:
- **Design System:** White & soft-gray (`bg-slate-50`, `bg-white`) backgrounds, rounded cards, refined drop shadows, thin borders, and **emerald-green accents** (`#10b981`, `#059669`) for primary buttons, active states, progress indicators, and circular budget gauges.
- **Dark Navy Typography:** Modern sans-serif font with clear typographic hierarchy and accessible contrast.
- **10-Second Interactive Product Showcase:** Built-in storyboard modal (`Second 0–10`) reproducing each frame of the reference video journey with auto-play and step controls.

---

## 🧭 The 10 Canonical Navigation Hubs

The left navigation sidebar features 10 dedicated management hubs:

1. **My Hub (`my-hub`)** — Personalized dashboard featuring **Screen A (Celebrationstart AI Party Planner)**, prompt input, and upcoming celebration snapshot.
2. **Events (`events`)** — Multi-event manager to create, track, switch, and duplicate celebrations.
3. **Planning (`planning`)** — **Screen B (Event Planning Workspace)** featuring event countdown, *Planning*, *Pending*, and *Milestones* sub-tabs, checklists, and live RSVP roster.
4. **Celebrations (`celebrations`)** — Occasions & themes explorer for Anniversary, Office Gala, Birthday, Family, Retirement, and Graduation events.
5. **Shopping (`shopping`)** — **Screen C (Smart Shopping Dashboard)** with category filter pills, product photography, procurement checklist with checkboxes, unit & total pricing, savings indicators, Green "Add to Cart / Save List" button, and the **Circular Spending Progress Ring**.
6. **Suppliers (`suppliers`)** — Hand-vetted partner directory across Venues, Catering, Decor & Flowers, Bakery, Photography, and Music & DJ.
7. **Budgets (`budgets`)** — Financial breakdown in INR (₹) with AI budget optimization and 1-click alternative swaps.
8. **Reports (`reports`)** — **Screen D (Reports & Spending Analytics)** with expense category progress bars, audit readiness score (0–100%), and print export.
9. **Settings (`settings`)** — User identity, regional currency selection (INR, USD, EUR, GBP), and alert triggers.
10. **Send Feedback (`feedback`)** — Community feedback form with 5-star ratings, category tags, and instant confirmation.

---

## 🎬 Reference Video Screen Architecture

### Screen A — Celebrationstart AI Party Planner
- **Heading:** *"Celebrationstart AI Party Planner"*
- **Subheading:** *"Let our AI build your timeline, budget, and shopping list in seconds."*
- **Main Input:** *"Tell us about your event…"* with emerald Submit button.
- **6 Photographic Category Cards:**
  1. *Anniversary Party* — Milestone memories & romantic ambiance
  2. *Office Gala* — Corporate banquets & team triumphs
  3. *Birthday Party* — Festive balloons & gourmet cakes
  4. *Family Party* — Warm reunions & outdoor BBQ picnics
  5. *Retirement Party* — Career tributes & golden horizons
  6. *Graduation Celebration* — Academic cap tosses & future beginnings

### Screen B — Event Planning Workspace
- Celebration title, countdown badge (e.g., *"12 Days to Go"*), location, and budget status.
- Workspace sub-tabs: **Planning**, **Pending**, and **Milestones**.
- Interactive checklists with checkboxes and category filters.
- Guest roster with live RSVP tally (**Confirmed**, **Pending**, **Declined**).
- Curated suggested suppliers with quick detail actions.

### Screen C — Smart Shopping Dashboard
- Category filter pills (*All*, *Food*, *Drinks*, *Cake & Desserts*, *Decorations*, *Tableware*, *Entertainment*, *Guest Supplies*).
- **Product photography** for items.
- Item checklist with checkboxes, quantity increment/decrement controls, unit price, and total price.
- **Estimated savings indicator** for smart bulk alternative swaps.
- **Green "Add to Cart / Save List"** action button.
- **Circular Spending Progress Indicator**: Dynamic SVG gauge displaying % of budget utilized in emerald green (or red warning if over-budget).

### Screen D — Reports & Budget Summary
- Expense breakdown by category with emerald progress bars.
- Financial metrics: Total Allocated Spending vs. Budget vs. Optimized Savings Potential.
- Event Completeness Score with automated audit advice.
- Printable report generation.

---

## ⏱️ 10-Second Interactive Product Showcase

Accessible via the top navbar (**"Watch Demo (10s)"**) and sidebar:
- **Second 0–1:** Lifestyle tablet overview & modern SaaS interface
- **Second 2–3:** Screen A (Celebrationstart AI prompt & 6 Category Cards)
- **Second 4–5:** Screen B (Planning workspace, tasks, and RSVPs)
- **Second 6–7:** Screen C (Smart shopping dashboard & circular budget ring)
- **Second 8–9:** Screen D (Reports, category progress bars, and curated suppliers)
- **Second 10:** Closing CymbalMart AI brand title screen with Badal Kumar Sahu attribution

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React icons.
- **Backend:** Node.js, Express, Google GenAI SDK (`gemini-2.5-flash`).
- **Conversational AI:** Integrated Alexa-style voice and text assistant with bidirectional state synchronization.
- **State Management:** Unified `PartyContext` single source of truth across all 10 canonical views.

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript typecheck
npm run lint

# 3. Build production bundle
npm run build

# 4. Start full-stack server
node server.ts
# Visit http://localhost:3000
```

---

## 👨‍💻 Creator Attribution

**Badal Kumar Sahu**  
- **Portfolio:** [https://badalsahu200ns-png.github.io/](https://badalsahu200ns-png.github.io/)  
- **LinkedIn:** [https://www.linkedin.com/in/badalsahu200ns](https://www.linkedin.com/in/badalsahu200ns)  
- **GitHub:** [https://github.com/badalsahu200ns-png](https://github.com/badalsahu200ns-png)  
