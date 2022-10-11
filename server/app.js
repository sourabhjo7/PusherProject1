const  express = require('express')
const app = express();
const cors=require("cors");
const port = 5000;
const Pusher=require("pusher")
require("dotenv").config();

app.use(cors({
    origin:["http://localhost:3000"],
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
app.get('/', (req, res) =>{
    res.json({
        success:true
      });
} );
app.post("/update",async(req,res)=>{
    try{
        await pusher.trigger("client", "suno-client", {
            color: req.body.color
          });
          return res.json({
            success:true
          });
    }
    catch(e){
        return res.json({
            success:false
          });
    }
  
})

app.listen( port, () => console.log(`Example app listening on port ${port}!`))