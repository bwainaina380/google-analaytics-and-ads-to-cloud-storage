const { google } = require("googleapis");
const ads = google.analyticsreporting("v4");
const fileSystem = require("fs");

async function googleAds(viewName, viewId) {
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/analytics"]
  });

  const authClient = await auth.getClient();
  const project = await auth.getProjectId();

  google.options({
    project,
    auth: authClient
  });

  // Fetch data from GA
  const res = await ads.reports.batchGet({
    requestBody: {
      reportRequests: [
        {
          viewId: viewId,
          dateRanges: [
            {
              startDate: "today",
              endDate: "today"
            }
          ],
          metrics: [
            {
              expression: "ga:impressions"
            },
            {
              expression: "ga:adCost"
            },
            {
              expression: "ga:adClicks"
            },
            {
              expression: "ga:CPC"
            },
            {
              expression: "ga:costPerConversion"
            },
            {
              expression: "ga:CTR"
            }
          ],
          dimensions: [
            {
              name: "ga:date"
            },
            {
              name: "ga:adwordsCampaignID"
            },
            {
              name: "ga:keyword"
            },
            {
              name: "ga:adDestinationUrl"
            }
          ]
        }
      ]
    }
  });
  if (res.data.reports[0].data.rows) {
    res.data.reports[0].data.rows.forEach(row => {
      fileSystem.appendFileSync(
        __dirname + "/results/ads.json",
        JSON.stringify({
          view: viewName,
          date: row.dimensions[0],
          campaignId: row.dimensions[1],
          keyword: row.dimensions[2],
          destinationUrl: row.dimensions[3],
          impressions: row.metrics[0].values[0],
          adCost: row.metrics[0].values[1],
          adClicks: row.metrics[0].values[2],
          CPC: row.metrics[0].values[3],
          costPerConversion: row.metrics[0].values[4],
          CTR: row.metrics[0].values[5]
        }).concat("\n")
      );
    });
  }
}

module.exports = googleAds;
