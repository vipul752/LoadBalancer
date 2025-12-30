const express = require("express");
const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Backend Server</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #0f172a;
          color: #e5e7eb;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .card {
          background: #111827;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        .info {
          font-size: 18px;
          margin-bottom: 10px;
        }
        button {
          margin-top: 20px;
          padding: 12px 20px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
        }
        button:hover {
          opacity: 0.9;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="info">🖥️ Container: <b>${process.env.HOSTNAME}</b></div>
        <div class="info">⚙️ Process ID: <b>${process.pid}</b></div>

        <button onclick="window.location.href='/dashboard'">
          📊 View Load Balancer Dashboard
        </button>
      </div>
    </body>
    </html>
  `);
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
