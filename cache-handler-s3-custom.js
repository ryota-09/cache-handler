const AWS = require('aws-sdk');

// AWS SDKの設定
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-northeast-1",
});

const s3 = new AWS.S3();
const bucketName = 'cache-handler';

module.exports = class S3CacheHandler {
  constructor(options) {
    this.options = options;
  }

  async get(key) {
    console.log("@@@@@@@@@@")
    console.log('Getting cache from S3:', key);
    console.log("@@@@@@@@@@")
    try {
      const params = {
        Bucket: bucketName,
        Key: key,
      };
      const data = await s3.getObject(params).promise();
      return JSON.parse(data.Body.toString('utf-8'));
    } catch (error) {
      console.error('Error getting cache from S3:', error);
      return null;
    }
  }

  async set(key, data, ctx) {
    console.log("@@@@@@@@@@")
    console.log('key', key);
    console.log("fetchUrl", ctx.fetchUrl)
    console.log("tags", ctx.tags)
    console.log("revalidate", ctx.revalidate)
    console.log("@@@@@@@@@@")
    try {
      const cacheData = {
        value: data,
        lastModified: Date.now(),
        tags: ctx.tags,
      };
      const params = {
        Bucket: bucketName,
        Key: key,
        Body: JSON.stringify(cacheData),
      };
      await s3.putObject(params).promise();
    } catch (error) {
      console.error('Error setting cache in S3:', error);
    }
  }

  async revalidateTag(tag) {
    // S3でのタグの再検証ロジックの実装は、S3のリストオブジェクトとタグに基づいて特定のオブジェクトを削除することを含む可能性があります。
    // この機能の実装は、S3の使用方法によって異なります。
    console.log('Revalidating tag:', tag);
    // 実際の実装は、S3の使用状況に応じて異なるため、ここでは具体的な実装は省略します。
  }
};
