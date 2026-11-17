/**
 * js/main.js
 * Core UI & Library Orchestration Controller:
 * - Theme Switching (Syncs CSS variables, tsParticles, and Chart.js)
 * - GSAP + ScrollTrigger Entrance Reveals, Counters & Timeline Progress Bar
 * - tsParticles Interactive Hero Neural/Node Background
 * - Typed.js Dynamic Specialty Headline
 * - Mouse-Tracking Radial Spotlight Effect
 * - Lucide Vector Icons & Tippy.js Provenance Tooltips
 * - Ctrl+K / Cmd+K Developer Command Palette
 */
(function () {
  'use strict';

  var THEME_STORAGE_KEY = 'aa_portfolio_theme';
  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applyTheme(theme) {
    var root = document.documentElement;
    var metaTheme = document.getElementById('meta-theme-color');
    var validTheme = theme === 'light' ? 'light' : 'dark';

    root.setAttribute('data-theme', validTheme);
    if (metaTheme) {
      metaTheme.setAttribute('content', validTheme === 'light' ? '#f8fafc' : '#0b0f17');
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, validTheme);
    } catch (err) {
      // Ignore storage errors
    }

    // Re-sync tsParticles and Chart.js colors with new theme
    initHeroParticles();
    if (window.GitHubExplorer && typeof window.GitHubExplorer.refreshChartTheme === 'function') {
      window.GitHubExplorer.refreshChartTheme();
    }
  }

  function initThemeToggle() {
    var toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  function initMobileNav() {
    var menuBtn = document.getElementById('mobile-menu-toggle');
    var nav = document.getElementById('primary-nav');
    var backdrop = document.getElementById('nav-backdrop');
    var navLinks = document.querySelectorAll('.nav-link');

    if (!menuBtn || !nav) return;

    function setMenuState(isOpen) {
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      nav.classList.toggle('is-open', isOpen);
      if (backdrop) {
        backdrop.hidden = !isOpen;
      }
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    menuBtn.addEventListener('click', function () {
      var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      setMenuState(!expanded);
    });

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        setMenuState(false);
      });
    }

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuState(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        setMenuState(false);
        menuBtn.focus();
      }
    });
  }

  function initScrollSpy() {
    var sections = document.querySelectorAll('.section-spy');
    var navLinks = document.querySelectorAll('.nav-link');

    if (!('IntersectionObserver' in window) || sections.length === 0) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var activeId = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              var matches = link.getAttribute('data-section') === activeId;
              link.classList.toggle('active', matches);
            });
          }
        });
      },
      {
        rootMargin: '-25% 0px -60% 0px',
        threshold: 0
      }
    );

    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  /**
   * Upgrade #1: GSAP + ScrollTrigger Entrance Reveals, Timeline Progress & Academic Counters
   */
  function initGSAPAnimations() {
    if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    // Reveal animations for elements with .gs-reveal
    var revealEls = document.querySelectorAll('.gs-reveal');
    revealEls.forEach(function (el) {
      window.gsap.fromTo(
        el,
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Experience Timeline vertical progress bar
    var timelineEl = document.getElementById('experience-timeline');
    var progressBar = document.getElementById('timeline-progress-bar');
    if (timelineEl && progressBar) {
      window.gsap.to(progressBar, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timelineEl,
          start: 'top 75%',
          end: 'bottom 55%',
          scrub: 0.3
        }
      });
    }

    // Animated JEE Advanced AIR 1529 counter
    var jeeEl = document.getElementById('jee-rank-counter');
    if (jeeEl) {
      var rankObj = { val: 2500 };
      window.gsap.to(rankObj, {
        val: 1529,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: jeeEl,
          start: 'top 90%'
        },
        onUpdate: function () {
          jeeEl.textContent = String(Math.round(rankObj.val));
        }
      });
    }
  }

  /**
   * Upgrade #3: Mouse-Tracking Radial Spotlight on Cards
   */
  function bindCardSpotlight() {
    var cards = document.querySelectorAll('.spotlight-card');
    cards.forEach(function (card) {
      if (card.getAttribute('data-spotlight-bound') === 'true') return;
      card.setAttribute('data-spotlight-bound', 'true');

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  /**
   * Upgrade #4A: tsParticles Interactive Neural / Node Network in Hero Section
   */
  function initHeroParticles() {
    var container = document.getElementById('hero-particles');
    if (!container || !window.tsParticles || prefersReducedMotion) return;

    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    var particleColor = isLight ? '#0284c7' : '#38bdf8';
    var linkColor = isLight ? '#64748b' : '#475569';

    window.tsParticles.load('hero-particles', {
      fullScreen: { enable: false },
      fpsLimit: 60,
      particles: {
        number: { value: 36, density: { enable: true, area: 850 } },
        color: { value: particleColor },
        links: {
          enable: true,
          distance: 145,
          color: linkColor,
          opacity: isLight ? 0.25 : 0.22,
          width: 1
        },
        move: {
          enable: true,
          speed: 0.65,
          direction: 'none',
          outModes: { default: 'bounce' }
        },
        opacity: { value: isLight ? 0.45 : 0.4 },
        size: { value: { min: 1.5, max: 3 } }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'grab' },
          resize: true
        },
        modes: {
          grab: { distance: 150, links: { opacity: 0.45 } }
        }
      },
      detectRetina: true
    });
  }

  /**
   * Upgrade #4B: Typed.js Dynamic Specialty Headline
   */
  function initTypedHeadline() {
    var typedEl = document.getElementById('typed-specialty');
    if (!typedEl || !window.Typed || prefersReducedMotion) return;

    typedEl.textContent = '';
    new window.Typed('#typed-specialty', {
      strings: [
        'Architecting Enterprise ASP.NET Core 8 &amp; SQL Server Systems',
        'Building LLM &amp; Retrieval-Augmented Generation (RAG) Pipelines',
        'Engineering High-Concurrency Python &amp; FastAPI Microservices',
        'Training XGBoost &amp; LightGBM Models on Imbalanced Datasets',
        'Implementing Role-Based Access Control (RBAC) &amp; Dynamic Workflows'
      ],
      typeSpeed: 38,
      backSpeed: 20,
      backDelay: 2200,
      loop: true,
      smartBackspace: true
    });
  }

  /**
   * Upgrade #6A: Refresh Lucide Vector Icons & Tippy.js Tooltips
   */
  function refreshEnhancements() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    if (window.tippy) {
      var tooltipTargets = document.querySelectorAll('[data-tippy-content]');
      tooltipTargets.forEach(function (el) {
        if (!el._tippy) {
          window.tippy(el, {
            theme: 'portfolio',
            animation: 'shift-away',
            duration: [180, 140]
          });
        }
      });
    }

    bindCardSpotlight();
  }

  /**
   * Upgrade #6B: Developer Command Palette (Ctrl+K / Cmd+K)
   */
  function initCommandPalette() {
    var triggerBtn = document.getElementById('cmd-trigger-btn');
    var overlay = document.getElementById('cmd-modal-overlay');
    var closeBtn = document.getElementById('cmd-close-btn');
    var input = document.getElementById('cmd-input');
    var listEl = document.getElementById('cmd-list');

    if (!overlay || !input || !listEl) return;

    var commands = [
      {
        title: 'Go to Hero / Overview',
        category: 'Navigation',
        action: function () { location.hash = '#home'; }
      },
      {
        title: 'Go to About Adarsh',
        category: 'Navigation',
        action: function () { location.hash = '#about'; }
      },
      {
        title: 'Go to Technical Skills & Provenance',
        category: 'Navigation',
        action: function () { location.hash = '#skills'; }
      },
      {
        title: 'Go to Professional Experience (Proclink Consulting)',
        category: 'Navigation',
        action: function () { location.hash = '#experience'; }
      },
      {
        title: 'Go to Featured Engineering Projects',
        category: 'Navigation',
        action: function () { location.hash = '#projects'; }
      },
      {
        title: 'Go to Live GitHub Repository Explorer & Charts',
        category: 'Navigation',
        action: function () { location.hash = '#github'; }
      },
      {
        title: 'Go to Education (IIT Guwahati) & Achievements (AIR 1529)',
        category: 'Navigation',
        action: function () { location.hash = '#education'; }
      },
      {
        title: 'Filter Projects: Generative AI & LLMs',
        category: 'Projects Filter',
        action: function () {
          location.hash = '#projects';
          if (window.PortfolioProjects) window.PortfolioProjects.filterByCategory('genai');
        }
      },
      {
        title: 'Filter Projects: Enterprise .NET Architecture',
        category: 'Projects Filter',
        action: function () {
          location.hash = '#projects';
          if (window.PortfolioProjects) window.PortfolioProjects.filterByCategory('dotnet');
        }
      },
      {
        title: 'Filter Projects: Python & FastAPI',
        category: 'Projects Filter',
        action: function () {
          location.hash = '#projects';
          if (window.PortfolioProjects) window.PortfolioProjects.filterByCategory('python');
        }
      },
      {
        title: 'Toggle Dark / Light Color Theme',
        category: 'Preferences',
        action: function () {
          var current = document.documentElement.getAttribute('data-theme') || 'dark';
          applyTheme(current === 'dark' ? 'light' : 'dark');
        }
      },
      {
        title: 'Download Verified Resume (PDF)',
        category: 'Document',
        action: function () {
          var a = document.createElement('a');
          a.href = './assets/resume.pdf';
          a.download = 'Adarsh_Anumula_Resume.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      },
      {
        title: 'Open GitHub Profile (@adarshanumula7)',
        category: 'External Link',
        action: function () {
          window.open('https://github.com/adarshanumula7', '_blank', 'noopener');
        }
      },
      {
        title: 'Open LinkedIn Profile',
        category: 'External Link',
        action: function () {
          window.open('https://www.linkedin.com/in/adarsh-anumula-4b0293228/', '_blank', 'noopener');
        }
      }
    ];

    var activeIndex = 0;
    var filteredCommands = commands.slice();

    function renderCommandItems() {
      while (listEl.firstChild) {
        listEl.removeChild(listEl.firstChild);
      }

      filteredCommands.forEach(function (cmd, idx) {
        var li = document.createElement('li');
        li.className = 'cmd-item' + (idx === activeIndex ? ' is-active' : '');
        li.setAttribute('role', 'option');

        var leftSpan = document.createElement('span');
        leftSpan.className = 'cmd-item-left';
        leftSpan.textContent = cmd.title;

        var catSpan = document.createElement('span');
        catSpan.className = 'cmd-item-category';
        catSpan.textContent = cmd.category;

        li.appendChild(leftSpan);
        li.appendChild(catSpan);

        li.addEventListener('click', function () {
          closePalette();
          cmd.action();
        });

        listEl.appendChild(li);
      });
    }

    function openPalette() {
      overlay.hidden = false;
      input.value = '';
      activeIndex = 0;
      filteredCommands = commands.slice();
      renderCommandItems();
      setTimeout(function () { input.focus(); }, 20);
    }

    function closePalette() {
      overlay.hidden = true;
    }

    if (triggerBtn) {
      triggerBtn.addEventListener('click', openPalette);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closePalette);
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePalette();
    });

    input.addEventListener('input', function () {
      var q = (input.value || '').trim().toLowerCase();
      filteredCommands = commands.filter(function (c) {
        return (
          c.title.toLowerCase().indexOf(q) !== -1 ||
          c.category.toLowerCase().indexOf(q) !== -1
        );
      });
      activeIndex = 0;
      renderCommandItems();
    });

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (overlay.hidden) {
          openPalette();
        } else {
          closePalette();
        }
        return;
      }

      if (!overlay.hidden) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closePalette();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (filteredCommands.length > 0) {
            activeIndex = (activeIndex + 1) % filteredCommands.length;
            renderCommandItems();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (filteredCommands.length > 0) {
            activeIndex = (activeIndex - 1 + filteredCommands.length) % filteredCommands.length;
            renderCommandItems();
          }
        } else if (e.key === 'Enter' && filteredCommands[activeIndex]) {
          e.preventDefault();
          var targetCmd = filteredCommands[activeIndex];
          closePalette();
          targetCmd.action();
        }
      }
    });
  }

  function initDynamicCopyrightYear() {
    var yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  window.PortfolioUI = {
    refreshEnhancements: refreshEnhancements
  };

  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initMobileNav();
    initScrollSpy();
    initDynamicCopyrightYear();
    initCommandPalette();

    if (window.PortfolioProjects && typeof window.PortfolioProjects.init === 'function') {
      window.PortfolioProjects.init();
    }

    if (window.GitHubExplorer && typeof window.GitHubExplorer.init === 'function') {
      window.GitHubExplorer.init();
    }

    initHeroParticles();
    initTypedHeadline();
    initGSAPAnimations();
    refreshEnhancements();
  });
})();