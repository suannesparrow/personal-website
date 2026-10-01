# Suanne Sparrow — Engineering Portfolio

A responsive, single-page engineering portfolio built with HTML, CSS, and a small amount of JavaScript. The page has five sections: intro, about and skills, technical projects, experience, and contact. The hero and About slideshow use the personal photos supplied for the site, resized and compressed for web delivery.

## Run locally

Open `index.html` in a browser, or serve the repository root with any static HTTP server. There is no build step. IBM Plex Sans and IBM Plex Mono load from Google Fonts, with system fallbacks.

## Content and assets

- `assets/` contains project images, optimized personal photos, and the portfolio and résumé PDFs linked from the page.
- Project cards open accessible detail dialogs; matching portfolio PDF pages load only when requested.
- The district-energy project is presented as a sanitized overview. Client-identifying details, internal HMI screens, plant-specific data, and control diagrams are omitted.
- The chassis project is an academic manufacturing project and is not affiliated with Apple.

## Publishing

The repository is connected as `origin`. To publish with GitHub Pages, select the `main` branch and repository root under **Settings → Pages**. Add a custom domain later if desired.
