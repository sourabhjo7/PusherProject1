const express = require('express')
const app = express();
const cors = require("cors");
const port = 5000;
const Pusher = require("pusher");

require("dotenv").config();

var userCount, currColor;
app.use(cors({
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
  credentials: true
}));
app.use(express.json());

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
    currColor = req.body.color;

    const attributes = "subscription_count,user_count";
    const response = await pusher.trigger("client", "suno-client", {
      color: req.body.color
    }, {
      info: attributes,
    });
    if (response.status === 200) {
      const body = await response.json();
      const channelsInfo = body.channels;
      // userCount = channelsInfo.client.subscription_count;
      // console.log("res===", channelsInfo.client.subscription_count);
    }
    // publishing userCount
    // await pusher.trigger("client","setUserCount",{
    //         userCount:userCount
    //         })
    return res.status(200).json({
      success: true,
      user_count: userCount
    });
  } catch (e) {
    return res.status(404).json({
      success: false
    });
  }

});
app.get("/users/:value", async (req, res) => {
  let {
    value
  } = req.params;
  console.log("====", value);
  try {
    const attributes = "subscription_count,user_count";
    const response = await pusher.trigger("client", "suno-client", {
      color: `#${value}`
    }, {
      info: attributes,
    });

    const body = await response.json();
    const channelsInfo = body.channels;
    console.log("res===", channelsInfo.client.subscription_count);
    await pusher.trigger("client", "setUserCount", {
      userCount: channelsInfo.client.subscription_count,
      color: currColor ? currColor : null
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
