const express = require("express");
const app = express();
app.use(express.static("public"));

require("dotenv").config();
const mysql = require("mysql");
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 3306,
  connectionLimit: 5,
});

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  S3Client,
  PutObjectCommand,
  RedirectAllRequestsToFilterSensitiveLog,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

app.get("/", (requests, responses) => {
  responses.sendFile(__dirname + "/templates/index.html");
});

app.post("/upload", upload.single("image"), async (requests, responses) => {
  const bucketname = process.env.BUCKET_NAME;
  const contenttext = requests.body.content;
  const date = new Date();
  const imagename = date.getTime() + ".png";
  const params = {
    Bucket: bucketname,
    Key: imagename,
    Body: requests.file.buffer,
    ContentType: requests.file.mimetype,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);

  pool.getConnection((error, connection) => {
    if (error) throw error;
    console.log("MySQL connection is opened");

    const sql = "INSERT INTO chat_list (content, image) VALUES (?)";
    const val = [contenttext, imagename];
    connection.query(sql, [val], (error) => {
      if (error) throw error;
      responses.status(200).send({ ok: true });
    });
    connection.release();
    console.log("MySQL connection is closed");
  });
});

app.get("/upload", (requests, responses) => {
  pool.getConnection((error, connection) => {
    if (error == true) {
      throw error;
    }
    console.log("MySQL connection is opened");

    const sql = "SELECT content, image FROM chat_list";
    connection.query(sql, (error, result) => {
      if (error == true) {
        throw error;
      }
      const data = { data: JSON.parse(JSON.stringify(result)) };
      responses.status(200).send(data);
    });
    connection.release();
    console.log("MySQL connection is closed");
  });
});

app.listen(3000, () => {
  console.log(`Running on http://0.0.0.0:3000`);
});
