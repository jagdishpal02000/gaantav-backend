require('dotenv').config();
const express= require('express');
const app = express();
var cors = require('cors');

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*'
}));

app.use(
express.urlencoded({
    extended: true,
})
);
app.use(express.json());

app.get('/',(req,res)=>{
res.json({status:200,message:'gaantav APIs'});
});

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