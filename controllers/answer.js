
const executeQuery = require("../model/rdb");
const jwt= require('jsonwebtoken');


const answer = async (req, res) => {
  const userId = req.userId;
    const {questionId,answerBody} = req.body;
    const saveAnswerQuery = `INSERT INTO answers (question_id,user_id,body)  VALUES('${questionId}','${userId}','${answerBody}')`;
    try {
      const saveAnswer= await executeQuery(saveAnswerQuery);
      res.status(200).json({'message':'success'});
    } catch (error) {
      res.status(400).json(error);
    }
  };
  
const answers = async (req, res) => {
  const {questionId} = req.params;
  const getAnswerQuery = `SELECT a.answer_id as answerId,a.body as answerBody,a.image as image, a.up_votes as upVotes,a.down_votes as downVotes,a.datetime as dateTime,up.profile_picture as userImg ,a.views as views,ul.username as username FROM answers a INNER JOIN user_login ul ON a.user_id=ul.id INNER JOIN user_profile up ON up.user_id=a.user_id WHERE a.question_id=${questionId} ORDER BY a.up_votes DESC `;
  const getAnswers= await executeQuery(getAnswerQuery);
  res.json(getAnswers);
};
  
  module.exports = {answer,answers};
  