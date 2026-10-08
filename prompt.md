# User Prompts Compilation

This document archives all prompt instructions submitted to this project in sequence.

---

## Prompt 1: Initial Build & Master Prompt

### User Brief
```
please build the website base from the masterprompt.md, the design of the website must be loud and bold
```

### Business Model Canvas (Pre and Post Exercise Nutrition & ActiveSG Booking)

```csv
"Key propositions"
"How will you make your customers' life happier?"
"Healthy food at fingertips, without the hassle of meal prepping alone"
"convenient vending machine collection option near activesg venues and at gyms"
"Calculating your daily nutritional needs based on fitness tracker and stats (age, weight, goals), then help recommend the meals that would fit in macros"
"users can now book all sports activities within this one app"
"users can pre-set their booking of courts and activities filed"

"Key partners"
"What are your key partners to get competitive advantage?"
"SFA"
"Board certified nutritionists"
"Singapore Health Promotion Board (HPB)"
"central kitchens"
"Onemap"
"delivery partner"
"central kitchen/ cloud kitchen"

"Customer segments"
"Who are your customers? Describe your target audience in a couple of words."
"people who wants to eat healthy"
"People who are endevouring to live healthier lifestyles and people who exercise"
"people who just exercised"
"seniors citizens"

"Customer relationships"
"How often will you interact with your customers?"
"daily interactions"
"monthly summary"
"email voucher/ codes for discounts"
"app notifications"
"referrals links"

"Key activities"
"What are the key steps to move ahead to your customers?"
"Free samples of food products for 1st downloads"
"users take photo of the meal so that the app can be abke to generate the nutrition values"
"to help the users to have an overview booking platform for all sports related activities"
"allow for autobooking bots"
"users are able to select post meals that are beneficial to their recovery"

"Key resources"
"What resources do you need to make your idea work?"
"Vending machines company"
"logistic"
"Nutritionist"

"Channels"
"How are you going to reach your customers?"
"instagram, facebook, tiktok,xhs"
"Gym provider"
"sports singapore, banners atsports stadiums"

"Revenue Streams"
"How much are you planning to earn in a certain period? Compare your costs and revenues."
"message therapist commission cut"
"commission cuts for using bots within the app for booking"
"grant fundings from SGsports (startup funds)"
"monthly subscription at S$1000/month (your health is your true value)"
"commission cut from cloud kitchens"

"Cost Structure"
"How much are you planning to spend on the product development and marketing for a certain period?"
"logistic $3000"
"playstore commission cut"
"$10,000 marketing (social media advertisement, print ads, etc)"
"hosting server (cloudflare $10.47/yr)"

"Meals that are nutritionally balanced and help to build healthy lifestyle, encouraging people to pick healthier options for recovery. Nutritionist designed plans. Vending machine sales hot/cold option to take home."
```

### Full Master Prompt Specification

```markdown
MASTER PROMPT · pre and post exercise food nutrition app · replace the dead MCP server with a real one inside the app
Paste into the chat panel of the food-nutrition project in Google AI Studio (Build mode) base on the excel file in the attachement

ROLE: You are a senior full-stack developer working in this existing Vite + React project, NutriSafe ToxiScan. It already has server.ts, which the AI Studio preview runs, and an api/ folder at the project root, which Vercel runs.

GOAL: Replace the offline remote MCP server with a real MCP server inside this app at /api/mcp that serves the bundled demo dataset, and make every screen get its data through that server and say plainly where the data comes from.

OUTPUT:
 1) Add @modelcontextprotocol/sdk at exactly version 1.30.1 and zod at ^4.6.5, and raise the esbuild devDependency to ^0.27.0, which Vite 8 needs. Do not use mcp-handler or @modelcontextprotocol/server: they are built for Web Request handlers, and this app needs one (req, res) handler that both Express and Vercel run. Keep bun.lock as the only lockfile; never add package-lock.json.
 2) Move api/mcp-engine.js and api/ingredients-data.js into api/_lib/ and update every import, including the ones in src/. Vercel turns every file in api/ into a public address unless its folder or file name starts with an underscore.
 3) In api/_lib/mcp-engine.js and api/_lib/ingredients-data.js, make the data say only what is true and make every lookup return null unless exactly one record fits:
    Data: delete the function synthesizeDynamicDossier. Replace every dietary.traceability line such as "ISO-22000 Cert #992-01 · Verified Pure" with "Demo record: no batch or certification data", and every pesticide gauge text that claims a test was run ("Purity Verified", "Chemical Assay Clean", "Ultra-Pure Profile") with a plain status such as "Within demo limits" or "Above demo limit".
    Additive names: each additive answers to its name and chemical name, each with and without any "(...)" part, the text inside the brackets on its own ("MSG", "Vitamin C", "Ace-K", "BHA"), and the singular of a plural name of six letters or more ("lecithins" also gives "lecithin"); ignore names shorter than three letters. Add these label spellings: palm oil and palm fat for INGR-PALM; partially hydrogenated, hydrogenated vegetable oil, hydrogenated soybean oil and trans fat for INGR-TRANSFAT; mono- and diglycerides, mono and diglycerides and monoglycerides for E471; caramel color and caramel colour for E150d; lecithin, soy lecithin and sunflower lecithin for E322; hfcs and glucose-fructose syrup for INGR-HFCS. Never match on the first word of a name.
    checkAdditive, in this order: an E-number typed alone or found as a whole word, after turning "E 211" and "E-211" into "E211"; an exact CAS number; an exact name; the longest name found in the query as whole words; a part of a name of four letters or more that fits exactly one additive. Return null when the query names two different additives, by E-number or by name, or when two additives tie.
    scanIngredientList: flag an additive only when a whole-word E-number (normalised as above) or one of its names appears in the list, and make every keyword check for combinations, banned notes, allergens and dietary flags a whole-word check, so "eggplant" never raises an egg warning.
    checkNutrition: an exact English or Hebrew name, then a query that contains a full name, then a start-of-word part of three letters or more that fits one food only.
    checkPesticideMrl: a pesticide named as a whole word, or its exact CAS number, wins over a crop. Compare crops in singular form on both sides (tomatoes to tomato, strawberries to strawberry, apples to apple). A crop answers only when the query names nothing but crops and exactly one pesticide lists that crop; "mancozeb wheat" and "wheat" return null.
    searchAdditives: treat colour/color, flavour/flavor, sulphite/sulfite and sulphur/sulfur as the same word in both query and category; category "banned" means E171, E924a and any additive whose risk level says BANNED.
 4) Create api/_lib/mcp-server.js exporting MCP_PATH ("/api/mcp"), SERVER_INFO ({ name: "nutrisafe-food-mcp", title: "NutriSafe Food Safety MCP (demo dataset)", version: "3.0.0" }), DATASET (the three record counts and the demo sentence below) and async function mcpHandler(req, res):
    First, for every method: if an Origin header is present and its host is neither the request's Host nor the first entry of X-Forwarded-Host, answer 403 with a JSON-RPC error.
    On GET without "text/event-stream" in the Accept header: answer 200 with JSON describing the server: SERVER_INFO, the five tool names, DATASET and how to connect.
    On any other method except POST: answer 405 with an Allow: POST, GET header and {"jsonrpc":"2.0","error":{"code":-32000,"message":"Method not allowed. Send MCP messages with POST."},"id":null}.
    On POST: read req.body inside try, because on Vercel reading it throws when the JSON is malformed; if it throws, answer 400 with code -32700. Then create new McpServer(SERVER_INFO, { instructions: the demo sentence }), register the tools below, create new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true }), await server.connect(transport), then await transport.handleRequest(req, res, body). When res closes, close the transport and the server. Build both fresh on every request; this server keeps no sessions.
 5) Register five tools with server.registerTool. Keep these exact names and inputs, because the screens already call them:
    check_additive { query }, check_ingredient_list { ingredients }, search_additives { query?, category? }, check_nutrition { query }, check_pesticide_mrl { query }.
    Every title ends with "(demo dataset)". Every description is two to four sentences: what comes back, that it is read from the demo dataset bundled with this app, when an agent should use it, and one thing it does not cover.
    Every input is z.string().trim().min(1).max(200) with .describe() saying exactly what it accepts; ingredients allows 4000 characters; search_additives' query (200) and category (100) are optional.
    Every tool has annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }.
    When found, return { content: [{ type: "text", text: JSON.stringify(payload) }], structuredContent: payload }, where payload is { found: true, dataset: "demo", source: "NutriSafe demo dataset bundled with this app", result }.
    When nothing single matches, return { isError: true, content: [{ type: "text", text: one sentence naming the dataset size and what was not found }, { type: "text", text: JSON.stringify(payload) }], structuredContent: payload }, where payload is { found: false, dataset: "demo", source: the same string, message: the same sentence }. search_additives is the exception: an empty list is a valid answer and comes back found: true with result [].
    A tool never returns a stand-in record.
 6) Make api/mcp.js one line: export { mcpHandler as default } from './_lib/mcp-server.js'. In server.ts, add app.use('/api', express.json({ limit: '1mb' })), then app.all(['/api/mcp', '/api'], mcpHandler), importing it rather than copying it, above app.use(vite.middlewares) and above any catch-all route. Add an Express error handler for /api that turns a JSON parse failure into 400 with code -32700 and any other body error into 400 with code -32600, both as JSON-RPC, never as an HTML page. Make api/health.js and the /api/health route in server.ts report MCP_PATH, SERVER_INFO and DATASET. Delete the old proxy code, the workers.dev address everywhere, MCP_SERVER_KEY and the fixed "mcp_latency_ms: 142".
 7) Rewrite src/services/mcpClient.ts as a real MCP client for /api/mcp. It sends initialize with protocolVersion "2025-11-25", then notifications/initialized (the server answers 202 with no body), then tools/call. Every request carries Accept "application/json, text/event-stream", and every request after initialize carries the MCP-Protocol-Version header the server returned. Give every request a 15-second timeout. Export callMcp(tool, args), which resolves to { data, rawPayload, latency } with latency measured in the browser; McpNotFoundError, thrown when the reply has isError with found: false; describeMcpError(err), a sentence for the screen; and useMcpStatus(), a hook built on useSyncExternalStore whose value changes after every call, so the status shows "offline" as soon as a call times out, drops or gets a 5xx.
 8) On every screen: delete each catch block that falls back to bundled data, and show the error or "no match" sentence instead. A view that shows a first result loads it through callMcp when it opens and shows a loading card meanwhile; it never displays a bundled record the server did not return for the current query. The E-Number Directory's first list comes from search_additives. Show only measured latency, with "--" before the first call and while offline. Replace "MCP Connected: JECFA / EFSA / IL-MoH DB Live v4.2", "ISO 17025 Data Verified", "Synchronized codices", the SHA-256 "assay hash", "4,624 foods" and the workers.dev address with the live status from useMcpStatus(), the real dataset counts, and this sentence: "Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources." Relabel "Sync Codices" as "Refresh from MCP" and make it re-run check_additive. The MCP Inspector pop-up shows only real replies from the server. Give the ingredient scanner its own tab; send the "Scan Ingredients Cocktail" suggestion and any search with two or more ", " separators there, but never a chemical name such as "2,4-Hexadienoic Acid", whose commas sit between digits. Send the Glyphosate and Chlorpyrifos suggestions to the Pesticide MRL tab and the hummus suggestion to the Nutrition tab, with the query filled in.

GUARDRAILS: Read-only tools only: nothing that writes, sends, deletes or spends. No database and no login. Never create a variable whose name starts with VITE_. This server needs no API key; remove MCP_SERVER_KEY from the code and the docs. Keep the existing layout and styling, and keep every existing screen working.

CONTEXT: Deployed on Vercel from GitHub; Vercel installs packages with bun because bun.lock is in the repository, and would switch to npm if a package-lock.json appeared. The old server at https://food-mcp-server.rootsbybenda.workers.dev/mcp is offline (Cloudflare error 1042) and must not be called. MCP clients such as Claude Code, the MCP Inspector 2.8.0 and the Gemini SDK's mcpToTool will connect to https://{domain}/api/mcp over Streamable HTTP, protocol 2025-11-25.
```

---

## Prompt 2: GitHub Push Request

```bash
git push https://[REDACTED_GITHUB_TOKEN]@github.com/ericramalie/team6-project.git
```

---

## Prompt 3: Asset Updates & Health Verification

```
1) create a prompt.md containing all my prompts located at project.main
2) replace all image attachment with relevant images from this website https://www.istockphoto.com/
3) create api/health.js located at project.main
```

---

## Prompt 4: Main Objective Highlighting

```
the main objective is the food delivery to vending machine at all exercise venue and gym, put that objective in main page
```

---

## Prompt 5: NutriBalance Upstream API Key

```
create NUTRITION_API_KEY to connect to NutriBalance/nutribalance-mcp server
```


