/**
 * js/projects.js
 * Curated Featured Projects & Engineering Systems Module
 * Synchronizes verified project descriptions with live GitHub REST API data.
 */
(function () {
  'use strict';

  var FEATURED_PROJECTS = [
    {
      id: 'ai-swe-assistant',
      title: 'AI Software Engineer Assistant Chatbot',
      domainBadge: 'Generative AI & RAG',
      categories: ['genai', 'aiml', 'python', 'web'],
      keywords: ['assistant', 'chatbot', 'rag', 'llm', 'agent', 'swe', 'chat'],
      shortDescription:
        'Context-aware developer assistant leveraging Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG) to answer technical documentation and codebase queries.',
      problemAddressed:
        'Standard conversational LLMs lack grounding in repository-specific architecture or technical documentation and can produce unverified syntax when debugging multi-file engineering workflows.',
      keyFunctionality: [
        'Document ingestion, semantic chunking, and vector embedding retrieval pipeline for grounded context injection.',
        'Structured prompt engineering templates optimized for code explanation, refactoring suggestions, and debugging.',
        'Backend API orchestration in Python to manage conversation context windows and citation grounding.'
      ],
      techStack: ['Python', 'Large Language Models (LLMs)', 'RAG', 'Prompt Engineering', 'FastAPI', 'Vector Retrieval'],
      repoUrl: 'https://github.com/adarshanumula7',
      liveUrl: null,
      matchedRepoName: null,
      stars: 0
    },
    {
      id: 'ai-code-review-platform',
      title: 'AI-Powered Code Review & Static Analysis Platform',
      domainBadge: 'LLM Developer Tooling',
      categories: ['genai', 'aiml', 'python', 'web'],
      keywords: ['review', 'code-review', 'analysis', 'analyzer', 'audit', 'code'],
      shortDescription:
        'Automated source-code inspection service combining static analysis heuristics with LLM reasoning to identify bugs, security anti-patterns, and maintainability bottlenecks.',
      problemAddressed:
        'Manual peer code reviews are time-intensive and frequently miss subtle edge cases, security vulnerabilities, or inconsistent error handling before pull requests are merged.',
      keyFunctionality: [
        'Automated parsing of source code diffs and file trees for contextual LLM evaluation.',
        'Structured diagnostic output categorizing findings by severity, security impact, and refactoring priority.',
        'RESTful API integration designed for seamless developer workflow execution.'
      ],
      techStack: ['Python', 'FastAPI', 'Generative AI', 'LLMs', 'REST APIs', 'Static Analysis'],
      repoUrl: 'https://github.com/adarshanumula7',
      liveUrl: null,
      matchedRepoName: null,
      stars: 0
    },
    {
      id: 'async-fastapi-job-service',
      title: 'Asynchronous Job Processing Service',
      domainBadge: 'Backend Microservice',
      categories: ['python', 'web'],
      keywords: ['async', 'job', 'queue', 'worker', 'fastapi', 'task', 'processing'],
      shortDescription:
        'High-concurrency asynchronous task execution service built with Python and FastAPI for non-blocking background job scheduling, status tracking, and result persistence.',
      problemAddressed:
        'Synchronous HTTP request-response cycles block client connections and degrade API throughput when executing compute-heavy tasks, batch data processing, or external AI inference calls.',
      keyFunctionality: [
        'Non-blocking REST endpoints for job submission, lifecycle state polling (queued, running, completed, failed), and payload retrieval.',
        'Asynchronous worker execution loop with structured exception handling and retry semantics.',
        'Schema validation using Pydantic models and automatic OpenAPI / Swagger documentation.'
      ],
      techStack: ['Python', 'FastAPI', 'Asyncio', 'REST APIs', 'Pydantic', 'Docker'],
      repoUrl: 'https://github.com/adarshanumula7',
      liveUrl: null,
      matchedRepoName: null,
      stars: 0
    },
    {
      id: 'porto-seguro-ml-classification',
      title: 'Porto Seguro Safe Driver ML Classification Pipeline',
      domainBadge: 'Machine Learning',
      categories: ['aiml', 'python'],
      keywords: ['porto', 'seguro', 'classification', 'driver', 'xgboost', 'lightgbm', 'kaggle', 'ml'],
      shortDescription:
        'End-to-end supervised Machine Learning classification pipeline predicting automobile insurance claim probability on the highly imbalanced Porto Seguro tabular dataset.',
      problemAddressed:
        'Real-world actuarial and risk datasets exhibit severe class imbalance, missing-value encoding, and heterogeneous categorical/continuous features that cause standard classifiers to overfit.',
      keyFunctionality: [
        'Exploratory data analysis, missing-value imputation, one-hot encoding, and feature engineering using Pandas and NumPy.',
        'Stratified cross-validation and hyperparameter tuning across Scikit-learn, XGBoost, and LightGBM gradient-boosted decision trees.',
        'Evaluation using Normalized Gini Coefficient and ROC-AUC metrics tailored for imbalanced probability ranking.'
      ],
      techStack: ['Python', 'Scikit-learn', 'XGBoost', 'LightGBM', 'Pandas', 'NumPy'],
      repoUrl: 'https://github.com/adarshanumula7',
      liveUrl: null,
      matchedRepoName: null,
      stars: 0
    },
    {
      id: 'enterprise-dotnet-rbac-workflow',
      title: 'Enterprise RBAC & Dynamic Workflow Architecture',
      domainBadge: 'Enterprise .NET Architecture',
      categories: ['dotnet', 'web'],
      keywords: ['dotnet', 'aspnet', 'mvc', 'rbac', 'csharp'],
      shortDescription:
        'Database-driven enterprise web architecture implementing dynamic module configuration, hierarchical main/sub-tab rendering, and multi-stage reviewer/approver workflows.',
      problemAddressed:
        'Enterprise applications in regulated industries require role-specific UI modularity and auditable multi-stage approval workflows without redeploying application binaries for permission updates.',
      keyFunctionality: [
        'JWT authentication paired with granular Role-Based Access Control (RBAC) enforcing controller and view-level permissions.',
        'Dynamic main/sub-tab navigation and Kendo UI MVC data views driven by SQL Server configuration metadata.',
        'Multi-tier reviewer and approver state transitions persisted via ADO.NET and parameterized SQL Server Stored Procedures.'
      ],
      techStack: ['C#', 'ASP.NET Core 8', 'ASP.NET MVC', 'SQL Server', 'Stored Procedures', 'ADO.NET', 'Kendo UI MVC', 'JWT'],
      repoUrl: null,
      liveUrl: null,
      isEnterpriseWork: true
    }
  ];

  var activeCategory = 'all';

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

  function renderProjects() {
    var grid = document.getElementById('featured-projects-grid');
    if (!grid) return;

    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    var filtered = FEATURED_PROJECTS.filter(function (proj) {
      if (activeCategory === 'all') return true;
      return proj.categories.indexOf(activeCategory) !== -1;
    });

    filtered.forEach(function (proj) {
      var card = createEl('article', 'project-card');

      // Top bar
      var topRow = createEl('div', 'project-card-top');
      var domainBadge = createEl('span', 'project-domain-badge', proj.domainBadge);
      topRow.appendChild(domainBadge);

      var statusText = proj.isEnterpriseWork
        ? 'Production Enterprise Architecture'
        : proj.matchedRepoName
          ? 'Linked: ' + proj.matchedRepoName
          : 'Verified Engineering Project';
      var statusBadge = createEl('span', 'project-status-badge', statusText);
      topRow.appendChild(statusBadge);
      card.appendChild(topRow);

      // Title & Short Description
      var title = createEl('h3', 'project-title', proj.title);
      card.appendChild(title);

      var desc = createEl('p', 'project-desc', proj.shortDescription);
      card.appendChild(desc);

      // Problem & Solution Block
      var detailBlock = createEl('div', 'project-detail-block');
      var probHeading = createEl('strong', null, 'Engineering Problem');
      var probText = createEl('p', null, proj.problemAddressed);
      detailBlock.appendChild(probHeading);
      detailBlock.appendChild(probText);

      var funcHeading = createEl('strong', null, 'Key Implementation');
      funcHeading.style.marginTop = '10px';
      detailBlock.appendChild(funcHeading);

      var funcList = createEl('ul', 'project-Detail-list');
      proj.keyFunctionality.forEach(function (item) {
        var li = createEl('li', null, item);
        funcList.appendChild(li);
      });
      detailBlock.appendChild(funcList);
      card.appendChild(detailBlock);

      // Tech Stack Tags
      var tagsWrap = createEl('div', 'project-tags');
      proj.techStack.forEach(function (tech) {
        var tag = createEl('span', 'project-tag', tech);
        tagsWrap.appendChild(tag);
      });
      card.appendChild(tagsWrap);

      // Action Links
      var linksWrap = createEl('div', 'project-links');
      if (proj.isEnterpriseWork) {
        var expLink = createEl('a', 'btn btn-sm btn-outline', 'View Experience Details');
        expLink.setAttribute('href', '#experience');
        linksWrap.appendChild(expLink);
      } else if (isValidHttpUrl(proj.repoUrl)) {
        var ghBtn = createEl(
          'a',
          'btn btn-sm btn-secondary',
          proj.matchedRepoName ? 'View Repository (' + proj.matchedRepoName + ')' : 'Explore on GitHub'
        );
        ghBtn.setAttribute('href', proj.repoUrl);
        ghBtn.setAttribute('target', '_blank');
        ghBtn.setAttribute('rel', 'noopener noreferrer');
        linksWrap.appendChild(ghBtn);

        if (isValidHttpUrl(proj.liveUrl)) {
          var demoBtn = createEl('a', 'btn btn-sm btn-primary', 'Live Demo');
          demoBtn.setAttribute('href', proj.liveUrl);
          demoBtn.setAttribute('target', '_blank');
          demoBtn.setAttribute('rel', 'noopener noreferrer');
          linksWrap.appendChild(demoBtn);
        }
      }

      card.appendChild(linksWrap);
      grid.appendChild(card);
    });
  }

  function setupFilterButtons() {
    var buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var selected = btn.getAttribute('data-filter') || 'all';
        activeCategory = selected;

        buttons.forEach(function (b) {
          var isMatch = b.getAttribute('data-filter') === selected;
          b.classList.toggle('active', isMatch);
          b.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
        });

        renderProjects();
      });
    });
  }

  /**
   * Reconciles curated project cards with live repositories fetched from GitHub REST API.
   * Dynamically binds exact repository URLs and verified homepage demo URLs.
   */
  function reconcileWithGitHub(repos) {
    if (!Array.isArray(repos) || repos.length === 0) return;

    FEATURED_PROJECTS.forEach(function (proj) {
      if (proj.isEnterpriseWork) return;

      var bestRepo = null;
      var bestScore = 0;

      repos.forEach(function (repo) {
        var haystack = (
          (repo.name || '') +
          ' ' +
          (repo.description || '') +
          ' ' +
          (Array.isArray(repo.topics) ? repo.topics.join(' ') : '')
        ).toLowerCase();

        var score = 0;
        proj.keywords.forEach(function (kw) {
          if (haystack.indexOf(kw.toLowerCase()) !== -1) {
            score += 2;
          }
          if ((repo.name || '').toLowerCase().indexOf(kw.toLowerCase()) !== -1) {
            score += 3;
          }
        });

        if (score > bestScore) {
          bestScore = score;
          bestRepo = repo;
        }
      });

      if (bestRepo && bestScore >= 3) {
        proj.repoUrl = bestRepo.html_url;
        proj.matchedRepoName = bestRepo.name;
        proj.stars = bestRepo.stargazers_count || 0;
        if (isValidHttpUrl(bestRepo.homepage)) {
          proj.liveUrl = bestRepo.homepage;
        }
      }
    });

    renderProjects();
  }

  function init() {
    setupFilterButtons();
    renderProjects();
  }

  window.PortfolioProjects = {
    init: init,
    reconcileWithGitHub: reconcileWithGitHub
  };
})();