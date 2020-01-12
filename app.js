const express = require("express");
const app = express();
const views = require("./lib/views.json");
const googleAnalytics = require("./lib/googleAnalytics");
const googleAds = require("./lib/googleAds");
const dotenv = require("dotenv");
const storage = require("./lib/cloudStorage");

dotenv.config();
app.set("port", process.env.PORT || 3000);

views.forEach(view => {
  googleAnalytics(view.name, view.id);
});

views.forEach(view => {
  googleAds(view.name, view.id);
});

app.listen(app.get("port"), () => {
  console.log(
    `Listening on port ${app.get("port")}; Press Ctrl + C to terminate`
  );
});
