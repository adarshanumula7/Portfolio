# Adarsh Anumula — Developer Portfolio Website

Production-ready, responsive developer portfolio website for **Adarsh Anumula** (Associate Software Engineer at Proclink Consulting Services & B.Tech Computer Science and Engineering graduate from IIT Guwahati).

Built strictly with semantic **HTML5**, modern **CSS3** (custom properties, responsive Grid/Flexbox, dark/light theme engine), and modular **Vanilla JavaScript (ES6+)** with zero frontend framework or backend server dependencies.

## 1. Project Overview

- **Candidate Profile:** Highlights enterprise `.NET` engineering experience (`C#`, `ASP.NET Core 8`, `ASP.NET MVC`, `SQL Server`, `ADO.NET`, `RBAC`, `JWT`) alongside applied `Python`, `FastAPI`, `Machine Learning`, and `Generative AI / RAG` project work.
- **Live GitHub REST API Discovery:** Automatically fetches and paginates through all public repositories owned by `adarshanumula7`, computing live repository, star, and fork totals while providing instant client-side search, language filtering, and multi-criteria sorting.
- **Resilient & Secure Frontend:** Implements `localStorage` caching with a 30-minute TTL to prevent GitHub API rate-limit disruptions and constructs all external API DOM nodes using XSS-safe `document.createElement` and `textContent` APIs.
- **Dual-Deployment Compatibility:** Uses strictly relative asset paths (`./css/...`, `./js/...`, `./assets/resume.pdf`) so the site functions identically as a GitHub User Site (`https://adarshanumula7.github.io/`) or a GitHub Project Site (`https://adarshanumula7.github.io/portfolio/`).

## 2. Project Folder Structure

| Path | Type | Description |
|---|---|---|
| `./index.html` | HTML5 | Main single-page application markup, SEO/OpenGraph metadata, and inline SVG icons. |
| `./css/style.css` | CSS3 | Tokenized dark/light theme variables, responsive layouts, and accessibility styles. |
| `./js/main.js` | JavaScript | Theme persistence, mobile drawer navigation, scroll-spy active section tracking, and initialization. |
| `./js/projects.js` | JavaScript | Featured projects rendering, category filtering, and automatic reconciliation with live GitHub API data. |
| `./js/github.js` | JavaScript | Public GitHub REST API pagination client, `localStorage` caching, search, language filter, and sorting. |
| `./assets/resume.pdf` | PDF Binary | Official resume PDF file served by the navigation, hero, and contact download buttons. |
| `./assets/images/` | Directory | Optional directory for project screenshots or OpenGraph preview images. |
| `./assets/icons/` | Directory | Optional directory for standalone icon assets. |
| `./README.md` | Markdown | Technical documentation, customization guide, and GitHub Pages deployment instructions. |
| `./.nojekyll` | Config | Empty marker file instructing GitHub Pages to serve static assets without Jekyll processing. |

## 3. Updating Personal Information and Resume

### Updating Personal Details

1. **Biographical & Experience Content:** Open `index.html` and edit the `#home`, `#about`, `#skills`, `#experience`, `#education`, or `#contact` sections directly.
2. **Featured Projects:** Open `js/projects.js` and modify the `FEATURED_PROJECTS` array. Each project object supports `title`, `domainBadge`, `categories`, `keywords` (used for automatic matching against live GitHub repositories), `shortDescription`, `problemAddressed`, `keyFunctionality`, and `techStack`.

### Replacing the Resume PDF

1. Export the updated resume as a standard PDF document.
2. Rename the file to `resume.pdf`.
3. Place the file at `./assets/resume.pdf`, overwriting the existing file.
4. All download buttons (`href="./assets/resume.pdf" download="Adarsh_Anumula_Resume.pdf"`) will immediately serve the updated document.

## 4. How the GitHub API Integration Works

The module `js/github.js` queries the public unauthenticated GitHub REST API endpoint:

```text
https://api.github.com/users/adarshanumula7/repos?type=owner&sort=updated&per_page=100&page=1
```

- **Pagination:** If the account owns more than 100 public repositories, `fetchAllOwnedRepos()` automatically increments the `page` parameter until all public repositories are retrieved.
- **Caching:** Retrieved data is cached in `localStorage` under `aa_gh_repos_cache_v1_adarshanumula7` for 30 minutes. If GitHub's API is unreachable or rate-limited (`HTTP 403`), the interface automatically falls back to the cached snapshot or displays a retry state with a direct link to `https://github.com/adarshanumula7`.
- **Updating the GitHub Username:** To change the target GitHub account, open `js/github.js` and update the constant `var GITHUB_USERNAME = 'adarshanumula7';` on line 8.

## 5. Running the Website Locally

Because the website uses standard HTML, CSS, and Vanilla JavaScript without build tools, it can be opened directly in any modern browser or served via any lightweight static HTTP server.

1. **Direct Browser Execution:** Double-click `index.html` to open it in Chrome, Edge, Firefox, or Safari.
2. **VS Code Live Server:** Open the folder in Visual Studio Code and click **Go Live** using the Live Server extension.

## 6. Publishing with GitHub Pages

1. Create a public repository on GitHub (either `adarshanumula7.github.io` for a root user site or `portfolio` for a project site).
2. Ensure `index.html`, `.nojekyll`, `README.md`, `css/style.css`, `js/main.js`, `js/projects.js`, `js/github.js`, and `assets/resume.pdf` are committed to the root of the `main` branch.
3. Open the repository on GitHub and navigate to **Settings → Pages** in the left sidebar.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then click **Save**.
6. Wait for GitHub Pages to publish the deployment, then open the live URL displayed at the top of the Pages settings screen.