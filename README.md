# Hari Ganesh J — Portfolio

A scroll-driven portfolio. Cream hero where the words appear one at a time
(HELLO → HARI → AI & ML) over drifting dust, a constellation burst and a centred
intro; a dark glowing timeline; a 5-stage tech pipeline whose cards fly out of a
laser-lit WebGL tunnel one by one; certificate marquees; a pinned horizontal projects section;
contact form; giant-name footer.

## Run it

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 5199
```

then visit http://localhost:5199. (Needs internet for fonts and the GSAP / Lenis CDN scripts.)

## Make it yours

| What | Where |
| --- | --- |
| Name, email, phone, hero words, timeline, tech stack, certificates, projects, footer | `js/data.js` (items marked `// EDIT` still need a real value) |
| Hero intro (hello line, name lines, typed role, button label, scroll hint) | `intro` in `data.js`; its GitHub / LinkedIn / Mail links come from `footer.socials` |
| Certificates (issuer symbol on the card, click opens the PDF) | each item in `certs.items` in `data.js`: `logo` (symbol image) and `file` (PDF); keep the files in `assets/certificates/` |
| Resume button (footer, above your name) | `resume` / `resumeName` in `data.js`; to update it, replace `assets/resume.pdf` with a new PDF of the same name |
| GitHub / LinkedIn links | `footer.socials` in `data.js` (taken from your resume) |
| Hero outline echo behind each word | `heroGhost: true` in `data.js` (off by default so words never overlap) |
| Colours and fonts | CSS variables at the top of `css/style.css` |
| Stage card colour and tunnel laser colour per stage | `color` (r,g,b) and `hue` on each item in `tech.stages` in `data.js` |
| How long each stage flies vs. sits docked, how far down the tunnel it starts | `FLY` and `Z_FAR` at the top of the tech section in `js/main.js` |
| Laser tunnel (lasers, lamps, floor lines, speed) | the `TUNNEL_FS` shader string in `js/main.js` (cruise speed is the `3.2` in `drawTunnel`) |

## Files

```
index.html          page skeleton
css/style.css       all styling
js/data.js          your content
js/main.js          animation + rendering (incl. the WebGL tunnel)
assets/resume.pdf   your resume (the footer Download Resume button)
assets/certificates/ certificate PDFs and the issuer logos shown on the cards
.claude/launch.json dev-server config for the Claude Code preview (safe to delete)
```
