const AWS = require("aws-sdk");
var s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
let params = {
  Bucket: "google-analytics-roll-up-gds-dashboard-data",
  Key: "key",
  Body: stream
};
s3.upload(params, function(err, data) {
  console.log(err, data);
});
