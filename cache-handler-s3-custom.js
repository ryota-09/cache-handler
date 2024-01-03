// AWS SDKをインポートする
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-northeast-1",
});

const bucketName = 'cache-handler';

// S3クライアントを作成する
const s3 = new AWS.S3();

// キャッシュをS3に保存する関数
async function saveToS3(key, data) {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: value,
    };
    await s3.putObject(params).promise();
  } catch (error) {
    console.error('Error setting cache in S3:', error);
  }
}

// キャッシュをS3から取得する関数
async function getCache(key) {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    };
    const data = await s3.getObject(params).promise();
    return data.Body.toString('utf-8');
  } catch (error) {
    console.error('Error getting cache from S3:', error);
    return null;
  }
}

// エクスポートする
module.exports = {
  saveToS3,
  getCache
};
