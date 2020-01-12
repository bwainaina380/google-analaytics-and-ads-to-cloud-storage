const express = require("express");
const app = express();
const views = require("./lib/views.json");
const googleAnalytics = require("./lib/googleAnalytics");
const googleAds = require("./lib/googleAds");
const dotenv = require("dotenv");
const uploadFile = require("./lib/cloudStorage");

dotenv.config();
app.set("port", process.env.PORT || 3000);

views.forEach(view => {
  googleAnalytics(view.name, view.id);
});

setTimeout(() => {
  views.forEach(view => {
    googleAds(view.name, view.id);
  });
}, 30000);

const files = [
  __dirname + "/lib/results/analytics.json",
  __dirname + "/lib/results/ads.json"
];

setTimeout(() => {
  files.forEach(file => {
    uploadFile(file);
  });
}, 60000);

app.listen(app.get("port"), () => {
  console.log(
    `Listening on port ${app.get("port")}; Press Ctrl + C to terminate`
  );
});
