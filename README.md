# aws-db-react

**Followed this url:** https://www.youtube.com/watch?v=eQAIojcArRY
**Github link:** https://github.com/meech-ward/s3-get-put-and-delete/tree/master/express-react

**For S3 Bucket these libraries are used:** 
  S3Client,  PutObjectCommand,  GetObjectCommand,  DeleteObjectCommand,  ListObjectsV2Command, from "@aws-sdk/client-s3"
  getSignedUrl  from "@aws-sdk/s3-request-presigner"
  ListObjectsV2Command is used for fetching limited number of data from S3.

**Prisma** is used for connecting with Mysql database.

**AWS** free account is used.

**Express js** is used.

**Create .env file in the backend folder and then add this:** 
DATABASE_URL=""
BUCKET_NAME=""
BUCKET_REGION=""
ACCESS_KEY=''
SECRET_ACCESS_KEY=''


