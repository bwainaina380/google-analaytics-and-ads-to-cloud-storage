const { google } = require("googleapis");
const analytics = google.analyticsreporting("v4");
const fileSystem = require("fs");
const uploadFile = require("./cloudStorage");

async function googleAnalytics(viewName, viewId) {
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
  const res = await analytics.reports.batchGet({
    requestBody: {
      reportRequests: [
        {
          viewId: viewId,
          dateRanges: [
            {
              startDate: "yesterday",
              endDate: "yesterday"
            }
          ],
          metrics: [
            {
              expression: "ga:users"
            },
            {
              expression: "ga:sessions"
            },
            {
              expression: "ga:newUsers"
            },
            {
              expression: "ga:sessionsPerUser"
            },
            {
              expression: "ga:pageviews"
            },
            {
              expression: "ga:pageviewsPerSession"
            },
            {
              expression: "ga:avgSessionDuration"
            },
            {
              expression: "ga:bounceRate"
            },
            {
              expression: "ga:goalCompletionsAll"
            }
          ],
          dimensions: [
            {
              name: "ga:date"
            },
            {
              name: "ga:country"
            },
            {
              name: "ga:city"
            },
            {
              name: "ga:pagePath"
            },
            {
              name: "ga:deviceCategory"
            },
            {
              name: "ga:medium"
            }
          ]
        }
      ]
    }
  });
  if (res.data.reports[0].data.rows) {
    res.data.reports[0].data.rows.forEach(row => {
      fileSystem.appendFileSync(
        __dirname + "/results/analytics.json",
        JSON.stringify({
          view: viewName,
          date: row.dimensions[0],
          country: row.dimensions[1],
          city: row.dimensions[2],
          page: row.dimensions[3],
          deviceCategory: row.dimensions[4],
          medium: row.dimensions[5],
          users: row.metrics[0].values[0],
          sessions: row.metrics[0].values[1],
          newUsers: row.metrics[0].values[2],
          sessionsPerUser: row.metrics[0].values[3],
          pageviews: row.metrics[0].values[4],
          pageviewsPerSession: row.metrics[0].values[5],
          avgSessionDuration: row.metrics[0].values[6],
          bounceRate: row.metrics[0].values[7],
          goalCompletions: row.metrics[0].values[8]
        }).concat("\n")
      );
    });
  }
}

module.exports = googleAnalytics;
