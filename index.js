require('dotenv').config();
const express= require('express');
const privateRoute = require("./routes/private");
const publicRoute = require("./routes/public");
const authRoute = require("./routes/auth");
const app = express();
const notFound = require("./middleware/notFound");
var cors = require('cors');
const multer  = require('multer');
const privateRoutes = require('./routes/private');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*'
}));

app.use(
express.urlencoded({
    extended: true,
})
);


function authenticateToken(req, res,next){
  // Bearer Token
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if(token){
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
      if(err) 
          res.sendStatus(403);
      else {
      req.userId=user.userId;
      next();
      }
      });
  }
  else 
      res.sendStatus(401);
  }

  

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null,Date.now()+ '_' + file.originalname)
  }
});


let fileFilter = function (req, file, cb) {
  var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png','image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
  } else {
      cb({
          success: false,
          message: 'Invalid file type. Only jpg, png image files are allowed.'
      }, false);
  }
};

let obj = {
  storage: storage,
  limits: {
      fileSize: 2000 * 1024 * 1024
},
  fileFilter: fileFilter
};


const upload = multer(obj)


app.use(express.static('public'))

app.use(express.json());

app.get('/',(req,res)=>{
res.json({status:200,message:'gaantav APIs'});
});

app.use("/auth/",authRoute);
app.use("/api/v1/",authenticateToken,upload.single('image'),privateRoutes);
app.use("/public/api/v1/",publicRoute);

app.use("*", notFound);

const startApp = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`SERVER IS LISTING AT PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();