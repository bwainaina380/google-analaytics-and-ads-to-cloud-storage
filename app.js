const express = require("express");
const app = express();
const views = require("./lib/views.json");
const googleAnalytics = require("./lib/googleAnalytics");
const googleAds = require("./lib/googleAds");
const dotenv = require("dotenv");
const uploadFile = require("./lib/cloudStorage");
const fs = require("fs");

dotenv.config();
app.set("port", process.env.PORT || 3000);

try {
  views.forEach((view) => {
    googleAnalytics(view.name, view.id);
  });
} catch (error) {
  console.error(error);
}

setTimeout(() => {
  try {
    views.forEach((view) => {
      googleAds(view.name, view.id);
    });
  } catch (error) {
    console.error(error);
  }
}, 30000);

const files = [
  __dirname + "/lib/results/analytics.json",
  __dirname + "/lib/results/ads.json",
];

setTimeout(() => {
  try {
    files.forEach((file) => {
      uploadFile(file);
    });
  } catch (error) {
    console.error(error);
  }
}, 60000);

setTimeout(() => {
  try {
    files.forEach((file) => {
      fs.unlinkSync(file);
    });
  } catch (error) {
    console.error(error);
  }
}, 120000);

app.listen(app.get("port"), () => {
  console.log(
    `Listening on port ${app.get("port")}; Press Ctrl + C to terminate`
  );
});
