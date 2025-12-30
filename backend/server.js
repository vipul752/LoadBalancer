const express = require("express");
const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

app.get("/", (req, res) => {
  res.send(`Handled by container: ${process.env.HOSTNAME}`);
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
