# salon-site-template

A lightweight one-page website template for nail salons. Plain HTML, CSS and a little JavaScript — no build step.

## Make a new salon's site

1. Copy this repo (use **Use this template**, or fork/copy it) for the new salon.
2. Open `salon.js` and edit the `SALON` object: name, tagline, address, phone, hours, services and prices, booking link, Instagram handle, and accent colour. This is the only file you need to change.
   - Leave `bookingLink` empty and the Book Now buttons will call the phone number.
   - Set `demoBanner` to `""` to remove the "sample design" banner for a real site.
3. Open `index.html` in a browser to preview.

## Publish with GitHub Pages

1. Push your changes to GitHub.
2. In the repo go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select your main branch and the `/ (root)` folder, then **Save**.
4. After a minute your site is live at `https://<your-username>.github.io/<repo-name>/`.

Note: `index.html` includes `<meta name="robots" content="noindex">` so demos stay out of Google. Remove that line when launching a real site.
