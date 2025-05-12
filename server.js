const express = require("express");
const app = express();
const path = require("path");

let latestCoords = null;

app.use(express.static("public"));
app.use(express.json());

app.post("/loc", (req, res) => {
  latestCoords = {
    lat: req.body.lat,
    lon: req.body.lon,
    accuracy: req.body.accuracy,
    time: new Date().toLocaleString()
  };
  res.sendStatus(200);
});

app.get("/coords", (req, res) => {
  if (!latestCoords) return res.json({ status: "no-data" });
  res.json(latestCoords);
});

app.get("/", (req, res) => {
  res.redirect("/map.html");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
