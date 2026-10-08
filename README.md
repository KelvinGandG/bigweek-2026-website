# BIG WEEK 2026 — Website

A static website: plain HTML, CSS and JavaScript. There is no build step and no server code.
Upload the whole `website` folder to any web host and it works.

```
website/
├── index.html        Home
├── chapters.html     The four chapters
├── lineup.html       Lineup
├── tickets.html      Tickets
├── info.html         Info & FAQs
├── partners.html     Partners + enquiry form
└── assets/
    ├── css/style.css
    ├── js/config.js  ← everything you'll normally edit
    ├── js/main.js
    └── img/
```

## Everyday updates — `assets/js/config.js`

Open `assets/js/config.js` in any text editor, change the value, save and re-upload that one file.

### Ticket links
```js
tickets: "https://bigweek.howler.co.za",
```
Every **Buy now / Get tickets** button on the site uses this link.
Optional: the `days`, `bigPass` and `bigTable` entries can hold more specific Howler links later. Blank entries fall back to `tickets`.

### Sale dates (drive every countdown and button switch)
```js
preRegCloses:  "2026-10-02T00:00:00+02:00",
loyaltyOnSale: "2026-10-08T12:00:00+02:00",
publicOnSale:  "2026-10-09T12:00:00+02:00",
festivalStart: "2026-12-27T15:00:00+02:00"
```
The site changes itself on these dates:

| Until | What visitors see |
|---|---|
| 4 Oct 23:59 | Pre-Register buttons, countdown to pre-reg closing |
| 8 Oct 12:00 | "Pre-registration closed", countdown to on-sale |
| 9 Oct 12:00 | Buy buttons live (loyalty sale), countdown to public sale |
| After | Buy buttons live, countdown to the festival |

**Preview any stage** by adding `?state=` to a page address, e.g. `tickets.html?state=onsale`
(options: `prereg`, `closed`, `loyalty`, `onsale`).

### Lineup — add artists whenever you announce
```js
nights: {
  "yanoz-club": [
    { name: "Headline Artist", photo: "headline-artist.jpg", headliner: true },
    { name: "Artist Two", photo: "artist-two.jpg" },
    "Artist Three"
  ],
  ...
}
```
- **Photos:** save them in `assets/img/artists/`. Use portrait 4:5 (about 1000 x 1250 px) JPGs, named simply, e.g. `artist-two.jpg`.
- **Name only:** an artist without a photo shows a placeholder card with their initial until a photo is added.
- **Headliner:** `headliner: true` shows the card at double size on the Lineup page.
- **Placeholders:** empty spots show "Coming soon" cards, and a "More to come" card stays at the end until you set `complete: true`.
- **Where names show:** the Lineup page shows photo cards. The Home lineup and the Chapters page show the names only.

### Partner gallery (Partners page)
Shown as brand tabs (Flying Fish first), each opening a swipeable row of photos.
Every photo gets a "BIG WEEK x <brand>" tag automatically, and tapping a photo enlarges it.
To add a brand or photos:
1. Save two sizes of each photo into `assets/img/partners/`: a large one (about 1600px) and a small one (about 720px).
2. Add them under the brand in `partnerGallery` in config.js: `["large.jpg", "small.jpg", smallWidth, smallHeight]`.
The order of brands in the list is the order of the tabs.

### Floating 3D gold elements
The chrome shapes that drift around each page live in `assets/img/elements/`.
Their positions are set per page in `assets/js/main.js`, in the `FLOAT` list near the bottom.
Each line gives the section, the element, its position and size on desktop, and its position on phones
(`null` means it's hidden on phones). "b" sits behind the glass panels; "f" floats in front.

### Contact email
`contact.email` is where the Partners enquiry form sends to.

## Things to know

- **Enquiry form:** the site has no server, so **Send enquiry** opens the visitor's own email app with the enquiry pre-filled to info@gandgpro.com. To receive submissions directly instead, connect a form service such as Formspree or Netlify Forms after deploying.
- **Venue:** "Venue coming soon" appears on every page. When the venue is announced, search the `.html` files for `Venue coming soon`.
- **Fonts:** Amatic SC (headlines) and Poppins (body), loaded from Google Fonts.
- **Images:** `assets/img/gallery/` holds last year's photos, optimised and ready for future use. They aren't on any page yet.
- **Partner photos:** two Flying Fish photos (DSC03057 and DSC03059, which came out almost black) were left out of the gallery.

## Deploying
Any static host works. For example:
- **Netlify / Vercel / Cloudflare Pages:** drag and drop the `website` folder.
- **Existing hosting (cPanel etc.):** upload the contents of `website` into the site's public folder (`public_html`).

Point `bigweek.co.za` at it and you're live.

## After editing CSS or JS
The pages load `style.css`, `config.js`, `early.js` and `main.js` with a version tag (e.g. `?v=20261008b`).
When you change any of those files, bump the tag in all six `.html` files (search and replace the old tag)
so visitors' browsers fetch the new version straight away instead of a saved copy.

## Security, SEO and AI files
- **Content-Security-Policy** (in every page's `<head>`): the site may only load files from itself. If you ever embed something external (a YouTube video, analytics, a Howler widget), that host must be added to the policy or it will be blocked.
- **Fonts** are self-hosted in `assets/fonts/` (Amatic SC, Poppins; SIL Open Font License). No calls to Google.
- **robots.txt / sitemap.xml / llms.txt** sit at the site root and use `https://bigweek.co.za/` URLs. They only take effect once the domain points here.
- **Structured data:** the Home page describes the festival and its four nights (schema.org `Festival` + `MusicEvent`); Info carries the FAQs (`FAQPage`). Update the dates, prices or venue there when they change.
- **Unannounced artists:** anything in `config.js` is public the moment it's pushed, even if it isn't shown on a page. Only add artists when they're announced.
- **404.html** is the branded "page not found" page.
