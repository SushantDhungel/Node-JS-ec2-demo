const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const notes = [{ id: 1, text: "Hello from EC2!" }];

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Node on EC2</title></head>
      <body style="font-family: sans-serif; max-width: 600px; margin: 60px auto;">
        <h1>Node.js is running on AWS EC2!</h1>
        <p><b>Hostname:</b> ${os.hostname()}</p>
        <p><b>Node version:</b> ${process.version}</p>
        <p><b>Uptime:</b> ${Math.floor(process.uptime())} seconds</p>
        <p>Try: <a href="/health">/health</a> | <a href="/api/info">/api/info</a> | <a href="/api/notes">/api/notes</a></p>
      </body>
    </html>
  `);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/info", (req, res) => {
  res.json({
    hostname: os.hostname(),
    platform: os.platform(),
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
    memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
  });
});

app.get("/api/notes", (req, res) => res.json(notes));

app.post("/api/notes", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text is required" });
  const note = { id: notes.length + 1, text };
  notes.push(note);
  res.status(201).json(note);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});