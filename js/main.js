/**
 * js/main.js
 * Core UI Controller: Theme Switching, Mobile Navigation Drawer,
 * Scroll-Spy Active Link Highlighting, and Bootstrap Orchestration.
 */
(function () {
  'use strict';

  var THEME_STORAGE_KEY = 'aa_portfolio_theme';

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
      // Ignore storage errors in restricted browsing modes
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

  function initDynamicCopyrightYear() {
    var yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initMobileNav();
    initScrollSpy();
    initDynamicCopyrightYear();

    if (window.PortfolioProjects && typeof window.PortfolioProjects.init === 'function') {
      window.PortfolioProjects.init();
    }

    if (window.GitHubExplorer && typeof window.GitHubExplorer.init === 'function') {
      window.GitHubExplorer.init();
    }
  });
})();