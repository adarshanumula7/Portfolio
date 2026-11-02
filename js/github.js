/**
 * js/github.js
 * Dynamic GitHub REST API Integration for @adarshanumula7
 * Features: Multi-page pagination (>100 repos), localStorage caching with TTL,
 * XSS-safe DOM creation, dynamic dashboard stats, search, language filter, and sorting.
 */
(function () {
  'use strict';

  var GITHUB_USERNAME = 'adarshanumula7';
  var CACHE_KEY = 'aa_gh_repos_cache_v1_' + GITHUB_USERNAME;
  var CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
  var UI_PAGE_SIZE = 12;

  var state = {
    allRepos: [],
    filteredRepos: [],
    searchQuery: '',
    selectedLanguage: 'all',
    sortBy: 'updated',
    currentPage: 1
  };

  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === 'string') el.textContent = text;
    return el;
  }

  function isValidHttpUrl(value) {
    if (!value || typeof value !== 'string') return false;
    try {
      var parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  function formatUpdatedDate(isoString) {
    if (!isoString) return 'Unknown date';
    try {
      var date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Recently';
    }
  }

  function readCache(allowExpired) {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.repos) || !parsed.timestamp) return null;

      var age = Date.now() - parsed.timestamp;
      if (!allowExpired && age > CACHE_TTL_MS) {
        return null;
      }
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function writeCache(repos) {
    try {
      var payload = {
        timestamp: Date.now(),
        repos: repos
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch (err) {
      // Ignore storage quota errors gracefully
    }
  }

  /**
   * Fetches all public repositories owned by GITHUB_USERNAME across all pages (per_page=100).
   */
  async function fetchAllOwnedRepos() {
    var allRepos = [];
    var page = 1;
    var maxPages = 10; // Safety ceiling (up to 1,000 repositories)

    while (page <= maxPages) {
      var endpoint =
        'https://api.github.com/users/' +
        encodeURIComponent(GITHUB_USERNAME) +
        '/repos?type=owner&sort=updated&per_page=100&page=' +
        page;

      var response = await fetch(endpoint, {
        headers: {
          Accept: 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        var statusMsg = 'GitHub API responded with HTTP ' + response.status;
        if (response.status === 403) {
          statusMsg = 'GitHub API rate limit exceeded (HTTP 403).';
        }
        throw new Error(statusMsg);
      }

      var pageData = await response.json();
      if (!Array.isArray(pageData) || pageData.length === 0) {
        break;
      }

      // Strictly retain only public repositories owned by the target account
      var ownedPublic = pageData.filter(function (repo) {
        var isOwner =
          repo &&
          repo.owner &&
          typeof repo.owner.login === 'string' &&
          repo.owner.login.toLowerCase() === GITHUB_USERNAME.toLowerCase();
        var isPublic = repo && repo.private === false;
        return isOwner && isPublic;
      });

      allRepos = allRepos.concat(ownedPublic);

      if (pageData.length < 100) {
        break;
      }
      page += 1;
    }

    return allRepos;
  }

  function updateDashboardStats(repos, cacheStatusText) {
    var reposEl = document.getElementById('gh-stat-repos');
    var starsEl = document.getElementById('gh-stat-stars');
    var forksEl = document.getElementById('gh-stat-forks');
    var statusEl = document.getElementById('gh-cache-status');
    var heroRepoCountEl = document.getElementById('hero-repo-count');

    var totalRepos = repos.length;
    var totalStars = 0;
    var totalForks = 0;

    repos.forEach(function (r) {
      totalStars += Number(r.stargazers_count) || 0;
      totalForks += Number(r.forks_count) || 0;
    });

    if (reposEl) reposEl.textContent = String(totalRepos);
    if (starsEl) starsEl.textContent = String(totalStars);
    if (forksEl) forksEl.textContent = String(totalForks);
    if (statusEl && cacheStatusText) statusEl.textContent = cacheStatusText;
    if (heroRepoCountEl) heroRepoCountEl.textContent = totalRepos + ' Public';
  }

  function populateLanguageFilter(repos) {
    var select = document.getElementById('gh-language-select');
    if (!select) return;

    var langCounts = {};
    var hasUnlabeled = false;

    repos.forEach(function (repo) {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      } else {
        hasUnlabeled = true;
      }
    });

    var languages = Object.keys(langCounts).sort(function (a, b) {
      return langCounts[b] - langCounts[a];
    });

    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }

    var allOpt = createEl('option', null, 'All Languages (' + repos.length + ')');
    allOpt.value = 'all';
    select.appendChild(allOpt);

    languages.forEach(function (lang) {
      var opt = createEl('option', null, lang + ' (' + langCounts[lang] + ')');
      opt.value = lang;
      select.appendChild(opt);
    });

    if (hasUnlabeled) {
      var noneOpt = createEl('option', null, 'Multi / Docs (No Primary Language)');
      noneOpt.value = '__none__';
      select.appendChild(noneOpt);
    }

    select.value = state.selectedLanguage;
  }

  function applyFiltersAndSort() {
    var query = state.searchQuery.trim().toLowerCase();
    var lang = state.selectedLanguage;
    var sort = state.sortBy;

    var results = state.allRepos.filter(function (repo) {
      // Language filter
      if (lang !== 'all') {
        if (lang === '__none__') {
          if (repo.language) return false;
        } else if (repo.language !== lang) {
          return false;
        }
      }

      // Search query filter (checks name, description, topics, and language)
      if (query) {
        var nameStr = (repo.name || '').toLowerCase();
        var descStr = (repo.description || '').toLowerCase();
        var langStr = (repo.language || '').toLowerCase();
        var topicsStr = Array.isArray(repo.topics) ? repo.topics.join(' ').toLowerCase() : '';

        var matches =
          nameStr.indexOf(query) !== -1 ||
          descStr.indexOf(query) !== -1 ||
          langStr.indexOf(query) !== -1 ||
          topicsStr.indexOf(query) !== -1;

        if (!matches) return false;
      }

      return true;
    });

    // Sorting
    results.sort(function (a, b) {
      if (sort === 'stars') {
        var starDiff = (Number(b.stargazers_count) || 0) - (Number(a.stargazers_count) || 0);
        if (starDiff !== 0) return starDiff;
      } else if (sort === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      // Default: recently updated
      var dateA = new Date(a.updated_at || 0).getTime();
      var dateB = new Date(b.updated_at || 0).getTime();
      return dateB - dateA;
    });

    state.filteredRepos = results;
    renderRepositoryList();
  }

  function renderRepositoryCard(repo) {
    var card = createEl('article', 'gh-repo-card');

    // Header: Name + Fork/Archived Badges
    var header = createEl('div', 'gh-repo-header');
    var titleH3 = createEl('h3', 'gh-repo-title');
    var titleLink = createEl('a', null, repo.name || 'Unnamed Repository');
    titleLink.setAttribute('href', repo.html_url || 'https://github.com/' + GITHUB_USERNAME);
    titleLink.setAttribute('target', '_blank');
    titleLink.setAttribute('rel', 'noopener noreferrer');
    titleH3.appendChild(titleLink);
    header.appendChild(titleH3);

    var badgesWrap = createEl('div', 'gh-badges-wrap');
    if (repo.fork) {
      badgesWrap.appendChild(createEl('span', 'gh-badge gh-badge-fork', 'Fork'));
    } else {
      badgesWrap.appendChild(createEl('span', 'gh-badge', 'Source'));
    }
    if (repo.archived) {
      badgesWrap.appendChild(createEl('span', 'gh-badge gh-badge-archived', 'Archived'));
    }
    header.appendChild(badgesWrap);
    card.appendChild(header);

    // Description (Never silently exclude repositories without descriptions)
    if (repo.description && repo.description.trim().length > 0) {
      card.appendChild(createEl('p', 'gh-repo-desc', repo.description.trim()));
    } else {
      card.appendChild(
        createEl(
          'p',
          'gh-repo-desc gh-repo-desc-empty',
          'Public repository owned by @' + GITHUB_USERNAME + '. Inspect source files and commits directly on GitHub.'
        )
      );
    }

    // Topics (if available)
    if (Array.isArray(repo.topics) && repo.topics.length > 0) {
      var topicsRow = createEl('div', 'gh-topics-row');
      repo.topics.slice(0, 5).forEach(function (topic) {
        topicsRow.appendChild(createEl('span', 'gh-topic-tag', topic));
      });
      card.appendChild(topicsRow);
    }

    // Footer Metadata (Language, Stars, Forks, Updated Date)
    var footer = createEl('div', 'gh-repo-footer');
    var metaLeft = createEl('div', 'gh-meta-left');

    var langBadge = createEl('span', 'gh-lang-badge');
    langBadge.appendChild(createEl('span', 'gh-lang-dot'));
    langBadge.appendChild(createEl('span', null, repo.language || 'Multi / Docs'));
    metaLeft.appendChild(langBadge);

    var starsSpan = createEl('span', 'gh-stat-inline', '★ ' + (Number(repo.stargazers_count) || 0));
    starsSpan.setAttribute('title', 'Stars');
    metaLeft.appendChild(starsSpan);

    var forksSpan = createEl('span', 'gh-stat-inline', '⑂ ' + (Number(repo.forks_count) || 0));
    forksSpan.setAttribute('title', 'Forks');
    metaLeft.appendChild(forksSpan);

    footer.appendChild(metaLeft);

    var updatedSpan = createEl('span', null, 'Updated ' + formatUpdatedDate(repo.updated_at));
    footer.appendChild(updatedSpan);
    card.appendChild(footer);

    // Action Buttons (GitHub Repo + Optional Verified Homepage Link)
    var actionsRow = createEl('div', 'gh-repo-actions');
    var repoBtn = createEl('a', 'btn btn-sm btn-outline', 'GitHub Repo');
    repoBtn.setAttribute('href', repo.html_url || 'https://github.com/' + GITHUB_USERNAME);
    repoBtn.setAttribute('target', '_blank');
    repoBtn.setAttribute('rel', 'noopener noreferrer');
    actionsRow.appendChild(repoBtn);

    if (isValidHttpUrl(repo.homepage)) {
      var liveBtn = createEl('a', 'btn btn-sm btn-primary', 'Live Demo');
      liveBtn.setAttribute('href', repo.homepage);
      liveBtn.setAttribute('target', '_blank');
      liveBtn.setAttribute('rel', 'noopener noreferrer');
      actionsRow.appendChild(liveBtn);
    }

    card.appendChild(actionsRow);
    return card;
  }

  function renderPagination(totalPages) {
    var pagEl = document.getElementById('gh-pagination');
    if (!pagEl) return;

    while (pagEl.firstChild) {
      pagEl.removeChild(pagEl.firstChild);
    }

    if (totalPages <= 1) {
      pagEl.hidden = true;
      return;
    }

    pagEl.hidden = false;

    var prevBtn = createEl('button', 'btn btn-sm btn-outline', 'Previous');
    prevBtn.type = 'button';
    prevBtn.disabled = state.currentPage <= 1;
    prevBtn.addEventListener('click', function () {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
        renderRepositoryList();
      }
    });
    pagEl.appendChild(prevBtn);

    var pageIndicator = createEl(
      'span',
      'gh-results-text',
      'Page ' + state.currentPage + ' of ' + totalPages
    );
    pagEl.appendChild(pageIndicator);

    var nextBtn = createEl('button', 'btn btn-sm btn-outline', 'Next');
    nextBtn.type = 'button';
    nextBtn.disabled = state.currentPage >= totalPages;
    nextBtn.addEventListener('click', function () {
      if (state.currentPage < totalPages) {
        state.currentPage += 1;
        renderRepositoryList();
      }
    });
    pagEl.appendChild(nextBtn);
  }

  function renderRepositoryList() {
    var grid = document.getElementById('gh-repo-grid');
    var emptyState = document.getElementById('gh-empty-state');
    var countEl = document.getElementById('gh-results-count');
    var pagEl = document.getElementById('gh-pagination');

    if (!grid) return;

    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    var totalFiltered = state.filteredRepos.length;
    var totalAll = state.allRepos.length;

    if (countEl) {
      countEl.textContent =
        'Showing ' + totalFiltered + ' of ' + totalAll + ' public repositories';
    }

    if (totalFiltered === 0) {
      grid.hidden = true;
      if (pagEl) pagEl.hidden = true;
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;
    grid.hidden = false;

    var totalPages = Math.ceil(totalFiltered / UI_PAGE_SIZE);
    if (state.currentPage > totalPages) {
      state.currentPage = 1;
    }

    var startIdx = (state.currentPage - 1) * UI_PAGE_SIZE;
    var pageSlice = state.filteredRepos.slice(startIdx, startIdx + UI_PAGE_SIZE);

    pageSlice.forEach(function (repo) {
      grid.appendChild(renderRepositoryCard(repo));
    });

    renderPagination(totalPages);
  }

  function setLoadingView(isLoading) {
    var loadingEl = document.getElementById('gh-loading-state');
    var errorEl = document.getElementById('gh-error-state');
    var gridEl = document.getElementById('gh-repo-grid');

    if (loadingEl) loadingEl.hidden = !isLoading;
    if (isLoading) {
      if (errorEl) errorEl.hidden = true;
      if (gridEl) gridEl.hidden = true;
    }
  }

  async function loadRepositories(forceRefresh) {
    var errorEl = document.getElementById('gh-error-state');
    var errorMsgEl = document.getElementById('gh-error-message');

    setLoadingView(true);

    if (!forceRefresh) {
      var freshCache = readCache(false);
      if (freshCache && freshCache.repos.length > 0) {
        state.allRepos = freshCache.repos;
        setLoadingView(false);
        updateDashboardStats(
          state.allRepos,
          'Cached data (' + new Date(freshCache.timestamp).toLocaleTimeString() + ')'
        );
        populateLanguageFilter(state.allRepos);
        applyFiltersAndSort();
        if (window.PortfolioProjects) {
          window.PortfolioProjects.reconcileWithGitHub(state.allRepos);
        }
        return;
      }
    }

    try {
      var liveRepos = await fetchAllOwnedRepos();
      state.allRepos = liveRepos;
      writeCache(liveRepos);

      setLoadingView(false);
      updateDashboardStats(liveRepos, 'Live from GitHub REST API');
      populateLanguageFilter(liveRepos);
      applyFiltersAndSort();

      if (window.PortfolioProjects) {
        window.PortfolioProjects.reconcileWithGitHub(liveRepos);
      }
    } catch (err) {
      setLoadingView(false);

      // Attempt stale cache fallback so the UI remains functional during rate-limits
      var staleCache = readCache(true);
      if (staleCache && staleCache.repos.length > 0) {
        state.allRepos = staleCache.repos;
        updateDashboardStats(state.allRepos, 'Offline / Rate-limited (Showing cached snapshot)');
        populateLanguageFilter(state.allRepos);
        applyFiltersAndSort();
        if (window.PortfolioProjects) {
          window.PortfolioProjects.reconcileWithGitHub(state.allRepos);
        }
        return;
      }

      if (errorMsgEl) {
        errorMsgEl.textContent =
          (err && err.message ? err.message : 'Network request failed.') +
          ' Explore all repositories directly via the GitHub profile link below.';
      }
      if (errorEl) errorEl.hidden = false;
      updateDashboardStats([], 'API Unavailable — Use Direct Profile Link');
    }
  }

  function resetAllControls() {
    state.searchQuery = '';
    state.selectedLanguage = 'all';
    state.sortBy = 'updated';
    state.currentPage = 1;

    var searchInput = document.getElementById('gh-search-input');
    var langSelect = document.getElementById('gh-language-select');
    var sortSelect = document.getElementById('gh-sort-select');

    if (searchInput) searchInput.value = '';
    if (langSelect) langSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'updated';

    applyFiltersAndSort();
  }

  function bindControlEvents() {
    var searchInput = document.getElementById('gh-search-input');
    var langSelect = document.getElementById('gh-language-select');
    var sortSelect = document.getElementById('gh-sort-select');
    var clearBtn = document.getElementById('gh-clear-btn');
    var emptyResetBtn = document.getElementById('gh-empty-reset-btn');
    var refreshBtn = document.getElementById('gh-refresh-btn');
    var retryBtn = document.getElementById('gh-retry-btn');

    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        state.searchQuery = e.target.value || '';
        state.currentPage = 1;
        applyFiltersAndSort();
      });
    }

    if (langSelect) {
      langSelect.addEventListener('change', function (e) {
        state.selectedLanguage = e.target.value || 'all';
        state.currentPage = 1;
        applyFiltersAndSort();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function (e) {
        state.sortBy = e.target.value || 'updated';
        state.currentPage = 1;
        applyFiltersAndSort();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', resetAllControls);
    }

    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', resetAllControls);
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        loadRepositories(true);
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        loadRepositories(true);
      });
    }
  }

  function init() {
    bindControlEvents();
    loadRepositories(false);
  }

  window.GitHubExplorer = {
    init: init
  };
})();