const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const app = next({ dev, hostname });
const handle = app.getRequestHandler();

const PORT_OWNER = 3002;
const PORT_PUBLIC = 3003;

app.prepare().then(() => {
  // 1. Owner Portal Server (Listening on Port 3002)
  const ownerServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      req.headers.host = `localhost:${PORT_OWNER}`;
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Owner Portal server error:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  ownerServer.listen(PORT_OWNER, (err) => {
    if (err) throw err;
    console.log(`\n================================================================`);
    console.log(`✓ [OWNER PORTAL] Private dashboard live at http://localhost:${PORT_OWNER}`);
    console.log(`  Access restricted to private store management.`);
  });

  // 2. Public Storefront Website (Listening on Port 3003)
  const publicServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      req.headers.host = `localhost:${PORT_PUBLIC}`;
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Public Website server error:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  publicServer.listen(PORT_PUBLIC, (err) => {
    if (err) throw err;
    console.log(`✓ [PUBLIC WEBSITE] Customer storefront live at http://localhost:${PORT_PUBLIC}`);
    console.log(`  Owner portal hidden from public view.`);
    console.log(`✓ [PORT ALLOCATION PRESERVED]`);
    console.log(`  - Port 3002: AURA Owner Portal`);
    console.log(`  - Port 3003: AURA Public Website`);
    console.log(`================================================================\n`);
  });
});
