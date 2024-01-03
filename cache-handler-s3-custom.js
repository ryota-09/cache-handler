// AWS SDKをインポートする
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-northeast-1",
});

// S3クライアントを作成する
const s3 = new AWS.S3();

// キャッシュをS3に保存する関数
function saveToS3(key, data) {
  const params = {
    Bucket: 'your-bucket-name',
    Key: key,
    Body: data
  };

  return s3.putObject(params).promise();
}

// キャッシュをS3から取得する関数
function getFromS3(key) {
  const params = {
    Bucket: 'your-bucket-name',
    Key: key
  };

  return s3.getObject(params).promise()
    .then(response => response.Body.toString());
}

// エクスポートする
module.exports = {
  saveToS3,
  getFromS3
};
