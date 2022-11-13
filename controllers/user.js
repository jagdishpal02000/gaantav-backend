const executeQuery = require("../model/rdb");

const userProfile = async (req, res) => {
  
    const {username} = req.params;
    if(!username) {
      res.status(404).json({'message': 'username required'});
      return;
    }
  
    const userDataQuery = `SELECT ul.id as id,ul.username as username,ul.email as email,ul.account_creation as account_creation,up.name as name,up.mobile as mobile,up.tagline as tagline,up.profile_picture as profile_picture
                          FROM user_login ul JOIN user_profile up ON  ul.id = up.user_id AND ul.username='${username}'`;
    const userData= await executeQuery(userDataQuery);
    if(userData.length === 0){
      res.status(404).json({message:'not found'});
      return;
    }
    res.json(userData);
  }

  module.exports = {userProfile};