const executeQuery = require("../model/rdb");
const jwt= require('jsonwebtoken');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const sha1 = require('sha1');
const { info } = require("console");


const uploadToAws = (file) =>{

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,accessKeyId,secretAccessKey
})

  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket :bucketName,
    Body:fileStream,
    Key:file.filename
  }
 
  return s3.upload(uploadParams).promise();
}

const addQuestion = async (req, res) => {
    try {
      const userId = req.userId;
      const { title, summery, tags } = req.body;
      // check is title already exist or not.
      let titleQuery=`SELECT question_id FROM questions WHERE title='${title}' LIMIT 1`;
      let titleQueryRes = await executeQuery(titleQuery);
      if(titleQueryRes.length === 1){
        res.status(409).json({message:'title already exist'});
        fs.unlinkSync(req.file.path);
        return;
      }
      const imageUpload = await uploadToAws(req.file);
      console.log(imageUpload.Location);
      const imagePath = imageUpload.Location;
      if (!title || title.length === 0 || !summery || summery.length === 0) {
        res.status(400).json({ msg: "title or summery can not be empty" });
        return;
      }
      // splitting on space and -
      const titleHash = sha1(title.split(/(?:-| )+/).join(''));
    //   console.log({
    //     title,
    //   summery,
    //   tags,
    //   imagePath,
    //   titleHash,
    // });
    const createQuestionQuery = `INSERT INTO questions (user_id,title,body,image,tags,title_hash) VALUES ('${userId}','${title}','${summery}','${imagePath}','${tags}','${titleHash}')`;
    const createQuestion = await executeQuery(createQuestionQuery);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
  };
  


  
const questions = async (req, res) => {
    const {page,userId} = req.params;
    if(page && page < 1){
      res.status(400).json({message:'invalid page number'});
      return;
    }
    // 1 -> 0 - 5
    // 2 -> 5 - 10
    let getQuestionsQuery="";
    if(!userId){
     getQuestionsQuery = `SELECT ul.id as userId,q.question_id as questionId, ul.username AS authorUsername,up.name as authorName,up.profile_picture as authorImage,q.title AS title,q.body AS summery , q.tags AS tags,q.image AS image,q.repo as repo,q.creation_datetime as creation_datetime FROM questions q INNER JOIN user_login ul ON q.user_id = ul.id INNER JOIN user_profile up ON up.user_id=q.user_id  ORDER BY q.creation_datetime DESC LIMIT ${(page-1)*5},5`;
    }
    else{
     getQuestionsQuery = `SELECT ul.id as userId,q.question_id as questionId, ul.username AS authorUsername,up.name as authorName,up.profile_picture as authorImage,q.title AS title,q.body AS summery , q.tags AS tags,q.image AS image,q.repo as repo,q.creation_datetime as creation_datetime FROM questions q INNER JOIN user_login ul ON q.user_id = ul.id INNER JOIN user_profile up ON up.user_id=q.user_id  WHERE q.user_id='${userId}'  ORDER BY q.creation_datetime DESC `;
    }
    const getQuestions= await executeQuery(getQuestionsQuery);
    if(getQuestions.length === 0){
      res.status(204).json({message:'no data exists'});
      return;
    }
    res.json(getQuestions);
  
  }

const question = async (req, res) => {
    const {questionTitle} = req.params;
    const titleHash = sha1(questionTitle);
    const getQuestionQuery = `SELECT q.question_id as questionId, ul.username AS authorUsername,up.name as authorName,up.profile_picture as authorImage,q.title AS title,q.body AS summery , q.tags AS tags,q.image AS image,q.repo as repo,q.creation_datetime as creation_datetime FROM questions q INNER JOIN user_login ul ON q.user_id = ul.id INNER JOIN user_profile up ON up.user_id=q.user_id WHERE q.title_hash ='${titleHash}'`;
    const getQuestion= await executeQuery(getQuestionQuery);
    if(getQuestion.length === 0){
      res.status(404).json({message:'not found'});
      return;
    }
    res.json(getQuestion);
  }



module.exports = {addQuestion,questions,question};
  
  