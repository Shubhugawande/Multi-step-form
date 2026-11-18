# Frontend Mentor - Multi-step form solution

This is a complete, enhanced solution to the [Multi-step form challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/multistep-form-YVAnSdqQBJ). It reproduces the official desktop (`1440px`) and mobile (`375px`) designs using clean, modular **HTML5 (`index.html`)**, **CSS3 (`style.css`)**, and **Vanilla JavaScript (`script.js`)**, while adding thoughtful UI/UX enhancements such as live price estimation, promo code discounts, `localStorage` auto-save, a downloadable order receipt, and a built-in Desktop/Mobile viewport simulator.

## Overview

### The challenge

Users are able to:

- Complete each step of the 4-step subscription sequence (`Personal Info` → `Select Plan` → `Pick Add-ons` → `Finishing Up`) and reach the final `Thank You!` confirmation screen
- Go back to any previous step (via the **Go Back** button, the sidebar step indicators, or the **Change** link on Step 4) to update their selections
- View a dynamically calculated summary of their plan and add-on selections on Step 4 before confirming their order
- View the optimal layout for the interface depending on their device's screen size (mobile-first layout under `768px` and split sidebar card layout on desktop screens `768px` and above)
- See crisp hover, active, and keyboard `:focus-visible` states for all interactive elements on the page
- Receive immediate and submit-time form validation messages if:
  - Any required personal info field (`Name`, `Email Address`, `Phone Number`) has been missed (`This field is required`)
  - The email address is not formatted correctly (`Invalid email format`)
  - The phone number contains fewer than 7 digits or invalid characters (`Invalid phone number`)
  - A step is submitted when no subscription plan selection has been made

### Beyond the Brief: Extra UI & Functional Enhancements

In addition to fulfilling every requirement from the [Frontend Mentor](https://www.frontendmentor.io?ref=challenge) brief, this build adds:

1. **Live Sidebar Estimate Widget**: Shows the currently selected plan, number of active add-ons, billing cycle badge (`Monthly` / `Yearly`), and running total right inside the desktop sidebar.
2. **Interactive Promo Code System (Step 4)**: Supports instant promotional discounts (`GAMER20` for **20% off** and `WELCOME10` for **10% off**) with one-click preset pills, strikethrough original totals, and discount badges.
3. **One-Click Billing Cycle Switch on Summary**: Allows users to toggle between `Monthly` and `Yearly (2 months free)` directly from Step 4 without losing their place.
4. **Auto-Save Persistence (`localStorage`)**: Automatically saves form inputs, selected plan, billing cycle, and add-ons so progress is preserved across page reloads.
5. **Order Confirmation Receipt & `.txt` Download (Step 5)**: Generates a unique order ID (`#LG-XXXXX`), displays a structured receipt card on the confirmation view, and lets users download a formatted `.txt` receipt or click **Modify Subscription** to edit their order.
6. **Top Utility Bar (Auto-Fill Demo, Reset & Mobile 375px Simulator)**: Lets reviewers populate valid sample data (`Vanessa Mint`) in one click, reset the form, or preview the `375px` mobile layout inside a phone frame on any desktop screen.

## Project File Structure

```text
multi-step-form-main/
├── index.html                  # Semantic HTML5 markup linking ./style.css and ./script.js
├── style.css                   # Modular CSS3 stylesheet with custom properties & responsive rules
├── script.js                   # Vanilla JS state machine, validation, pricing & DOM renderer
├── README.md                   # Complete project documentation (this file)
├── style-guide.md              # Official color palette and Ubuntu typography specifications
├── preview.jpg                 # Challenge desktop preview image
├── assets/
│   ├── fonts/
│   │   ├── Ubuntu-Regular.ttf  # Weight 400
│   │   ├── Ubuntu-Medium.ttf   # Weight 500
│   │   └── Ubuntu-Bold.ttf     # Weight 700
│   └── images/
│       ├── bg-sidebar-desktop.svg
│       ├── bg-sidebar-mobile.svg
│       ├── favicon-32x32.png
│       ├── icon-advanced.svg
│       ├── icon-arcade.svg
│       ├── icon-checkmark.svg
│       ├── icon-pro.svg
│       └── icon-thank-you.svg
└── design/                     # Reference JPG mockups for Steps 1–5 (Desktop, Mobile & Active states)
```

## My process

### Built with

- **Semantic HTML5** (`<main>`, `<aside>`, `<nav>`, `<section>`, ARIA roles `radiogroup`, `radio`, `checkbox`, `switch`, and `alert`)
- **CSS Custom Properties (Variables)** mapped directly to the official [Frontend Mentor](https://www.frontendmentor.io?ref=challenge) `style-guide.md` HSL tokens
- **CSS Flexbox & CSS Grid** for the 3-column plan selector and responsive split-pane card layout
- **Mobile-first workflow** transitioning seamlessly at `768px` (`@media (min-width: 768px)`)
- **Vanilla JavaScript (ES6+)** with zero external framework dependencies
- **[Ubuntu Font](https://fonts.google.com/specimen/Ubuntu)** loaded via both local `@font-face` (`./assets/fonts/`) and Google Fonts fallback (`400`, `500`, `700`)

### Design System & Style Guide Reference

| Token Name | CSS Variable | HSL Value | Usage in UI |
| :--- | :--- | :--- | :--- |
| **Blue 950 (Marine Blue)** | `--blue-950` | `hsl(213, 96%, 18%)` | Headings, primary text, Next Step button, billing switch track |
| **Purple 600 (Purplish Blue)** | `--purple-600` | `hsl(243, 100%, 62%)` | Active borders, checked checkboxes, Confirm button, final total price |
| **Blue 300 (Pastel Blue)** | `--blue-300` | `hsl(228, 100%, 84%)` | Sidebar step subtitle labels (`STEP 1`, `STEP 2`, etc.) |
| **Blue 200 (Light Blue)** | `--blue-200` | `hsl(206, 94%, 87%)` | Active step number circle fill inside sidebar |
| **Red 500 (Strawberry Red)** | `--red-500` | `hsl(354, 84%, 57%)` | Validation error text and invalid input border state |
| **Grey 500 (Cool Gray)** | `--grey-500` | `hsl(231, 11%, 63%)` | Body descriptions, placeholders, secondary labels, Go Back button |
| **Purple 200 (Light Gray)** | `--purple-200` | `hsl(229, 24%, 87%)` | Default input and card borders, summary divider line |
| **Blue 100 (Magnolia)** | `--blue-100` | `hsl(218, 100%, 97%)` | Page background behind the main card |
| **Blue 50 (Alabaster)** | `--blue-50` | `hsl(231, 100%, 99%)` | Selected plan/add-on card background, billing bar, summary box |
| **White** | `--white` | `hsl(0, 100%, 100%)` | Main card surface, sidebar text, input backgrounds |

### Subscription & Add-on Pricing Matrix

| Item | Category | Monthly Billing | Yearly Billing (2 Months Free) |
| :--- | :--- | :--- | :--- |
| **Arcade** | Plan | `$9/mo` | `$90/yr` |
| **Advanced** | Plan | `$12/mo` | `$120/yr` |
| **Pro** | Plan | `$15/mo` | `$150/yr` |
| **Online service** | Add-on | `+$1/mo` | `+$10/yr` |
| **Larger storage** | Add-on | `+$2/mo` | `+$20/yr` |
| **Customizable profile** | Add-on | `+$2/mo` | `+$20/yr` |

### What I learned

#### 1. Accessible Custom Radio & Switch Controls in HTML/JS

Instead of relying on hidden native inputs that can lose keyboard focus styling, the plan cards and billing switch use explicit ARIA roles (`role="radiogroup"`, `role="radio"`, `role="switch"`, `role="checkbox"`) paired with `aria-checked` state synchronization and keyboard handlers (`Space` / `Enter`):

```html
<button
  type="button"
  id="billingToggleBtn"
  role="switch"
  aria-checked="false"
  aria-label="Toggle between monthly and yearly billing"
  onclick="toggleBillingCycle()"
  class="billing-toggle"
>
  <span id="billingToggleThumb" class="billing-toggle__thumb"></span>
</button>
```

#### 2. Mobile-First Overlapping Card Architecture in CSS

On screens below `768px`, the top banner uses `bg-sidebar-mobile.svg` (`172px` tall) while the white step card overlaps it using a negative top margin (`margin-top: -73px`), matching the mobile mockup:

```css
.form-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 1rem 6rem;
  margin-top: -73px;
  z-index: 10;
}

@media (min-width: 768px) {
  .app-shell:not(.is-mobile-preview) .form-column {
    margin-top: 0;
    padding: 2.25rem 5.25rem 1rem;
  }
}
```

#### 3. Centralized Pure Calculation Function in JavaScript

Keeping all pricing math inside a single pure helper (`calculateTotals()`) guarantees that the Step 2 cards, Step 3 add-ons, Step 4 summary breakdown, sidebar live estimate, and Step 5 downloadable receipt never drift out of sync:

```js
function calculateTotals() {
  const plan = PLANS_CATALOG.find(p => p.id === state.planId) || PLANS_CATALOG[0];
  const isYearly = state.billing === 'yearly';
  const unitSuffix = isYearly ? '/yr' : '/mo';
  const planCost = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

  const selectedAddons = ADDONS_CATALOG.filter(a => state.addons.includes(a.id)).map(a => ({
    ...a,
    cost: isYearly ? a.yearlyPrice : a.monthlyPrice
  }));

  const addonsCost = selectedAddons.reduce((sum, item) => sum + item.cost, 0);
  const subtotal = planCost + addonsCost;

  const promo = state.promoCode ? PROMO_CODES[state.promoCode] : null;
  const discountAmount = promo ? Math.round((subtotal * promo.discountPercent) / 100) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return { plan, isYearly, unitSuffix, planCost, selectedAddons, subtotal, promo, discountAmount, finalTotal };
}
```

## How to Run Locally & Deploy

1. **Extract the project folder**:
   Unzip `multi-step-form-main.zip` on your computer.
2. **Open directly or with a local server**:
   - Double-click `index.html` to open it directly in any modern browser, or
   - Run a local server such as VS Code **Live Server** or Python:
     ```bash
     python3 -m http.server 8000
     ```
     Then open `http://localhost:8000` in your browser.
3. **Deploy for free**:
   Push the folder to a repository on [GitHub](https://github.com/) and publish via [GitHub Pages](https://pages.github.com/), [Vercel](https://vercel.com/), or [Netlify](https://www.netlify.com/).

## Useful resources

- [Frontend Mentor Challenge Page](https://www.frontendmentor.io/challenges/multistep-form-YVAnSdqQBJ) - Official challenge brief and specifications.
- [Google Fonts — Ubuntu Specimen](https://fonts.google.com/specimen/Ubuntu) - Official geometric sans-serif typeface used across all steps.
- [Markdown Guide](https://www.markdownguide.org/) - Documentation formatting reference.

## Acknowledgments

Challenge designed by [Frontend Mentor](https://www.frontendmentor.io?ref=challenge).
