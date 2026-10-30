# Diwali Wishes 2026 – Spread the Light 🪔

A free, mobile-first personalized Diwali greeting website. Visitors enter their name, create a greeting, and share it through WhatsApp. Each shared link can show who passed the greeting along.

## Features

- Personalized greeting with the visitor's name
- Sender name passed in the URL (`?from=Name`)
- WhatsApp click-to-share (user chooses recipients and confirms sending)
- Copy greeting button
- Animated diya, golden festive styling, and lightweight fireworks
- No login, database, paid API, or build process
- GitHub Pages compatible

## Run locally

Open `index.html` in a modern browser. For best results, use a local static server or GitHub Pages because clipboard access generally requires HTTPS.

## Publish free with GitHub Pages

1. Create a new public GitHub repository, for example `diwali-wishes-2026`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then Save.
6. Wait for GitHub Pages to publish the site. Your URL will look like:
   `https://YOUR-USERNAME.github.io/diwali-wishes-2026/`
7. Open the published link on your phone and test creating and sharing a greeting.

## How the sharing chain works

A visitor enters a name and the app creates a WhatsApp message containing a link such as:

`https://YOUR-USERNAME.github.io/diwali-wishes-2026/?from=Anita`

The next visitor sees “A little Diwali light comes to you from Anita,” enters their own name, and shares a new link with their name. The website itself stays the same; no new page needs to be created for each person.

## Important WhatsApp behavior

The app opens WhatsApp with a pre-filled message. The sender must choose a contact/group and press Send. WhatsApp does not allow a website to silently message or automatically forward content to contacts.

## Customize

- Change the year and greeting copy in `index.html` and `script.js`.
- Change colors, fonts, and layout in `style.css`.
- Update the Open Graph title and description in the `<head>` of `index.html`.
- Google Fonts are used for typography; the page still works with fallback fonts if Google Fonts are unavailable.

## Privacy

Names are processed in the visitor's browser and included in the shared URL/message. This starter project does not send names to a server or store a visitor database.
