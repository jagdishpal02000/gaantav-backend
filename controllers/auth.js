const executeQuery = require("../model/rdb");
const jwt= require('jsonwebtoken');


const signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      let flag = true;
      let message = "";
      let status = 200;
  
      // have to add checks for name,email and password and needs to add more fields.
      const checkQuery = `SELECT * FROM user_login WHERE email = '${email}' LIMIT 1`;
      const checkResult = await executeQuery(checkQuery);
      console.log(checkResult);
      if (checkResult.length !== 0) {
        flag = false;
        message = "EMAIL_ALREADY_EXISTS";
        status = 409;
      }
      if (flag) {
        // inserting in user_login.
        const insertQuery = `INSERT INTO user_login (username,email,password) VALUES ('${email}','${email}','${password}')`;
        const insertResult = await executeQuery(insertQuery);
        
        //Fetching userId
        const getIdQuery = `SELECT id FROM user_login WHERE email = '${email}' LIMIT 1`;
        const userId = await executeQuery(getIdQuery);
  
        // Generating Token
        const user = { userId:userId[0].id };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  
        //Saving Token
        const saveTokenQuery = `UPDATE user_login SET token='${accessToken}' WHERE id='${user.userId}'`;
        const saveToken = await executeQuery(saveTokenQuery);
  
        // Saving updatingProfile
        const updateProfileQuery = `INSERT INTO user_profile (user_id,name) VALUES ('${userId[0].id}','${name}')`;
        const updateProfile = await executeQuery(updateProfileQuery);
        message={accessToken,email};
      }
  
      res.status(status).json(message);
      return;
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  };
  
  const login = async (req, res) => {
    try {
    const  {email,password} = req.body;
  
      const findAccountQuery=`SELECT password,token FROM user_login WHERE email='${email}' || username='${email}' LIMIT 1`;
      const findAccount = await executeQuery(findAccountQuery);
      if(findAccount.length === 0 ){
        res.status(404).json({error:'USER_NOT_FOUND'});
        return;
      }
      else if(findAccount[0].password !== password ){
        res.status(401).json({error:'INCORRECT_PASSWORD'});
        return;
      }
      else{
        const accessToken = findAccount[0].token;
        res.status(200).json({accessToken,email});
      }
      
    } catch (error) {
      res.status(400).json(error);
    }
    };

module.exports = {login,signup};
  