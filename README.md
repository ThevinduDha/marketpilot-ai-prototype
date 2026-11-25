# MarketPilot AI

MarketPilot AI is a clickable React prototype for an academic AI Economy presentation. It illustrates how a seller could turn product photos and costs into marketplace research, pricing recommendations, and seller-approved listings.

## Run locally

Use Node.js 18 or later and npm.

```sh
npm install
npm run dev
```

Open the local URL Vite prints. Start at the public landing page or open /dashboard for the seller workspace. /sign-in offers a demo-only entry point with read-only example fields.

```sh
npm run build
npm run preview
```

The production bundle is written to dist/. Configure a static host to serve index.html for client-side routes if you choose to host the prototype.

## Phase 1

- Public landing page with a dashboard preview and demonstration entry points
- Demo sign-in
- Seller overview with charts, activity, recommendations, and connection status
- Searchable and filterable product catalog with grid and table views, product details, and local draft creation
- Clearly labeled preview screens for later phases

## Phase 2

- Five-step product wizard with local image previews, primary image selection, and a prefilled mahogany elephant sample
- Product detail pages and a timed simulated analysis with editable suggestions
- Product-specific handoff to the later-phase marketplace research preview

All AI output, marketplace connections, and financial figures are fictional. Drafts and any selected product photos live in memory for the current browser session and reset on reload. The original demo catalog photography was generated for this prototype.


## Product photography

The local asset at public/catalog-photos.jpg is a contact sheet generated with the built-in image generation tool.

**Generation prompt**

Create a square 2 by 2 contact sheet for a premium online seller dashboard, each of its four perfect equal square quadrants an independent, photorealistic product catalogue photo, with no gaps or written text. Top left: hand-carved dark warm walnut wooden elephant sculpture, on a sand-colored tabletop with gently warm beige backdrop. Top right: handmade fine gold necklace with small oval amber pendant on textured pale oatmeal linen, overhead flat lay. Bottom left: one rounded matte muted slate-blue ceramic vase on a pale cool stone pedestal with a soft gray blue background. Bottom right: collectible vintage silver and black film camera on muted tan canvas, angled three quarters. Authentic physical textures, editorial studio light, distinct products centered entirely within their own tile with ample margins, macro details and restrained color grading. Exactly four equal quadrants, boundaries at the horizontal and vertical 50% marks. No borders, mosaic gaps, lettering, marks, logos, labels or watermarks.