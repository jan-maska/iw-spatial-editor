# IW Spatial Visual Editor GitHub Pages site

Static, dependency-free landing page, documentation, and hosted editor prepared for GitHub Pages.

## Publish

Copy the contents of `dist/` to the root of the branch or folder served by GitHub Pages. All internal links are resolved from `site-config.js`, so the site works on both account-level and project-level Pages URLs.

## Configure destinations

Edit `dist/site-config.js`:

```js
window.IW_EDITOR_SITE_CONFIG = {
  launchUrl: "./app/",
  docsUrl: "./docs/",
  downloadUrl: "./downloads/IW-Spatial-Editor-0.4.0.zip",
  githubUrl: "https://github.com/your-account/iw-spatial-visual-editor"
};
```

The first three defaults point to bundled files. Replace `githubUrl`, and redirect any other destination if you host it elsewhere.

## Contents

- `dist/index.html` — landing page
- `dist/app/index.html` — self-contained Visual Editor 0.4.0
- `dist/docs/index.html` — editor documentation
- `dist/downloads/` — offline editor ZIP
- `dist/assets/` — shared styles, behavior, logo, and hero artwork

No build step, framework, third-party fonts, analytics, or runtime network calls are required.
