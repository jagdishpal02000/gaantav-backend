require('dotenv').config();
const express= require('express');
const route = require("./routes/index");
const app = express();
const notFound = require("./middleware/notFound");
var cors = require('cors');
const multer  = require('multer')


const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*'
}));

app.use(
express.urlencoded({
    extended: true,
})
);

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
      fileSize: 200 * 1024 * 1024
},
  fileFilter: fileFilter
};


const upload = multer({ obj})


app.use(express.static('public'))

app.use(express.json());

app.get('/',(req,res)=>{
res.json({status:200,message:'gaantav APIs'});
});

app.use("/api/v1/",upload.single('image'),route);

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