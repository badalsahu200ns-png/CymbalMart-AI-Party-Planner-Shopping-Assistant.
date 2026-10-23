# Antigravity Implementation Prompt — CymbalMart PLANNER – Birthday Alexa-Inspired Voice Assistant

> **Purpose:** Paste the prompt below into Google Antigravity with this repository opened locally. Implement in the existing application; do not treat this document as proof that implementation or tests have already completed.

---

## Role and project

Act as a senior full-stack React/TypeScript engineer, conversational AI architect, voice UX designer, and QA engineer. Work directly in the existing project at:

`D:\New folder\CymbalMart-AI-Party-Planner-Git`

**Brand:** CymbalMart  
**Product:** PLANNER – Birthday  
**Tagline:** Smart Event & Shopping Assistant

Build a polished Alexa-inspired conversational assistant inside the main application. The user should be able to speak or type naturally, receive one relevant follow-up question at a time, and watch the real party plan and shopping list update as supported actions execute.

This is an Alexa-inspired web experience unless a real official Alexa/Alexa+ integration is implemented and independently verified. Never claim a real Alexa device connection, wake word, production Agent Skill, MCP server, or Amazon API integration without evidence.

## 1. Inspect and preserve the repository first

Before editing, inspect the current branch, `git status --short`, recent commits, remotes, `package.json`, `README.md`, `server.ts`, `vite.config.ts`, `.gitignore`, `HACKATHON_ALEXA_PLUS.md`, and the relevant files in `src/` and `public/`.

- Preserve existing React/Vite and server architecture, party-planning features, shopping-list state, Gemini integration, styling, creator contact page, and deployment configuration.
- Reuse existing components and business logic. Do not create a second shopping list or independent budget state.
- Do not overwrite user changes, replace the project with a starter template, disable type checking, or delete demo files before inspecting their dependencies.
- Never expose or commit secrets, API keys, `.env`, credentials, or private user data.
- Work on a feature branch where practical. Review the final diff before committing or pushing.

## 2. Remove the separate Alexa+ Demo tab

Remove the **Alexa+ Demo** tab/link from the main navigation and remove redundant entry points. Integrate useful assistant functionality into the main CymbalMart PLANNER – Birthday interface. Do not remove useful underlying logic simply because a tab is removed. Update stale navigation links and verify that other routes still work.

## 3. Welcome choice: automatic assistance or manual planning

On first entry to the main application in a session, show an accessible welcome panel:

**Welcome to CymbalMart PLANNER – Birthday**  
*Your Smart Event & Shopping Assistant. How would you like to plan today?*

Provide two clear options:

### Let Alexa Plan for Me
- Start the conversational assistant and focus its text input.
- Explain that microphone access is optional and requires browser permission.
- Guide the user through the party-planning conversation one question at a time.
- Extract all details already provided; do not ask for the same information twice.
- Execute clear, safe application actions and update the real UI/state immediately.
- Let the user review and edit suggestions before finishing.

### I'll Plan Manually
- Open the existing manual planning flow.
- Preserve the ability to enter event details, guest count, budget, and preferences; edit shopping items and quantities; remove items; and view recalculated totals.

Do not repeatedly interrupt a user after a choice has been made during the current session. Provide a visible way to reopen the assistant or switch modes. Keep the app usable if voice or Gemini is unavailable.

**Permission and safety:** Browsers and operating systems control microphone permissions. Never grant permissions programmatically or bypass the permission prompt. Request microphone access only after a user activates voice input, and provide text input when permission is denied or unsupported. Do not silently purchase items, place orders, send invitations, or perform other consequential external actions. Ask for appropriate confirmation before such actions.

## 4. Premium Alexa-inspired interface

Implement a cohesive, responsive interface—not a static mockup—with:
- A central animated blue/cyan/purple voice orb or restrained waveform.
- Clear listening, processing, speaking, waiting, completed, and error states.
- A readable conversation transcript and text composer.
- A microphone control, mute/speech toggle, stop/retry controls, and helpful permission messages.
- A live plan summary showing event details, guests, shopping items, quantities, estimated total, budget, and remaining budget.
- Loading indicators, confirmations, useful empty states, and understandable errors.
- Desktop, tablet, and mobile layouts; keyboard navigation; semantic controls; visible focus; accessible contrast; and reduced-motion support.

Use a clean sans-serif font. Use Inter or another properly licensed alternative if an appropriately licensed Alexa font asset is not already present. Do not describe a substitute as Amazon's official font. Keep brand naming consistent: **CymbalMart**, **PLANNER – Birthday**, **Smart Event & Shopping Assistant**.

## 5. Real step-by-step conversation

Create a predictable conversation controller/state machine, not just free-form AI replies. Maintain structured state for:
- Occasion/event type and optional honoree.
- Date/time and venue if supplied.
- Guest count.
- Audience/age group when relevant.
- Theme, colors, food/drink preferences, dietary restrictions, and decorations.
- Budget in INR.
- Shopping items, exact item identity, quantities, and illustrative estimated prices.
- Total estimate, remaining budget, unanswered essential fields, and completion status.

Ask one useful question at a time. Skip optional questions when the user wants to proceed. If a single message contains several details, save all valid details and ask only for the next missing useful detail. Allow the user to correct earlier answers at any stage.

Example:

Assistant: “Hi! Welcome to CymbalMart PLANNER. I can help organize your birthday, prepare a shopping list, and track your budget. What kind of birthday celebration are you planning?”

User: “An adult birthday for 12 guests with a budget of ₹5,000.”

The app must immediately save the event type, audience, guest count, and ₹5,000 budget, then ask a relevant next question—not repeat information already given.

Continue through useful details, propose a shopping list, show a review summary, and ask: “Your birthday plan is ready. Would you like to change anything, add items, review your budget, or finish planning?” A completed plan remains editable. Do not force every user through every optional question.

## 6. Voice input and spoken replies

Use browser-supported speech recognition (such as Web Speech API) when available, with proper feature detection and permission handling. Implement explicit states such as `idle`, `requesting_permission`, `listening`, `processing`, `speaking`, `awaiting_answer`, `executing_action`, `completed`, and `error`.

- Start recognition only after user activation and permission.
- Display the actual transcript and allow the user to correct it before submitting if practical.
- Handle denied permission, unsupported browsers, empty results, recognition errors, and cancellation.
- Prevent overlapping recognition sessions and duplicate submissions.
- Use browser speech synthesis for spoken responses where supported, with a mute/enable toggle.
- Avoid reading long shopping lists aloud unless requested.
- Never leave the microphone stuck in a listening state.
- Do not implement background recording or claim wake-word/continuous Alexa listening.
- Keep text chat fully functional without microphone or speech synthesis.

Wait for speech output to finish before offering the next voice turn when appropriate. Do not automatically restart listening without a clear, user-authorized interaction model.

## 7. Execute real application actions

Natural-language commands must change the canonical application state, not merely produce a conversational claim. Reuse existing state-management functions and recalculate dependent totals.

Required examples:
- “Plan a birthday party for 12 people with a budget of ₹5,000.”
- “Add two bottles of sparkling water.”
- “Remove balloons.”
- “Change my budget to ₹7,000.”
- “Show me my budget.”
- “How much money do I have left?”
- “Suggest decorations for a colorful birthday.”

For every action:
1. Parse intent and arguments.
2. Validate them.
3. Ask a clarifying question if the instruction is ambiguous.
4. Execute through trusted application functions.
5. Update the canonical state and visible UI.
6. Recalculate estimated total and remaining budget.
7. Only then confirm success.

Correctness rules:
- Process budget-setting intents before generic budget-query intents.
- Match “sparkling water” specifically; do not incorrectly match ordinary bottled water.
- Validate quantity as a positive, reasonable integer and budget as a valid non-negative amount.
- Handle nonexistent items gracefully.
- Prevent duplicate execution on retries.
- Do not use unsafe HTML rendering for user-provided text.
- Clearly label sample prices as illustrative, never live retail prices without verified live pricing.
- Never claim a purchase/order was completed.

## 8. Gemini and fallback behavior

Inspect and preserve the existing server-side Gemini integration and its request/response contracts, including:
- `POST /api/gemini/chat`
- `POST /api/gemini/parse-plan`
- `POST /api/gemini/personalized-invitation`

Use Gemini for natural-language interpretation and suggestions when configured. Validate model-produced structured actions at runtime before execution. The model may propose an action; trusted application logic must validate and apply it.

If the API key is absent, the service is unavailable, or a request fails:
- Keep deterministic text commands for essential operations where practical.
- Keep manual planning available.
- Show a useful fallback message.
- Do not fabricate a Gemini response or successful action.
- Do not expose keys or internal stack traces in the UI.

Do not change API contracts or add dependencies unnecessarily.

## 9. Required user journey and verification

Test this real journey:
1. Load the existing app and select **Let Alexa Plan for Me**.
2. Use voice where browser support and microphone permission permit; also test text input.
3. Create a birthday plan for 12 guests with a ₹5,000 budget.
4. Add two bottles of sparkling water.
5. Remove balloons.
6. Set the budget to ₹7,000.
7. Ask to show the budget and remaining balance.
8. Verify guest count, item quantities, total estimate, and remaining budget against the actual canonical state.
9. Answer another follow-up question, complete the review, and then edit the completed plan.
10. Test manual mode, invalid quantities, negative/invalid budgets, missing items, missing Gemini key, API failures, and unsupported/denied microphone.
11. Test mobile layout, keyboard interaction, page refresh, and navigation.
12. Check browser console and network/API responses where browser tooling is available.

Run:
- `npm.cmd run lint`
- `npm.cmd run build`

Fix actual failures and rerun checks. Use browser automation if available; otherwise distinguish verified HTTP/API tests from manual browser checks. Do not claim speech or end-to-end tests passed without executing them.

## 10. Documentation, Git, and deployment

Update `HACKATHON_ALEXA_PLUS.md` and/or the README to describe the implementation truthfully, including setup, how to demo the voice/text flow, browser limitations, illustrative pricing, fallback behavior, and remaining limitations. Do not claim official Alexa integration unless verified.

Inspect the current Git remote and deployment configuration. Review `git diff` and `git status --short`; ensure no secrets, accidental files, or generated artifacts are included. Do not push to `main` blindly. Deploy only through the existing hosting workflow and verify the actual live URL before reporting success.

## Final report required

Report:
1. Actual files changed and why.
2. Conversation flow and state architecture.
3. Voice input/output support and browser limitations.
4. Which actions were functionally verified.
5. Lint/build commands and exit codes.
6. API and browser test results, separating passed, failed, and not tested.
7. Remaining defects or configuration needs.
8. Git branch/commit and deployment status with verified URL if available.

**Acceptance standard:** A user can speak or type a request, answer contextual follow-up questions, see valid changes applied to the actual party plan, continue until a reviewable plan is ready, and make further edits. Preserve the existing application and report evidence honestly.
