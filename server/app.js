const express = require('express')
const app = express();
const cors = require("cors");
const port = 5000;
const Pusher = require("pusher");
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

require("dotenv").config();

var userCount, currImg;

app.use(cors({
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
  credentials: true
}));


app.use(express.json());

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir : '/tmp/'
}));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const pusher = new Pusher({
  appId: process.env.APPID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true
});

app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

// routes
app.get('/', (req, res) => {

  res.json({
    success: true
  });
});

app.post("/update", async (req, res) => {
  try {

    // Photo Upload Functionality
    // const file = req.files.bgImg;
    const file = req.files.selectedFile;

    await cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
      currImg = result.url;
    });

    // console.log("URL ===>", currImg);

    const attributes = "subscription_count,user_count";
    const response = await pusher.trigger("client", "suno-client", {
      imgURL: currImg
    }, {
      info: attributes,
    });

    return res.status(200).json({
      success: true,
      imgURL: currImg
    });
  } catch (e) {
    return res.status(404).json({
      success: false
    });
  }

});

app.post("/users", async (req, res) => {
  let {
    imgURL
  } = req.body;

  // console.log("====", imgURL);

  try {
    const attributes = "subscription_count,user_count";
    const response = await pusher.trigger("client", "suno-client", {
      imgURL: imgURL
    }, {
      info: attributes,
    });

    const body = await response.json();
    const channelsInfo = body.channels;
    console.log("res===", channelsInfo.client.subscription_count);

    await pusher.trigger("client", "setUserCount", {
      userCount: channelsInfo.client.subscription_count,
      imgURL: currImg ? currImg : null
    })
    // publishing userCount

    return res.status(200).json({
      success: true,
      user_count: userCount
    });
  } catch (e) {
    return res.status(401).json({
      success: false
    });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
