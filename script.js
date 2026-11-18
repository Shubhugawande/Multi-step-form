/**
 * Frontend Mentor | Multi-Step Form — Application Logic (script.js)
 * Features:
 *  - Complete 4-Step sequence + Step 5 Thank You confirmation
 *  - Real-time & submit form validation (missing fields, email regex, phone digits, plan selection)
 *  - Monthly / Yearly billing toggle with "2 months free" yearly calculation
 *  - Dynamic add-ons selection & itemized summary calculation
 *  - Promo code support (GAMER20 for 20% off, WELCOME10 for 10% off)
 *  - Auto-save state persistence via localStorage
 *  - Downloadable .txt order receipt & Desktop/Mobile (375px) viewport simulator
 */

const STEPS_META = [
  { number: 1, label: 'YOUR INFO' },
  { number: 2, label: 'SELECT PLAN' },
  { number: 3, label: 'ADD-ONS' },
  { number: 4, label: 'SUMMARY' }
];

const PLANS_CATALOG = [
  {
    id: 'arcade',
    name: 'Arcade',
    monthlyPrice: 9,
    yearlyPrice: 90,
    yearlyPromo: '2 months free',
    iconPath: './assets/images/icon-arcade.svg'
  },
  {
    id: 'advanced',
    name: 'Advanced',
    monthlyPrice: 12,
    yearlyPrice: 120,
    yearlyPromo: '2 months free',
    iconPath: './assets/images/icon-advanced.svg'
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 15,
    yearlyPrice: 150,
    yearlyPromo: '2 months free',
    iconPath: './assets/images/icon-pro.svg'
  }
];

const ADDONS_CATALOG = [
  {
    id: 'online',
    name: 'Online service',
    desc: 'Access to multiplayer games',
    monthlyPrice: 1,
    yearlyPrice: 10
  },
  {
    id: 'storage',
    name: 'Larger storage',
    desc: 'Extra 1TB of cloud save',
    monthlyPrice: 2,
    yearlyPrice: 20
  },
  {
    id: 'profile',
    name: 'Customizable profile',
    desc: 'Custom theme on your profile',
    monthlyPrice: 2,
    yearlyPrice: 20
  }
];

const PROMO_CODES = {
  GAMER20: { code: 'GAMER20', discountPercent: 20, label: '20% OFF' },
  WELCOME10: { code: 'WELCOME10', discountPercent: 10, label: '10% OFF' }
};

const STORAGE_KEY = 'fm_multistep_form_modular_v1';

let state = {
  currentStep: 1,
  maxUnlockedStep: 1,
  confirmed: false,
  orderId: 'LG-84920',
  viewportMode: 'responsive',
  personalInfo: {
    name: '',
    email: '',
    phone: ''
  },
  planId: 'arcade',
  billing: 'monthly',
  addons: ['online', 'storage'],
  promoCode: null
};

/* ==========================================================================
   1. State Persistence & Notifications
   ========================================================================== */
function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        state = {
          ...state,
          ...parsed,
          personalInfo: {
            ...state.personalInfo,
            ...(parsed.personalInfo || {})
          }
        };
      }
    }
  } catch (err) {
    // Fallback gracefully if localStorage is restricted
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Ignore storage write errors
  }
}

function showToast(message) {
  const toast = document.getElementById('toastBanner');
  const text = document.getElementById('toastText');
  if (!toast || !text) return;
  text.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2400);
}

/* ==========================================================================
   2. Viewport Mode Switcher (Responsive vs. 375px Mobile Preview)
   ========================================================================== */
function setViewportMode(mode) {
  state.viewportMode = mode;
  const appShell = document.getElementById('appShell');
  const btnResp = document.getElementById('btnViewResponsive');
  const btnMob = document.getElementById('btnViewMobile');

  if (appShell) {
    if (mode === 'mobile') {
      appShell.classList.add('is-mobile-preview');
    } else {
      appShell.classList.remove('is-mobile-preview');
    }
  }

  if (btnResp && btnMob) {
    btnResp.classList.toggle('is-active', mode !== 'mobile');
    btnMob.classList.toggle('is-active', mode === 'mobile');
  }

  saveState();
  renderAll();
}

/* ==========================================================================
   3. Form Validation (Step 1 & Step 2)
   ========================================================================== */
function validateSingleField(field) {
  const val = (state.personalInfo[field] || '').trim();
  const inputMap = {
    name: document.getElementById('inputName'),
    email: document.getElementById('inputEmail'),
    phone: document.getElementById('inputPhone')
  };
  const errMap = {
    name: document.getElementById('errName'),
    email: document.getElementById('errEmail'),
    phone: document.getElementById('errPhone')
  };

  const inputEl = inputMap[field];
  const errEl = errMap[field];
  if (!inputEl || !errEl) return true;

  let errorMessage = '';
  if (!val) {
    errorMessage = 'This field is required';
  } else if (field === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(val)) {
      errorMessage = 'Invalid email format';
    }
  } else if (field === 'phone') {
    const digits = val.replace(/\D/g, '');
    if (digits.length < 7 || !/^[+\d\s()-]+$/.test(val)) {
      errorMessage = 'Invalid phone number';
    }
  }

  if (errorMessage) {
    errEl.textContent = errorMessage;
    errEl.classList.remove('hidden');
    inputEl.classList.add('has-error');
    return false;
  } else {
    errEl.classList.add('hidden');
    inputEl.classList.remove('has-error');
    return true;
  }
}

function validateStep1() {
  const vName = validateSingleField('name');
  const vEmail = validateSingleField('email');
  const vPhone = validateSingleField('phone');
  return vName && vEmail && vPhone;
}

function validateStep2() {
  const errPlan = document.getElementById('errPlan');
  if (!state.planId) {
    if (errPlan) errPlan.classList.remove('hidden');
    return false;
  }
  if (errPlan) errPlan.classList.add('hidden');
  return true;
}

/* ==========================================================================
   4. User Interaction Handlers
   ========================================================================== */
function handleFieldInput(field, value) {
  state.personalInfo[field] = value;
  const errMap = {
    name: document.getElementById('errName'),
    email: document.getElementById('errEmail'),
    phone: document.getElementById('errPhone')
  };
  if (errMap[field] && !errMap[field].classList.contains('hidden')) {
    validateSingleField(field);
  }
  saveState();
}

function selectPlan(planId) {
  state.planId = planId;
  const errPlan = document.getElementById('errPlan');
  if (errPlan) errPlan.classList.add('hidden');
  saveState();
  renderPlanCards();
  renderSidebarEstimate();
  renderSummary();
}

function setBillingCycle(cycle) {
  state.billing = cycle;
  saveState();
  renderPlanCards();
  renderBillingToggle();
  renderAddons();
  renderSidebarEstimate();
  renderSummary();
}

function toggleBillingCycle() {
  setBillingCycle(state.billing === 'monthly' ? 'yearly' : 'monthly');
}

function toggleAddon(addonId) {
  const idx = state.addons.indexOf(addonId);
  if (idx > -1) {
    state.addons.splice(idx, 1);
  } else {
    state.addons.push(addonId);
  }
  saveState();
  renderAddons();
  renderSidebarEstimate();
  renderSummary();
}

function applyPresetPromo(code) {
  const input = document.getElementById('promoInput');
  if (input) input.value = code;
  handleApplyPromoInput();
}

function handleApplyPromoInput() {
  const input = document.getElementById('promoInput');
  const feedback = document.getElementById('promoFeedback');
  const raw = (input ? input.value : '').trim().toUpperCase();

  if (!raw) {
    state.promoCode = null;
    if (feedback) {
      feedback.textContent = 'Promo code cleared.';
      feedback.className = 'promo-feedback';
    }
  } else if (PROMO_CODES[raw]) {
    state.promoCode = raw;
    if (feedback) {
      feedback.textContent = `Applied ${PROMO_CODES[raw].code} (${PROMO_CODES[raw].label})!`;
      feedback.className = 'promo-feedback promo-feedback--ok';
    }
    showToast(`Promo code ${raw} applied!`);
  } else {
    if (feedback) {
      feedback.textContent = 'Invalid code. Try GAMER20 or WELCOME10.';
      feedback.className = 'promo-feedback promo-feedback--err';
    }
  }
  saveState();
  renderSummary();
  renderSidebarEstimate();
}

/* ==========================================================================
   5. Step Navigation & Order Confirmation
   ========================================================================== */
function goToStep(targetStep) {
  if (state.confirmed && targetStep < 5) {
    state.confirmed = false;
  }
  if (targetStep > state.currentStep) {
    if (state.currentStep === 1 && !validateStep1()) return;
    if (state.currentStep === 2 && !validateStep2()) return;
  }
  state.currentStep = targetStep;
  if (targetStep > state.maxUnlockedStep && targetStep <= 4) {
    state.maxUnlockedStep = targetStep;
  }
  saveState();
  renderAll();
}

function handleNextStep() {
  if (state.currentStep === 1) {
    if (!validateStep1()) return;
    goToStep(2);
  } else if (state.currentStep === 2) {
    if (!validateStep2()) return;
    goToStep(3);
  } else if (state.currentStep === 3) {
    goToStep(4);
  } else if (state.currentStep === 4) {
    confirmOrder();
  }
}

function handlePrevStep() {
  if (state.currentStep > 1 && state.currentStep <= 4) {
    goToStep(state.currentStep - 1);
  }
}

function confirmOrder() {
  if (!validateStep1()) {
    goToStep(1);
    return;
  }
  if (!validateStep2()) {
    goToStep(2);
    return;
  }
  state.confirmed = true;
  state.orderId = 'LG-' + Math.floor(10000 + Math.random() * 90000);
  state.currentStep = 5;
  saveState();
  renderAll();
  showToast('Subscription confirmed!');
}

function editConfirmedOrder() {
  state.confirmed = false;
  state.currentStep = 2;
  saveState();
  renderAll();
}

function fillDemoData() {
  state.personalInfo = {
    name: 'Vanessa Mint',
    email: 'vanessamint@lorem.com',
    phone: '+1 234 567 890'
  };
  state.maxUnlockedStep = 4;
  const nameEl = document.getElementById('inputName');
  const emailEl = document.getElementById('inputEmail');
  const phoneEl = document.getElementById('inputPhone');
  if (nameEl) nameEl.value = state.personalInfo.name;
  if (emailEl) emailEl.value = state.personalInfo.email;
  if (phoneEl) phoneEl.value = state.personalInfo.phone;
  validateStep1();
  saveState();
  renderAll();
  showToast('Sample details filled!');
}

function resetFormState() {
  state = {
    currentStep: 1,
    maxUnlockedStep: 1,
    confirmed: false,
    orderId: 'LG-84920',
    viewportMode: state.viewportMode,
    personalInfo: { name: '', email: '', phone: '' },
    planId: 'arcade',
    billing: 'monthly',
    addons: ['online', 'storage'],
    promoCode: null
  };

  const promoInput = document.getElementById('promoInput');
  const promoFeedback = document.getElementById('promoFeedback');
  if (promoInput) promoInput.value = '';
  if (promoFeedback) promoFeedback.className = 'promo-feedback hidden';

  ['errName', 'errEmail', 'errPhone', 'errPlan'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  ['inputName', 'inputEmail', 'inputPhone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('has-error');
  });

  saveState();
  renderAll();
  showToast('Form reset to Step 1');
}

/* ==========================================================================
   6. Calculation & Rendering Engine
   ========================================================================== */
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

  return {
    plan,
    isYearly,
    unitSuffix,
    planCost,
    selectedAddons,
    subtotal,
    promo,
    discountAmount,
    finalTotal
  };
}

function renderStepNavigation() {
  const activeVisualStep = state.currentStep === 5 ? 4 : state.currentStep;
  const desktopNav = document.getElementById('desktopStepNav');
  const mobileNav = document.getElementById('mobileStepNav');

  if (desktopNav) {
    desktopNav.innerHTML = STEPS_META.map(step => {
      const isActive = step.number === activeVisualStep;
      const isCompleted = step.number < activeVisualStep || state.confirmed;
      return `
        <button
          type="button"
          class="step-nav-item"
          onclick="goToStep(${step.number})"
          title="Step ${step.number}: ${step.label}"
        >
          <span class="step-circle ${isActive ? 'is-active' : ''}">${step.number}</span>
          <span>
            <span class="step-meta__number">STEP ${step.number}</span>
            <span class="step-meta__label">
              <span>${step.label}</span>
              ${isCompleted && !isActive ? '<span class="step-done-check" title="Completed">✓</span>' : ''}
            </span>
          </span>
        </button>
      `;
    }).join('');
  }

  if (mobileNav) {
    mobileNav.innerHTML = STEPS_META.map(step => {
      const isActive = step.number === activeVisualStep;
      return `
        <button
          type="button"
          class="step-circle ${isActive ? 'is-active' : ''}"
          onclick="goToStep(${step.number})"
          aria-label="Step ${step.number}: ${step.label}"
        >
          ${step.number}
        </button>
      `;
    }).join('');
  }
}

function renderInputs() {
  const nameEl = document.getElementById('inputName');
  const emailEl = document.getElementById('inputEmail');
  const phoneEl = document.getElementById('inputPhone');

  if (nameEl && document.activeElement !== nameEl) nameEl.value = state.personalInfo.name;
  if (emailEl && document.activeElement !== emailEl) emailEl.value = state.personalInfo.email;
  if (phoneEl && document.activeElement !== phoneEl) phoneEl.value = state.personalInfo.phone;
}

function renderPlanCards() {
  const container = document.getElementById('planCardsGrid');
  if (!container) return;
  const isYearly = state.billing === 'yearly';

  container.innerHTML = PLANS_CATALOG.map(plan => {
    const isSelected = state.planId === plan.id;
    const priceText = isYearly ? `$${plan.yearlyPrice}/yr` : `$${plan.monthlyPrice}/mo`;

    return `
      <button
        type="button"
        role="radio"
        aria-checked="${isSelected}"
        onclick="selectPlan('${plan.id}')"
        class="plan-card ${isSelected ? 'is-selected' : ''}"
      >
        <img src="${plan.iconPath}" alt="${plan.name} icon" class="plan-card__icon" />
        <div>
          <div class="plan-card__title">${plan.name}</div>
          <div class="plan-card__price">${priceText}</div>
          ${isYearly ? `<div class="plan-card__promo">${plan.yearlyPromo}</div>` : ''}
        </div>
      </button>
    `;
  }).join('');
}

function renderBillingToggle() {
  const isYearly = state.billing === 'yearly';
  const lblMonthly = document.getElementById('lblMonthly');
  const lblYearly = document.getElementById('lblYearly');
  const toggleBtn = document.getElementById('billingToggleBtn');

  if (lblMonthly && lblYearly && toggleBtn) {
    toggleBtn.setAttribute('aria-checked', String(isYearly));
    lblMonthly.classList.toggle('is-active', !isYearly);
    lblYearly.classList.toggle('is-active', isYearly);
  }
}

function renderAddons() {
  const container = document.getElementById('addonsList');
  if (!container) return;
  const isYearly = state.billing === 'yearly';

  container.innerHTML = ADDONS_CATALOG.map(addon => {
    const isChecked = state.addons.includes(addon.id);
    const priceLabel = isYearly ? `+$${addon.yearlyPrice}/yr` : `+$${addon.monthlyPrice}/mo`;

    return `
      <div
        role="checkbox"
        aria-checked="${isChecked}"
        tabindex="0"
        onclick="toggleAddon('${addon.id}')"
        onkeydown="if(event.key===' '||event.key==='Enter'){event.preventDefault();toggleAddon('${addon.id}');}"
        class="addon-card ${isChecked ? 'is-checked' : ''}"
      >
        <div class="addon-card__left">
          <span class="addon-checkbox">
            ${isChecked ? '<img src="./assets/images/icon-checkmark.svg" alt="" />' : ''}
          </span>
          <div>
            <div class="addon-card__name">${addon.name}</div>
            <div class="addon-card__desc">${addon.desc}</div>
          </div>
        </div>
        <div class="addon-card__price">${priceLabel}</div>
      </div>
    `;
  }).join('');
}

function renderSummary() {
  const {
    plan,
    isYearly,
    unitSuffix,
    planCost,
    selectedAddons,
    subtotal,
    promo,
    discountAmount,
    finalTotal
  } = calculateTotals();

  const planTitleEl = document.getElementById('summaryPlanTitle');
  const planPriceEl = document.getElementById('summaryPlanPrice');
  const quickSwitchBtn = document.getElementById('quickSwitchBillingBtn');
  const addonsContainer = document.getElementById('summaryAddonsList');
  const totalLabelEl = document.getElementById('summaryTotalLabel');
  const totalPriceEl = document.getElementById('summaryTotalPrice');
  const origTotalEl = document.getElementById('summaryOriginalTotal');
  const discountTagEl = document.getElementById('summaryDiscountTag');

  if (planTitleEl) {
    planTitleEl.textContent = `${plan.name} (${isYearly ? 'Yearly' : 'Monthly'})`;
  }
  if (planPriceEl) {
    planPriceEl.textContent = `$${planCost}${unitSuffix}`;
  }
  if (quickSwitchBtn) {
    quickSwitchBtn.textContent = isYearly
      ? 'Switch to Monthly billing'
      : 'Switch to Yearly (2 months free)';
  }

  if (addonsContainer) {
    if (selectedAddons.length === 0) {
      addonsContainer.innerHTML = `
        <div class="summary-addon-row">
          <span class="summary-addon-row__name">No add-ons selected</span>
          <button type="button" onclick="goToStep(3)" class="link-btn link-btn--accent">+ Add extras</button>
        </div>
      `;
    } else {
      addonsContainer.innerHTML = selectedAddons.map(a => `
        <div class="summary-addon-row">
          <span class="summary-addon-row__name">${a.name}</span>
          <span class="summary-addon-row__price">+$${a.cost}${unitSuffix}</span>
        </div>
      `).join('');
    }
  }

  if (totalLabelEl) {
    totalLabelEl.textContent = `Total (per ${isYearly ? 'year' : 'month'})`;
  }

  if (promo && discountAmount > 0) {
    if (origTotalEl) {
      origTotalEl.textContent = `+$${subtotal}${unitSuffix}`;
      origTotalEl.classList.remove('hidden');
    }
    if (discountTagEl) {
      discountTagEl.textContent = promo.label;
      discountTagEl.classList.remove('hidden');
    }
    if (totalPriceEl) {
      totalPriceEl.textContent = `${isYearly ? '' : '+'}$${finalTotal}${unitSuffix}`;
    }
  } else {
    if (origTotalEl) origTotalEl.classList.add('hidden');
    if (discountTagEl) discountTagEl.classList.add('hidden');
    if (totalPriceEl) {
      totalPriceEl.textContent = `${isYearly ? '' : '+'}$${finalTotal}${unitSuffix}`;
    }
  }

  const rId = document.getElementById('receiptOrderId');
  const rSub = document.getElementById('receiptSubscriber');
  const rEmail = document.getElementById('receiptEmail');
  const rPlan = document.getElementById('receiptPlan');
  const rTotal = document.getElementById('receiptTotal');

  if (rId) rId.textContent = `#${state.orderId}`;
  if (rSub) rSub.textContent = state.personalInfo.name || 'Subscriber';
  if (rEmail) rEmail.textContent = state.personalInfo.email || '—';
  if (rPlan) {
    const addonCount = selectedAddons.length;
    rPlan.textContent = `${plan.name} (${isYearly ? 'Yearly' : 'Monthly'})${addonCount ? ` + ${addonCount} add-on${addonCount > 1 ? 's' : ''}` : ''}`;
  }
  if (rTotal) rTotal.textContent = `$${finalTotal}${unitSuffix}`;
}

function renderSidebarEstimate() {
  const { plan, isYearly, unitSuffix, finalTotal } = calculateTotals();
  const badge = document.getElementById('sidebarBillingBadge');
  const nameEl = document.getElementById('sidebarPlanName');
  const valEl = document.getElementById('sidebarTotalValue');

  if (badge) badge.textContent = isYearly ? 'Yearly' : 'Monthly';
  if (nameEl) {
    const addonCount = state.addons.length;
    nameEl.textContent = `${plan.name}${addonCount ? ` (+${addonCount})` : ''}`;
  }
  if (valEl) valEl.textContent = `$${finalTotal}${unitSuffix}`;
}

function renderVisibleStepAndFooter() {
  for (let i = 1; i <= 5; i++) {
    const panel = document.getElementById(`step-${i}`);
    if (panel) {
      panel.classList.toggle('hidden', i !== state.currentStep);
    }
  }

  const bottomNav = document.getElementById('bottomNavBar');
  const btnBack = document.getElementById('btnGoBack');
  const btnNext = document.getElementById('btnNextStep');

  if (state.currentStep === 5) {
    if (bottomNav) bottomNav.classList.add('hidden');
    return;
  } else {
    if (bottomNav) bottomNav.classList.remove('hidden');
  }

  if (btnBack) {
    btnBack.classList.toggle('invisible', state.currentStep === 1);
  }

  if (btnNext) {
    if (state.currentStep === 4) {
      btnNext.textContent = 'Confirm';
      btnNext.classList.add('is-confirm');
    } else {
      btnNext.textContent = 'Next Step';
      btnNext.classList.remove('is-confirm');
    }
  }
}

function downloadReceiptTxt() {
  const { plan, isYearly, unitSuffix, planCost, selectedAddons, promo, discountAmount, finalTotal } = calculateTotals();
  const lines = [
    '============================================',
    '       LOREM GAMING - ORDER RECEIPT         ',
    '============================================',
    `Order ID    : #${state.orderId}`,
    `Subscriber  : ${state.personalInfo.name || 'N/A'}`,
    `Email       : ${state.personalInfo.email || 'N/A'}`,
    `Phone       : ${state.personalInfo.phone || 'N/A'}`,
    '--------------------------------------------',
    `Plan        : ${plan.name} (${isYearly ? 'Yearly' : 'Monthly'}) - $${planCost}${unitSuffix}`,
    'Add-ons     :',
    ...(selectedAddons.length
      ? selectedAddons.map(a => `  - ${a.name}: +$${a.cost}${unitSuffix}`)
      : ['  (None selected)']),
    ...(promo ? [`Discount    : ${promo.code} (${promo.label}) -$${discountAmount}${unitSuffix}`] : []),
    '--------------------------------------------',
    `TOTAL BILLED: $${finalTotal}${unitSuffix}`,
    '============================================',
    'Thank you for subscribing to Lorem Gaming!'
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lorem-gaming-receipt-${state.orderId}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Receipt downloaded!');
}

function renderAll() {
  renderStepNavigation();
  renderInputs();
  renderPlanCards();
  renderBillingToggle();
  renderAddons();
  renderSummary();
  renderSidebarEstimate();
  renderVisibleStepAndFooter();
}

window.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  renderAll();
});
