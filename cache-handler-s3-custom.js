const AWS = require('aws-sdk');

// AWS SDKの設定
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-northeast-1',
});

const s3 = new AWS.S3();
const bucketName = 'cache-handler';

module.exports = class S3CacheHandler {
  constructor(options) {
    this.options = options;
  }

  async get(key) {
    try {
      const params = {
        Bucket: bucketName,
        Key: key,
      };
      const data = await s3.getObject(params).promise();
      const cacheData = JSON.parse(data.Body.toString('utf-8'));

      // 有効期限を確認
      if (this.isCacheExpired(cacheData)) {
        console.log('期限切れ:', key);
        await s3.deleteObject(params).promise();
      }
      return cacheData;
    } catch (error) {
      console.error('Error getting cache from S3:', error);
      return null;
    }
  }

  async set(key, data, ctx) {
    try {
      const cacheData = {
        value: data,
        lastModified: Date.now(),
        tags: ctx.tags,
        revalidate: ctx.revalidate, // 再検証時間を保存
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
    try {
      // S3バケット内の全オブジェクトをリストアップ
      const listParams = {
        Bucket: bucketName,
      };
      const listedObjects = await s3.listObjectsV2(listParams).promise();

      // 各オブジェクトに対して処理を行う
      for (const object of listedObjects.Contents) {
        // オブジェクトを取得
        const getParams = {
          Bucket: bucketName,
          Key: object.Key,
        };
        const data = await s3.getObject(getParams).promise();
        const cacheItem = JSON.parse(data.Body.toString('utf-8'));

        // キャッシュアイテムのタグに指定されたタグが含まれている場合、キャッシュアイテムを削除
        if (cacheItem.tags && cacheItem.tags.includes(tag)) {
          const deleteParams = {
            Bucket: bucketName,
            Key: object.Key,
          };
          await s3.deleteObject(deleteParams).promise();
          console.log('Cache deleted:', object.Key);
        }
      }
    } catch (error) {
      console.error('Error during S3 cache revalidation:', error);
    }
  }

  isCacheExpired(cacheData) {
    const now = Date.now();
    const validUntil = cacheData.lastModified + cacheData.revalidate * 1000;
    console.log('期限かどうか', now > validUntil);
    return now > validUntil;
  }
};
