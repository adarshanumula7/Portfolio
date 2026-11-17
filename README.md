# Adarsh Anumula — Developer Portfolio Website

Production-ready, responsive developer portfolio website for **Adarsh Anumula** — Associate Software Engineer at **Proclink Consulting Services** (Hyderabad, India) and B.Tech in Computer Science and Engineering graduate from the **Indian Institute of Technology Guwahati (IIT Guwahati, 2021–2025)**.

Built with semantic **HTML5**, modern **CSS3**, and modular **Vanilla JavaScript (ES6+)**, enhanced with lightweight, zero-build CDN libraries for scroll-driven animations, live GitHub visual analytics, 3D card physics, interactive node networks, smooth grid transitions, and a developer Command Palette (`Ctrl + K` / `Cmd + K`).

---

## 1. Project Overview & Key Capabilities

- **Dual-Track Engineering Positioning:** Highlights production enterprise `.NET` engineering experience (`C#`, `ASP.NET Core 8`, `ASP.NET MVC`, `Razor`, `ADO.NET`, `SQL Server`, `Stored Procedures`, `Kendo UI MVC`, `JWT Authentication`, `RBAC`, `IIS`) alongside applied `Python`, `FastAPI`, `Machine Learning` (`Scikit-learn`, `XGBoost`, `LightGBM`), and `Generative AI / RAG` project work.
- **Live GitHub REST API Discovery & Visual Telemetry:** Dynamically fetches and paginates through all public repositories owned by `adarshanumula7`, computing live repository, star, and fork totals, rendering interactive **Chart.js** language and codebase footprint charts, and providing instant search, language filtering, and multi-criteria sorting.
- **Featured Project Live Reconciliation:** Curated project cards automatically synchronize with the live GitHub API payload to bind exact repository URLs, star counts, and verified `homepage` demo links.
- **Resilient & XSS-Safe Architecture:** Implements client-side `localStorage` caching with a 30-minute Time-To-Live (TTL) and stale-cache fallback to prevent GitHub API rate-limit (`HTTP 403`) disruptions. All external API data is rendered strictly via `document.createElement()` and `textContent` (zero unsafe `innerHTML` injection).
- **Dual-Deployment Compatibility:** Uses strictly relative asset paths (`./css/style.css`, `./js/*.js`, `./assets/resume.pdf`) so the website works identically as a GitHub User Site (`https://adarshanumula7.github.io/`) or a GitHub Project Site (`https://adarshanumula7.github.io/Portfolio/`).

---

## 2. Frontend Libraries & UI Enhancements (All 1–6 Upgrades)

All libraries are loaded via global CDNs using `defer` or native ES module imports. The website requires **no Node.js runtime, no bundler, and no build step**. Every enhancement includes defensive checks and automatically respects the user's `prefers-reduced-motion` accessibility setting.

| Upgrade | Library / Technology | Version | Implementation Details |
| :--- | :--- | :--- | :--- |
| **1. Scroll Motion & Counters** | **GSAP + ScrollTrigger** | `3.12.5` | Powers staggered viewport entrance reveals (`.gs-reveal`), the scroll-linked vertical progress bar in the Experience timeline (`#timeline-progress-bar`), and smooth count-up animations for GitHub statistics (`#gh-stat-repos`, `#gh-stat-stars`, `#gh-stat-forks`) and JEE Advanced AIR `1529` (`#jee-rank-counter`). |
| **2. Live GitHub Visual Analytics** | **Chart.js** | `4.4.1` | Renders two live, theme-aware charts inside `#gh-analytics-panel`: a **Primary Language Distribution Doughnut Chart** (`#gh-lang-chart`) and a **Top 6 Repositories by Codebase Footprint Horizontal Bar Chart** (`#gh-repo-chart`). Automatically re-renders with matching palette colors when toggling Dark/Light mode. |
| **3. 3D Card Physics & Spotlight** | **Vanilla-Tilt.js + CSS Radial Glow** | `1.8.1` | Adds hardware-accelerated 3D perspective tilt and glare to the Hero Engineering Architecture card (`#hero-arch-card`) and Featured Project cards (`.project-card`) on desktop pointer devices, paired with a cursor-tracking radial border glow (`.spotlight-card` using `--mouse-x` and `--mouse-y`). |
| **4. Hero Node Canvas & Typewriter** | **tsParticles (Slim) + Typed.js** | `2.12.0` / `2.1.0` | Renders an interactive neural/system node network canvas (`#hero-particles`) behind the Hero section that reacts to cursor proximity and adapts to Dark/Light mode, paired with a dynamic typewriter headline (`#typed-specialty`) cycling through `.NET`, `LLMs/RAG`, `FastAPI`, and `Machine Learning` specialties. |
| **5. Fluid Grid Filtering** | **FormKit AutoAnimate** | `0.8.2` | Provides zero-configuration smooth layout transitions (`autoAnimate`) on `#featured-projects-grid` and `#gh-repo-grid` whenever users filter project categories or search/sort GitHub repositories. |
| **6. Developer UX Polish** | **Lucide Icons + Tippy.js + Popper.js + Command Palette** | `0.460.0` / `6.x` / `2.x` | Renders crisp SVG vector icons (`data-lucide`), attaches interactive provenance tooltips (`data-tippy-content`) to every technical skill tag (*Production Enterprise* vs. *Project & Academic*), and provides a keyboard-accessible **`Ctrl + K` / `Cmd + K` Command Palette** (`#cmd-modal-overlay`) for instant navigation, project filtering, theme switching, and resume download. |

---

## 3. Project Folder Structure

```text
portfolio/
│
├── index.html          # Main single-page HTML5 markup, SEO/OpenGraph metadata, Command Palette modal & CDN scripts
│
├── css/
│   └── style.css       # Tokenized dark/light theme variables, radial spotlight cards, Chart.js panels & responsive grid
│
├── js/
│   ├── main.js         # Theme controller, GSAP ScrollTrigger, tsParticles, Typed.js, Tippy tooltips & Ctrl+K modal
│   ├── projects.js     # Curated Featured Projects, category filters, Vanilla-Tilt binding & live GitHub reconciliation
│   └── github.js       # GitHub REST API pagination client, localStorage cache, Chart.js analytics, search/filter/sort
│
├── assets/
│   ├── images/         # Optional directory for custom project screenshots or OpenGraph preview images
│   ├── icons/          # Optional directory for standalone custom icon files
│   └── resume.pdf      # Official PDF resume served by the Navbar, Hero, Contact & Command Palette download actions
│
├── README.md           # Project documentation, library reference, customization guide & deployment instructions
│
└── .nojekyll           # Empty marker file instructing GitHub Pages to bypass Jekyll processing
```

---

## 4. Customization & Maintenance Guide

### A. Updating Personal, Academic, or Experience Information
1. Open `index.html` in any code editor.
2. Edit the semantic sections directly:
   - **Hero Section:** `#home`
   - **About Me:** `#about`
   - **Technical Skills & Provenance Tooltips:** `#skills` (update `data-tippy-content` on `.skill-tag` elements to adjust tooltip descriptions)
   - **Professional Experience:** `#experience`
   - **Education & Achievements:** `#education`
   - **Contact Channels:** `#contact`

### B. Updating Featured Projects
1. Open `js/projects.js` and locate the `FEATURED_PROJECTS` array at the top of the file.
2. Add or edit project objects using the following schema:
   - `id`: Unique string identifier
   - `title`: Project title
   - `domainBadge`: Short category label displayed at the top of the card
   - `categories`: Array of filter keys (`'genai'`, `'aiml'`, `'python'`, `'dotnet'`, `'web'`)
   - `keywords`: Array of lowercase keywords used by `reconcileWithGitHub()` to automatically match the card with its corresponding public GitHub repository
   - `shortDescription`: High-level summary of the project
   - `problemAddressed`: Explanation of the engineering challenge solved
   - `keyFunctionality`: Array of bullet strings detailing the implementation
   - `techStack`: Array of technology tags

### C. Replacing the Resume PDF
1. Export your updated resume as a PDF file named `resume.pdf`.
2. Place the file at `./assets/resume.pdf` (replacing the existing file).
3. All download triggers across the Navbar, Hero CTA group, Contact section, and `Ctrl + K` Command Palette (`href="./assets/resume.pdf" download="Adarsh_Anumula_Resume.pdf"`) will automatically serve the new file.

### D. Updating the GitHub Username
1. Open `js/github.js`.
2. Update `var GITHUB_USERNAME = 'adarshanumula7';` at the top of the file.
3. The API endpoint, `localStorage` cache key, repository cards, and Chart.js visualizations will automatically target the updated username.

---

## 5. How the GitHub REST API Integration Works

The module `js/github.js` queries the official public GitHub REST API endpoint:
`https://api.github.com/users/adarshanumula7/repos?type=owner&sort=updated&per_page=100&page=1`

1. **Automatic Multi-Page Pagination:** `fetchAllOwnedRepos()` requests 100 repositories per page and automatically increments `page` until all public repositories owned by `adarshanumula7` are retrieved.
2. **Client-Side Caching (`localStorage`):** Fetched repository payloads are stored under `aa_gh_repos_cache_v1_adarshanumula7` with a 30-minute TTL timestamp. Clicking the **Refresh** button bypasses the cache and forces a fresh API fetch.
3. **Graceful Error & Rate-Limit Recovery:** If the unauthenticated GitHub API rate limit (60 requests/hour/IP) is reached or the network is offline, the app falls back to the most recent cached snapshot or displays a clean error banner with a **Retry API Fetch** button and a direct link to `https://github.com/adarshanumula7?tab=repositories`.
4. **Metadata Completeness:** Public owned repositories and public forks are clearly labeled with `Source`, `Fork`, and `Archived` badges. Repositories without a description or primary language are never hidden—they display clean fallback text and are grouped under `Multi / Docs`.

---

## 6. Running the Website Locally

Because the project uses standard HTML5, CSS3, and Vanilla JavaScript without any build step, you can run it locally using any static server:

### Option 1: VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension.
3. Right-click `index.html` and select **Open with Live Server**.

### Option 2: Python Built-in HTTP Server
Run the following command from the project root directory:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 3: Direct File Execution
Double-click `index.html` to open it directly in Chrome, Edge, Firefox, or Safari. *(Note: Using a local HTTP server such as Live Server or `python -m http.server` is recommended so the browser loads the ES module for `@formkit/auto-animate` without `file://` CORS restrictions).*

---

## 7. Publishing to GitHub Pages

1. **Create a Repository:** Create a public repository on GitHub (name it `adarshanumula7.github.io` for a root user site, or `Portfolio` for a project site).
2. **Push Website Files:** Commit and push `index.html`, `.nojekyll`, `README.md`, `css/style.css`, `js/main.js`, `js/projects.js`, `js/github.js`, and `assets/resume.pdf` to the root of the `main` branch.
3. **Open Repository Settings:** On GitHub, navigate to your repository and click **Settings** in the top navigation bar.
4. **Configure GitHub Pages:**
   - Click **Pages** in the left sidebar.
   - Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and `/ (root)`, then click **Save**.
5. **Access Your Live Portfolio:** Wait 1–2 minutes for deployment to finish, then visit the published URL displayed at the top of the GitHub Pages settings screen.

---

## 8. Contact & Links

- **Name:** Adarsh Anumula
- **Role:** Associate Software Engineer @ Proclink Consulting Services
- **Education:** B.Tech in Computer Science and Engineering, IIT Guwahati (2021–2025)
- **GitHub:** [https://github.com/adarshanumula7](https://github.com/adarshanumula7)
- **LinkedIn:** [https://www.linkedin.com/in/adarsh-anumula-4b0293228/](https://www.linkedin.com/in/adarsh-anumula-4b0293228/)
- **Email:** [anumulaadarsh6@gmail.com](mailto:anumulaadarsh6@gmail.com)