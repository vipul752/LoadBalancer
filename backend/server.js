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
          padding: 20px;
          background: white;
        }
        .card {
          border: 1px solid #ddd;
          padding: 20px;
          max-width: 400px;
        }
        .info {
          margin-bottom: 10px;
        }
        button {
          margin-top: 15px;
          padding: 10px 15px;
          background: #007bff;
          color: white;
          border: 1px solid #0056b3;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="info">Container: <b>${process.env.HOSTNAME}</b></div>
        <div class="info">Backend Port: <b>${PORT}</b></div>
        <button onclick="window.location.href='/dashboard'">
          View Load Balancer Dashboard
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
