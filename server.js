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

app.get("/map", (req, res) => {
    if (!latestCoords) {
        return res.send(`<h2>موقعیتی ثبت نشده</h2>`);
    }

    res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>موقعیت روی نقشه</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
      <style>body{direction:rtl;font-family:sans-serif}#map{height:90vh}</style>
    </head>
    <body>
      <h3>آخرین موقعیت:</h3>
      <ul>
        <li>عرض: ${latestCoords.lat}</li>
        <li>طول: ${latestCoords.lon}</li>
        <li>دقت: ${latestCoords.accuracy} متر</li>
        <li>زمان: ${latestCoords.time}</li>
      </ul>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
      <script>
        const map = L.map('map').setView([${latestCoords.lat}, ${latestCoords.lon}], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker([${latestCoords.lat}, ${latestCoords.lon}]).addTo(map).bindPopup("دقت: ${latestCoords.accuracy} متر").openPopup();
      </script>
    </body>
    </html>
  `);
});

app.get("/", (req, res) => {
    res.redirect("/map");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});
