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
- Product-specific handoff from AI analysis to marketplace research

## Phase 3

- Searchable fictional marketplace listings with filters, sorting, and side-by-side comparison
- Market intelligence for the wooden-elephant sample, including asking prices, feedback, demand, and quality cues
- Editable Etsy and eBay pricing scenarios with illustrative fees and an in-memory handoff to Listings

All AI output, marketplace connections, and financial figures are fictional. Drafts, local product photos, and pricing selections live in memory for the current browser session and reset on reload. The original demo catalog photography was generated for this prototype.


## Product photography

The local asset at public/catalog-photos.jpg is a contact sheet generated with the built-in image generation tool.

**Generation prompt**

Create a square 2 by 2 contact sheet for a premium online seller dashboard, each of its four perfect equal square quadrants an independent, photorealistic product catalogue photo, with no gaps or written text. Top left: hand-carved dark warm walnut wooden elephant sculpture, on a sand-colored tabletop with gently warm beige backdrop. Top right: handmade fine gold necklace with small oval amber pendant on textured pale oatmeal linen, overhead flat lay. Bottom left: one rounded matte muted slate-blue ceramic vase on a pale cool stone pedestal with a soft gray blue background. Bottom right: collectible vintage silver and black film camera on muted tan canvas, angled three quarters. Authentic physical textures, editorial studio light, distinct products centered entirely within their own tile with ample margins, macro details and restrained color grading. Exactly four equal quadrants, boundaries at the horizontal and vertical 50% marks. No borders, mosaic gaps, lettering, marks, logos, labels or watermarks.

## Comparable product photography

The local photos in public/comparables were generated with the built-in image generation tool as one contact sheet and saved as eight separate JPEGs.

**Generation prompt**

Create one landscape 3:2 contact sheet arranged in a precise 4-column by 2-row grid, eight perfectly equal independent tiles with hard boundaries, no gaps, borders, text, or logos. Each tile is an original realistic premium e-commerce product photograph showing an entirely different small carved wooden elephant figurine, centered with ample margin on an unobtrusive studio tabletop, with no elements spanning tile boundaries. Left to right top row: honey-brown teak elephant with lifted trunk on pale sand, dark mahogany elephant with engraved ears on pink-beige, blonde mango wood modern elephant on warm white, walnut elephant with rounded form on gray-beige. Left to right bottom row: light tan rubberwood elephant on pale sage, dark rosewood elephant with lowered trunk on muted clay, caramel acacia elephant with distinct woodgrain on oatmeal, small reddish suar wood elephant on cool beige. Natural soft side lighting, real grain and hand-carved details, varied profiles and camera angles, consistent editorial catalog style. Use recognizable elephant silhouettes and exactly eight portraits within this single grid. No lettering, price labels, or watermark.
