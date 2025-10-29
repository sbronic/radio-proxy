import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/stream", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing url param");

  try {
    const response = await fetch(target);
    if (!response.ok) throw new Error("Stream not reachable");

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "audio/mpeg"
    );
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

app.get("/", (req, res) => res.send("OK"));
app.get("/health", (req, res) => res.send("alive"));

