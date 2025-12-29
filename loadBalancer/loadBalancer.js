const express = require("express");
const http = require("http");

const app = express();
const PORT = 8080;

const BACKEND_HOST = "backend";
const BACKEND_PORT = 3000;

let totalRequests = 0;
let activeRequests = 0;
let totalErrors = 0;
let totalResponseTime = 0;

app.get("/metrics", (req, res) => {
  const avgResponseTime =
    totalRequests === 0 ? 0 : (totalResponseTime / totalRequests).toFixed(2);

  res.json({
    totalRequests,
    activeRequests,
    totalErrors,
    averageResponseTimeMs: avgResponseTime,
  });
});

app.get("/dashboard", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Load Balancer Metrics</title>
      <style>
        body { font-family: Arial; background: #0f172a; color: #e5e7eb; }
        .card {
          background: #111827;
          padding: 20px;
          border-radius: 10px;
          width: 300px;
          margin: 50px auto;
          box-shadow: 0 0 20px rgba(0,0,0,0.4);
        }
        h2 { text-align: center; }
        p { font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Load Balancer Metrics</h2>
        <p>Total Requests: <span id="total"></span></p>
        <p>Active Requests: <span id="active"></span></p>
        <p>Total Errors: <span id="errors"></span></p>
        <p>Avg Response Time (ms): <span id="avg"></span></p>
      </div>

      <script>
        async function fetchMetrics() {
          const res = await fetch('/metrics');
          const data = await res.json();
          document.getElementById('total').innerText = data.totalRequests;
          document.getElementById('active').innerText = data.activeRequests;
          document.getElementById('errors').innerText = data.totalErrors;
          document.getElementById('avg').innerText = data.averageResponseTimeMs;
        }
        setInterval(fetchMetrics, 1000);
        fetchMetrics();
      </script>
    </body>
    </html>
  `);
});

app.use((req, res) => {
  const start = Date.now();
  totalRequests++;
  activeRequests++;

  const options = {
    hostname: "backend",
    port: 3000,
    path: req.originalUrl,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);

    proxyRes.on("end", () => {
      activeRequests--;
      totalResponseTime += Date.now() - start;
    });
  });

  proxyReq.on("error", (err) => {
    totalErrors++;
    activeRequests--;
    res.status(502).send("Bad Gateway");
  });

  req.pipe(proxyReq);
});

app.listen(PORT, () => {
  console.log(`Load Balancer running on port ${PORT}`);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
