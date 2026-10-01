# salon-site-template

A lightweight one-page website template for nail salons. Plain HTML, CSS and vanilla JavaScript (`index.html`, `styles.css`, `app.js`; content in `salon.js`) — no build step.

## Make a new salon's site

1. Copy this repo (use **Use this template**, or fork/copy it) for the new salon.
2. Open `salon.js` and edit the `SALON` object: name, tagline, address, phone, hours, services and prices, booking link, Instagram handle, accent colour, polish `colours`, gallery `photos` and `heroVideo`. This is the only file you need to change.
   - Leave `bookingLink` empty and the Book Now buttons will call the phone number.
   - Set `demoBanner` to `""` to remove the "sample design" banner for a real site.
   - **Colours:** `colours` is the swatch row for the "pick your colour" hand (`{ name, hex }`).
   - **Photos:** put images in the `media/` folder and list them in `photos` (`"nails-1.jpg"` or `{ src, alt }`). Empty means soft gradient placeholders.
   - **Hero video:** put a short muted loop in `media/` and set `heroVideo: "hero.mp4"` (optional `heroPoster`). Empty means the animated polish-bottle illustration. It falls back to the illustration if the video can't play or the visitor prefers reduced motion.
3. Open `index.html` in a browser to preview.

## Publish with GitHub Pages

1. Push your changes to GitHub.
2. In the repo go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select your main branch and the `/ (root)` folder, then **Save**.
4. After a minute your site is live at `https://<your-username>.github.io/<repo-name>/`.

Note: `index.html` includes `<meta name="robots" content="noindex">` so demos stay out of Google. Remove that line when launching a real site.
