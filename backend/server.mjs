import express from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import crypto from "crypto";
import sharp from "sharp";
import bodyParser from "body-parser";

dotenv.config();

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const PORT = process.env.PORT || 3001;

app.get("/api/posts/get", async (req, res) => {
  const posts = await prisma.posts.findMany({ orderBy: [{ created: "desc" }] });

  // signed url get image

  for (let post of posts) {
    const getObjectParams = {
      Bucket: bucketName,
      Key: post.imageName,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 60 });

    post.imageUrl = url;
  }

  // const input = {
  //   Bucket: bucketName,
  //   MaxKeys: 2,
  //   // ContinuationToken: token,
  // };

  // const command = new ListObjectsV2Command(input);
  // const response = await s3.send(command);
  // // const token = response.NextContinuationToken;

  res.send(posts);
  // res.send(response);
});

app.post("/api/posts", upload.single("image"), async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.file", req.file);

  // resize image
  const buffer = await sharp(req.file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer();

  // const imageName = "name" + "/" + randomImageName();
  const imageName = randomImageName();
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);

  await s3.send(command);

  // post data to database
  const post = await prisma.posts.create({
    data: {
      caption: req.body.caption,
      imageName: imageName,
      urlPath:
        "https://" +
        bucketName +
        ".s3." +
        bucketRegion +
        ".amazonaws.com" +
        "/" +
        imageName,
    },
  });

  res.send(post);
});

// PAGINATION Starts
app.post("/limit/post", async (req, res) => {
  const input1 = {
    Bucket: bucketName,
    MaxKeys: 2,
  };
  const input2 = {
    Bucket: bucketName,
    MaxKeys: 2,
    ContinuationToken: req.body.token,
  };
  const command = new ListObjectsV2Command(
    req.body.token !== "" ? input2 : input1
  );
  const response = await s3.send(command);
  const post = {
    token: response.NextContinuationToken,
    response,
  };
  res.send(post);
});
// PAGINATION Ends

app.delete("/api/posts/:id", async (req, res) => {
  const id = +req.params.id;

  const post = await prisma.posts.findUnique({ where: { id } });

  if (!post) {
    res.status(404).send("Post not found");
    return;
  }

  const params = {
    Bucket: bucketName,
    Key: post.imageName,
  };

  const command = new DeleteObjectCommand(params);
  await s3.send(command);

  await prisma.posts.delete({ where: { id } });

  res.send(post);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
