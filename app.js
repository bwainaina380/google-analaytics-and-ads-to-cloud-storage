const express = require("express");
const app = express();
const views = require("./lib/views.json");
const googleAnalytics = require("./lib/googleAnalytics");
const googleAds = require("./lib/googleAds");
const dotenv = require("dotenv");
const uploadFile = require("./lib/cloudStorage");
const fs = require("fs");
const cron = require("node-cron");

dotenv.config();
app.set("port", process.env.PORT || 3000);
process.env.GOOGLE_APPLICATION_CREDENTIALS =
  __dirname + "/credentials/credentials.json";

cron.schedule("0 4 * * *", () => {
  try {
    views.forEach((view) => {
      googleAnalytics(view.name, view.id);
    });
  } catch (error) {
    console.error(error);
  }
});

cron.schedule("0 4 * * *", () => {
  setTimeout(() => {
    try {
      views.forEach((view) => {
        googleAds(view.name, view.id);
      });
    } catch (error) {
      console.error(error);
    }
  }, 30000);
});

const files = [
  __dirname + "/lib/results/analytics.json",
  __dirname + "/lib/results/ads.json",
];

cron.schedule("0 4 * * *", () => {
  setTimeout(() => {
    try {
      files.forEach((file) => {
        uploadFile(file);
      });
    } catch (error) {
      console.error(error);
    }
  }, 60000);
});

app.listen(app.get("port"), () => {
  console.log(
    `Listening on port ${app.get("port")}; Press Ctrl + C to terminate`
  );
});
