# MarketPilot AI

MarketPilot AI is a clickable seller workspace for an academic AI Economy presentation. A seller can take a handmade product from photographs and production costs through marketplace comparison, pricing, listing approval, and simulated publication.

## Prototype objectives

- Show how sellers can inspect the evidence behind a suggested price and see the effect on estimated profit.
- Keep seller-provided facts distinct from simulated AI suggestions, including materials that need confirmation.
- Give the seller control over listing text, prices, and the marketplaces that receive each approved demo listing.

## Run locally

Tested with Node.js 22.18 and npm. Run these commands from the project directory in Windows PowerShell.

```powershell
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open [MarketPilot AI locally](http://127.0.0.1:5173/). Choose **Try Demo** or **Get Started** to enter the dashboard. The optional demo sign-in uses read-only example fields. No credentials or environment variables are needed. Use Ctrl+C in the terminal to stop the server. On macOS or Linux, use `npm` in place of `npm.cmd`.

Use these commands to type-check, build, and inspect the production version.

```powershell
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Open the [local production preview](http://127.0.0.1:4173/). Vite writes the build to `dist/`.

## Completed screens

| Area | Screens and interactions |
| --- | --- |
| Public entry | Landing page with dashboard preview and demo sign-in |
| Seller workspace | Overview with revenue range selection, distribution, product links, activity, recommendations, and connection status |
| Product catalog | Searchable grid and table, filters, product details, and a five-step wizard with local photo previews and sample data |
| Product intelligence | Simulated analysis progress, editable suggestions, and seller material confirmation |
| Market research | Search, marketplace filters, price sorting, side-by-side competitor comparison, and market intelligence |
| Pricing Studio | Competitive, balanced, and premium strategies, editable marketplace prices, illustrative fees, break-even, profit, and margin |
| Listing workflow | Etsy and eBay editors with previews, draft saving, final review, seller approval, simulated publishing, and success receipts |
| Workspace management | My Listings with view, edit, pause, and resume, plus analytics, demo integrations, settings, and help |

## Demonstration workflow

1. Open **Add Product** and choose **Use Sample Product**. Review the mahogany elephant's photo, dimensions, costs, stock, and marketplaces.
2. Choose **Analyze Product**. Review the suggestions and select **Find Similar Products**. Compare up to three fictional listings with the seller's product.
3. Open **View Market Intelligence**, then **Get Pricing Recommendations**. Choose a strategy or edit a price to see the estimated profit change.
4. Choose **Generate Listings**. Review the Etsy and eBay drafts, edit the copy, then choose **Review Final Listings**.
5. Select the marketplaces, choose **Confirm and Publish**, and approve the simulation. **View My Listings** shows the resulting demo records with their approved prices.

**Restart Demo** in the workspace sidebar restores the initial catalog and settings after confirmation. On tablet and mobile, open the navigation menu to find it. See [the four-minute presenter guide](DEMO_GUIDE.md) for a timed walkthrough.

## Technology

React 18 and TypeScript, Vite, Tailwind CSS and component styles, local Inter fonts, Lucide React icons, React Router, Recharts, and React state and context. Product and comparable photographs ship with the project.

## Current limitations

- All AI suggestions, demand signals, feedback, sales, revenue, and marketplace operations are fictional. The research dataset contains eight wooden-elephant examples and stays the same for other products.
- The comparison uses asking prices. Pricing uses simple per-unit arithmetic and illustrative marketplace fees. It cannot confirm completed sales, material, craftsmanship, or durability.
- Navigation preserves work within the current tab. Reloading, closing the tab, or confirming Restart Demo clears edits, uploads, pricing plans, connection settings, and demo publications.
- Publishing creates local demonstration IDs. There is no backend, authentication, external account connection, or live listing. Analytics trends illustrate a sample period and do not accumulate real sales.

## Product photography

The local asset at public/catalog-photos.jpg is a contact sheet generated with the built-in image generation tool.

**Generation prompt**

Create a square 2 by 2 contact sheet for a premium online seller dashboard, each of its four perfect equal square quadrants an independent, photorealistic product catalogue photo, with no gaps or written text. Top left: hand-carved dark warm walnut wooden elephant sculpture, on a sand-colored tabletop with gently warm beige backdrop. Top right: handmade fine gold necklace with small oval amber pendant on textured pale oatmeal linen, overhead flat lay. Bottom left: one rounded matte muted slate-blue ceramic vase on a pale cool stone pedestal with a soft gray blue background. Bottom right: collectible vintage silver and black film camera on muted tan canvas, angled three quarters. Authentic physical textures, editorial studio light, distinct products centered entirely within their own tile with ample margins, macro details and restrained color grading. Exactly four equal quadrants, boundaries at the horizontal and vertical 50% marks. No borders, mosaic gaps, lettering, marks, logos, labels or watermarks.

## Comparable product photography

The local photos in public/comparables were generated with the built-in image generation tool as one contact sheet and saved as eight separate JPEGs.

**Generation prompt**

Create one landscape 3:2 contact sheet arranged in a precise 4-column by 2-row grid, eight perfectly equal independent tiles with hard boundaries, no gaps, borders, text, or logos. Each tile is an original realistic premium e-commerce product photograph showing an entirely different small carved wooden elephant figurine, centered with ample margin on an unobtrusive studio tabletop, with no elements spanning tile boundaries. Left to right top row: honey-brown teak elephant with lifted trunk on pale sand, dark mahogany elephant with engraved ears on pink-beige, blonde mango wood modern elephant on warm white, walnut elephant with rounded form on gray-beige. Left to right bottom row: light tan rubberwood elephant on pale sage, dark rosewood elephant with lowered trunk on muted clay, caramel acacia elephant with distinct woodgrain on oatmeal, small reddish suar wood elephant on cool beige. Natural soft side lighting, real grain and hand-carved details, varied profiles and camera angles, consistent editorial catalog style. Use recognizable elephant silhouettes and exactly eight portraits within this single grid. No lettering, price labels, or watermark.
