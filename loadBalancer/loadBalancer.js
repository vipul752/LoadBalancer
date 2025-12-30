const express = require("express");
const http = require("http");

const app = express();
const PORT = 8080;

const BACKEND_HOST = process.env.BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.BACKEND_PORT || 3000;

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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1a2d4d 100%);
          color: #e5e7eb;
          min-height: 100vh;
          padding: 20px;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px 0;
        }

        .header h1 {
          font-size: 2.5em;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }

        .header p {
          color: #9ca3af;
          font-size: 1.1em;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .metric-card {
          background: rgba(17, 24, 39, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.2);
          padding: 25px;
          border-radius: 12px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .metric-card:hover {
          border-color: rgba(59, 130, 246, 0.5);
          background: rgba(17, 24, 39, 1);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.1);
        }

        .metric-label {
          font-size: 0.9em;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .metric-value {
          font-size: 2.5em;
          font-weight: bold;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .metric-icon {
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5em;
        }

        .icon-requests { background: rgba(59, 130, 246, 0.1); }
        .icon-active { background: rgba(34, 197, 94, 0.1); }
        .icon-errors { background: rgba(239, 68, 68, 0.1); }
        .icon-response { background: rgba(168, 85, 247, 0.1); }

        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 0.9em;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .status-badge {
          display: inline-block;
          background: #22c55e;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85em;
          margin-top: 15px;
          font-weight: 600;
        }

        @media (max-width: 600px) {
          .header h1 { font-size: 1.8em; }
          .metrics-grid { grid-template-columns: 1fr; }
          .metric-value { font-size: 2em; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚖️ Load Balancer Dashboard</h1>
          <p>Real-time Metrics & Performance Monitoring</p>
        </div>

        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon icon-requests">📊</div>
            <div class="metric-label">Total Requests</div>
            <div class="metric-value" id="total">0</div>
          </div>

          <div class="metric-card">
            <div class="metric-icon icon-active">🔄</div>
            <div class="metric-label">Active Requests</div>
            <div class="metric-value" id="active">0</div>
          </div>

          <div class="metric-card">
            <div class="metric-icon icon-errors">❌</div>
            <div class="metric-label">Total Errors</div>
            <div class="metric-value" id="errors">0</div>
          </div>

          <div class="metric-card">
            <div class="metric-icon icon-response">⚡</div>
            <div class="metric-label">Avg Response Time (ms)</div>
            <div class="metric-value" id="avg">0</div>
          </div>
        </div>

        <div style="text-align: center;">
          <span class="status-badge">✓ Live Updating</span>
        </div>

        <div class="footer">
          <p>Updates every second • Last updated: <span id="timestamp">--:--:--</span></p>
        </div>
      </div>

      <script>
        async function fetchMetrics() {
          try {
            const res = await fetch('/metrics');
            const data = await res.json();
            document.getElementById('total').innerText = data.totalRequests.toLocaleString();
            document.getElementById('active').innerText = data.activeRequests;
            document.getElementById('errors').innerText = data.totalErrors;
            document.getElementById('avg').innerText = data.averageResponseTimeMs;
            
            const now = new Date();
            document.getElementById('timestamp').innerText = now.toLocaleTimeString();
          } catch (error) {
            console.error('Failed to fetch metrics:', error);
          }
        }
        
        setInterval(fetchMetrics, 1000);
        fetchMetrics();
      </script>
    </body>
    </html>
  `);
});

app.use((req, res,next) => {
  if (req.path === "/metrics" || req.path === "/dashboard") {
    return next();
  }
  const start = Date.now();
  totalRequests++;
  activeRequests++;

  const options = {
    hostname: BACKEND_HOST,
    port: BACKEND_PORT,
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
