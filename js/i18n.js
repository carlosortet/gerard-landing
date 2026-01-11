/**
 * GERARD i18n - Internationalization System
 * Loads content from JSON files and renders dynamically
 */

const I18n = {
  currentLang: 'es',
  content: null,
  supportedLangs: ['es', 'en'],

  /**
   * Initialize i18n system
   */
  async init() {
    // Detect language from URL or localStorage
    this.currentLang = this.detectLanguage();

    // Load content
    await this.loadContent(this.currentLang);

    // Render page
    this.render();

    // Setup language switcher
    this.setupLangSwitcher();
  },

  /**
   * Detect language from URL path, query param, or localStorage
   */
  detectLanguage() {
    // Check URL path first (/en/, /es/)
    const pathMatch = window.location.pathname.match(/^\/(en|es)\//);
    if (pathMatch) return pathMatch[1];

    // Check query param (?lang=en)
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && this.supportedLangs.includes(langParam)) return langParam;

    // Check localStorage
    const storedLang = localStorage.getItem('gerard-lang');
    if (storedLang && this.supportedLangs.includes(storedLang)) return storedLang;

    // Check browser language
    const browserLang = navigator.language.slice(0, 2);
    if (this.supportedLangs.includes(browserLang)) return browserLang;

    // Default to Spanish
    return 'es';
  },

  /**
   * Load content JSON for specified language
   */
  async loadContent(lang) {
    try {
      const response = await fetch(`/content/content-${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang} content`);
      this.content = await response.json();
      localStorage.setItem('gerard-lang', lang);
    } catch (error) {
      console.error('Error loading content:', error);
      // Fallback to Spanish if load fails
      if (lang !== 'es') {
        await this.loadContent('es');
      }
    }
  },

  /**
   * Switch language and reload content
   */
  async switchLanguage(lang) {
    if (lang === this.currentLang) return;
    this.currentLang = lang;
    await this.loadContent(lang);
    this.render();
    this.updateLangSwitcher();
  },

  /**
   * Render all content to page
   */
  render() {
    if (!this.content) return;

    // Update meta tags
    this.renderMeta();

    // Update navigation
    this.renderNav();

    // Update hero
    this.renderHero();

    // Update sections
    this.renderBenefits();
    this.renderDifferential();
    this.renderHowItWorks();
    this.renderEngine();
    this.renderFeatures();
    this.renderTestimonials();
    this.renderBeforeAfter();
    this.renderUseCases();
    this.renderFAQ();
    this.renderFinalCTA();
    this.renderFooter();
  },

  /**
   * Render meta tags
   */
  renderMeta() {
    const { meta } = this.content;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', meta.keywords);
    document.documentElement.lang = this.content.lang;
  },

  /**
   * Render navigation
   */
  renderNav() {
    const { nav } = this.content;
    this.setText('[data-i18n="nav.benefits"]', nav.benefits);
    this.setText('[data-i18n="nav.howItWorks"]', nav.howItWorks);
    this.setText('[data-i18n="nav.features"]', nav.features);
    this.setText('[data-i18n="nav.faq"]', nav.faq);
    this.setText('[data-i18n="nav.contact"]', nav.contact);
    this.setText('[data-i18n="nav.cta"]', nav.cta);
  },

  /**
   * Render hero section
   */
  renderHero() {
    const { hero } = this.content;
    this.setText('[data-i18n="hero.tag"]', hero.tag);
    this.setText('[data-i18n="hero.title"]', hero.title);
    this.setText('[data-i18n="hero.subtitle"]', hero.subtitle);
    this.setText('[data-i18n="hero.trustedBy"]', hero.trustedBy);

    // Update hero buttons
    const heroButtons = document.querySelectorAll('[data-i18n^="hero.buttons"]');
    hero.buttons.forEach((btn, i) => {
      const el = document.querySelector(`[data-i18n="hero.buttons.${i}"]`);
      if (el) el.textContent = btn.text;
    });
  },

  /**
   * Render benefits section
   */
  renderBenefits() {
    const { benefits } = this.content.sections;
    this.setText('[data-i18n="benefits.tag"]', benefits.tag);
    this.setText('[data-i18n="benefits.title"]', benefits.title);
    this.setText('[data-i18n="benefits.subtitle"]', benefits.subtitle);
    this.setText('[data-i18n="benefits.metricsTitle"]', benefits.metricsTitle);

    // Update feature cards
    benefits.features.forEach((feature, i) => {
      this.setText(`[data-i18n="benefits.features.${i}.title"]`, feature.title);
      this.setText(`[data-i18n="benefits.features.${i}.description"]`, feature.description);
    });

    // Update metrics
    benefits.metrics.forEach((metric, i) => {
      this.setText(`[data-i18n="benefits.metrics.${i}.label"]`, metric.label);
      this.setText(`[data-i18n="benefits.metrics.${i}.value"]`, metric.value);
      this.setText(`[data-i18n="benefits.metrics.${i}.comparison"]`, metric.comparison);
    });
  },

  /**
   * Render differential section
   */
  renderDifferential() {
    const { differential } = this.content.sections;
    this.setText('[data-i18n="differential.tag"]', differential.tag);
    this.setText('[data-i18n="differential.title"]', differential.title);

    differential.items.forEach((item, i) => {
      this.setText(`[data-i18n="differential.items.${i}.title"]`, item.title);
      this.setText(`[data-i18n="differential.items.${i}.description"]`, item.description);
    });
  },

  /**
   * Render how it works section
   */
  renderHowItWorks() {
    const { howItWorks } = this.content.sections;
    this.setText('[data-i18n="howItWorks.tag"]', howItWorks.tag);
    this.setText('[data-i18n="howItWorks.title"]', howItWorks.title);

    howItWorks.steps.forEach((step, i) => {
      this.setText(`[data-i18n="howItWorks.steps.${i}.title"]`, step.title);
      this.setText(`[data-i18n="howItWorks.steps.${i}.description"]`, step.description);
    });

    this.setText('[data-i18n="howItWorks.integration.title"]', howItWorks.integration.title);
    this.setText('[data-i18n="howItWorks.integration.description"]', howItWorks.integration.description);
  },

  /**
   * Render engine section
   */
  renderEngine() {
    const { engine } = this.content.sections;
    if (!engine) return;

    this.setText('[data-i18n="engine.tag"]', engine.tag);
    this.setText('[data-i18n="engine.title"]', engine.title);
    this.setText('[data-i18n="engine.subtitle"]', engine.subtitle);
    this.setHTML('[data-i18n="engine.statement"]', engine.statement);

    engine.stages.forEach((stage, i) => {
      this.setText(`[data-i18n="engine.stages.${i}.title"]`, stage.title);
      this.setText(`[data-i18n="engine.stages.${i}.description"]`, stage.description);
      this.setText(`[data-i18n="engine.stages.${i}.metric"]`, stage.metric);
      this.setText(`[data-i18n="engine.stages.${i}.metricLabel"]`, stage.metricLabel);
    });
  },

  /**
   * Render features section
   */
  renderFeatures() {
    const { featureSet } = this.content.sections;
    this.setText('[data-i18n="featureSet.tag"]', featureSet.tag);
    this.setText('[data-i18n="featureSet.title"]', featureSet.title);

    featureSet.features.forEach((feature, i) => {
      this.setText(`[data-i18n="featureSet.features.${i}.title"]`, feature.title);
      this.setText(`[data-i18n="featureSet.features.${i}.description"]`, feature.description);
    });
  },

  /**
   * Render testimonials section
   */
  renderTestimonials() {
    const { testimonials } = this.content.sections;
    this.setText('[data-i18n="testimonials.tag"]', testimonials.tag);
    this.setText('[data-i18n="testimonials.title"]', testimonials.title);

    testimonials.items.forEach((item, i) => {
      this.setText(`[data-i18n="testimonials.items.${i}.quote"]`, `"${item.quote}"`);
      this.setText(`[data-i18n="testimonials.items.${i}.author"]`, item.author);
      this.setText(`[data-i18n="testimonials.items.${i}.company"]`, item.company);
    });
  },

  /**
   * Render before/after section
   */
  renderBeforeAfter() {
    const { beforeAfter } = this.content.sections;
    this.setText('[data-i18n="beforeAfter.tag"]', beforeAfter.tag);
    this.setText('[data-i18n="beforeAfter.title"]', beforeAfter.title);
    this.setText('[data-i18n="beforeAfter.before.title"]', beforeAfter.before.title);
    this.setText('[data-i18n="beforeAfter.after.title"]', beforeAfter.after.title);

    // Update before items
    const beforeList = document.querySelector('[data-i18n="beforeAfter.before.items"]');
    if (beforeList) {
      beforeList.innerHTML = beforeAfter.before.items.map(item => `<li>${item}</li>`).join('');
    }

    // Update after items
    const afterList = document.querySelector('[data-i18n="beforeAfter.after.items"]');
    if (afterList) {
      afterList.innerHTML = beforeAfter.after.items.map(item => `<li>${item}</li>`).join('');
    }

    // Update footer lines
    beforeAfter.footer.forEach((line, i) => {
      this.setText(`[data-i18n="beforeAfter.footer.${i}"]`, line);
    });
  },

  /**
   * Render use cases section
   */
  renderUseCases() {
    const { useCases } = this.content.sections;
    this.setText('[data-i18n="useCases.tag"]', useCases.tag);
    this.setText('[data-i18n="useCases.title"]', useCases.title);

    useCases.cases.forEach((useCase, i) => {
      this.setText(`[data-i18n="useCases.cases.${i}.title"]`, useCase.title);
      this.setText(`[data-i18n="useCases.cases.${i}.description"]`, useCase.description);
    });
  },

  /**
   * Render FAQ section
   */
  renderFAQ() {
    const { faq } = this.content.sections;
    this.setText('[data-i18n="faq.tag"]', faq.tag);
    this.setText('[data-i18n="faq.title"]', faq.title);

    faq.items.forEach((item, i) => {
      this.setText(`[data-i18n="faq.items.${i}.question"]`, item.question);
      this.setText(`[data-i18n="faq.items.${i}.answer"]`, item.answer);
    });
  },

  /**
   * Render final CTA section
   */
  renderFinalCTA() {
    const { finalCTA } = this.content.sections;
    this.setText('[data-i18n="finalCTA.title"]', finalCTA.title);
    this.setText('[data-i18n="finalCTA.subtitle"]', finalCTA.subtitle);
    this.setText('[data-i18n="finalCTA.note"]', finalCTA.note);

    finalCTA.buttons.forEach((btn, i) => {
      this.setText(`[data-i18n="finalCTA.buttons.${i}"]`, btn.text);
    });
  },

  /**
   * Render footer
   */
  renderFooter() {
    const { footer } = this.content;
    this.setText('[data-i18n="footer.tagline"]', footer.tagline);
    this.setText('[data-i18n="footer.company.description"]', footer.company.description);
    this.setText('[data-i18n="footer.contact.location"]', footer.contact.location);
    this.setText('[data-i18n="footer.copyright"]', footer.copyright);
  },

  /**
   * Setup language switcher
   */
  setupLangSwitcher() {
    const switcher = document.getElementById('lang-switcher');
    if (!switcher) return;

    switcher.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-lang]');
      if (btn) {
        const lang = btn.dataset.lang;
        this.switchLanguage(lang);
      }
    });

    this.updateLangSwitcher();
  },

  /**
   * Update language switcher UI
   */
  updateLangSwitcher() {
    const buttons = document.querySelectorAll('#lang-switcher [data-lang]');
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
    });
  },

  /**
   * Helper: Set text content
   */
  setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  },

  /**
   * Helper: Set HTML content
   */
  setHTML(selector, html) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => I18n.init());
