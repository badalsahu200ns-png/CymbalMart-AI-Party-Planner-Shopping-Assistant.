# Amazon Developer Hackathon — Alexa+ Track Submission Pack

## Project
**CymbalMart Shopping Companion — Alexa+ simulated experience**

A voice-and-text party shopping companion that helps a host plan an event, add or remove shopping items, and track an estimated budget in a shared live interface. The demo reuses the CymbalMart party-planning concept and is explicitly a simulated Alexa+ style web experience, not an official Amazon/Alexa+ integration.

## Demo entry point
- File: `public/alexa-plus-demo.html`
- After this branch is merged into the default branch and the app is deployed, the file can be served as `/alexa-plus-demo.html` on a host that publishes the `public/` directory. Verify the actual deployed URL before submitting.
- Run the existing app locally with `npm install` and `npm run dev`; the demo file is a static standalone page and can also be opened directly in a browser.
- Voice recognition depends on browser support and microphone permission. Text commands are the reliable fallback.
- The interface uses sample prices and no live retail inventory or checkout.

## Demo flow (target under 3 minutes)
1. **0:00–0:20 — Context:** Explain the problem: planning a party means juggling guest count, shopping quantities, and budget across separate tasks.
2. **0:20–0:45 — Plan:** Click “Plan a birthday party” or type: `Plan a birthday party for 12 people with a budget of 5000 rupees`. Show the guest count, event label, budget, and starter list update.
3. **0:45–1:15 — Voice/text interaction:** Type `Add 2 bottles of sparkling water`. Show the assistant reply and list total update. If speech recognition works on the demo device, demonstrate the microphone once; otherwise stay with text.
4. **1:15–1:40 — Shopping changes:** Use `Remove balloons`, then show the list update.
5. **1:40–2:00 — Budget:** Use `Set my budget to 7000 rupees`, then `Show my budget`. Confirm the budget figure changes and the spend bar reflects the current total.
6. **2:00–2:25 — User value:** Explain that this is a prototype of a more natural, voice-first assistant workflow, with shared state across requests.
7. **2:25–2:50 — Honesty/close:** State clearly that this submission uses the permitted simulated-experience path, and that the current demo does not connect to an Alexa+ device or production Alexa+ MCP service.

Record a public YouTube or Vimeo video in English, keep it under 3 minutes, and check that the link opens in a signed-out/private browser before pasting it into Devpost.

## Pre-submit verification checklist
- [ ] Open the demo file in a desktop browser and a narrow/mobile viewport.
- [ ] Click each suggested command and verify that the chat and state update.
- [ ] Verify `Set my budget to 7000 rupees` updates the budget rather than only reporting it.
- [ ] Verify adding an item updates the estimated total; removing balloons removes the item.
- [ ] Test the microphone only if supported; verify text still works when microphone permission is denied.
- [ ] Check browser console for errors and reload the page to confirm the standalone demo starts cleanly.
- [ ] Record and publish the demo video (public, English, under 3 minutes).
- [ ] Confirm the correct GitHub branch is merged/published and the exact live demo URL works before entering it on Devpost.
- [ ] Complete all required Devpost fields, including the tool/SDK product feedback.
- [ ] Select Alexa+ as the primary track. Select AWS Builder only if the project genuinely uses an AWS service/tool in a documented integration. Select Open Source only if the required additional project/contribution and license requirements are actually met.

## Product feedback — honest draft to edit after testing
**Tool used:** Existing CymbalMart React/Vite interface, browser Web Speech API where available, and Google Gemini API in the original application.

**What it was used for:** Prototyping a voice-first shopping and party-planning flow with natural-language commands and a shared shopping/budget view. The standalone hackathon demo is a simulated experience and does not call an Alexa+ MCP server or Agent Skill.

**What worked well:** The browser-based prototype makes the interaction easy to demonstrate without a physical Alexa device. Text input provides a fallback when browser speech recognition is unavailable. Shared in-page state makes shopping and budget changes visible immediately.

**What needs work:** The demo uses sample product prices and a small command set. Voice recognition support varies by browser. It is not connected to live inventory, ordering, Alexa+ accounts, or production Alexa+ APIs.

**Onboarding experience:** A web simulation is a quick way to prototype an assistant interaction, but the distinction between simulated Alexa+ behavior and a real MCP/Agent Skill integration must be explicit. Add actual notes about documentation/setup friction encountered while you build and test; do not claim SDKs were tested if they were not.

**Would I build with it again?** The simulated path is useful for rapid UX validation. For a production Alexa+ integration, I would next implement and test the required MCP server or Agent Skill against the official developer documentation.

> Before submitting feedback, replace any statement that does not match what you personally tested. This is a draft, not a claim that all tools or APIs have been verified.

## Important status note
This branch contains the demo and this submission pack. It has not been deployed or merged just by being committed. Confirm the final merge/deployment and public URLs yourself before submitting.
