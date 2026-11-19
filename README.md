# PANEL — Comic Book Hub

A responsive, GitHub Pages-ready comic discovery website inspired by the three supplied reference screenshots.

## Features

- Five horizontally scrollable comic categories, each with left/right arrows.
- Hot Topics hero rotates through six featured comics every five seconds and loops back to the first.
- Comic title and cover hover states use `#659276`; the text returns to black when the pointer leaves.
- Existing sage-green controls, footer links, and social icons turn white on hover.
- Search filters visible comic cards.
- Clicking a comic opens the publisher's official comics page in a new tab.
- The page reloads at local midnight and checks for a day change when a background tab becomes visible.
- Responsive vertical page scrolling and mobile layout.

## Run locally

Open `index.html` in a browser, or use a local static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a GitHub repository and upload the contents of this ZIP (not the ZIP itself).
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Select `main` and `/ (root)`, then save.
4. GitHub Pages will publish the site.

## Daily content note

The page is configured to refresh once per local calendar day. The included `comics.js` file is a starter catalog so the site works immediately on GitHub Pages. A browser-only static site cannot reliably discover live sales/popularity rankings or current weekly releases by itself; that requires a licensed comics data API/feed (and often a private API key or small serverless proxy). Replace `COMIC_ROWS` and `HOT_TOPICS` in `comics.js` with data from a source you are authorized to use. The hero rotation is limited to the first six `HOT_TOPICS` entries.

## Cover art

The included reference crops are taken from the screenshots supplied for this build. Additional placeholder covers are CSS-designed visual treatments. Replace these with licensed cover images before public/commercial deployment.
