# ABU ARSHID P — Portfolio

React + Vite portfolio. All content comes from the CV, project screenshots and certificate supplied.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Build for hosting
```bash
npm run build      # outputs ./dist
npm run preview    # test the production build
```
`dist/` is a static site: upload it to Netlify, Vercel, GitHub Pages or any web host.

## Where things live
- `src/data/content.js` — all text, links, projects, certifications (edit here to update the site)
- `src/components/` — Navbar, Hero, About, Skills, Experience, Projects, Certifications, Education, Resume, Contact, Footer
- `src/styles/global.css` — colours (dark/light), type and layout
- `public/ABU_ARSHID_P.pdf` — the CV used by Download CV / View CV (replace the file to update it)
- `public/images/` — optimised photo, project screenshots, certificate, CV preview
