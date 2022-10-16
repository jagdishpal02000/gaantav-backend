const { response } = require("express");
const executeQuery = require("../model/rdb");
const jwt= require('jsonwebtoken');


const allPosts = [
  {
    id: 1,
    title: "write hello world program",
    summery: "this is the summery of the question",
    image:
      "https://qph.cf2.quoracdn.net/main-qimg-c603062c2b793c249ca93c158ac3951a-lq",
    authorImage:
      "https://qph.cf2.quoracdn.net/main-qimg-c603062c2b793c249ca93c158ac3951a-lq",
    authorName: "Jagdish Pal",
    tags: "cpp,reactjs,nodejs",
    upVotes: 5,
    downVotes: 2,
    authorUsername: "jagdishpal02000",
  },
  {
    id: 2,
    title: "best programming language",
    summery: "please don't forget php.",
    image:
      "https://qph.cf2.quoracdn.net/main-qimg-96b671933616ac30af8f0818835abefd-lq",
    authorImage:
      "https://qph.cf2.quoracdn.net/main-qimg-96b671933616ac30af8f0818835abefd-lq",
    authorName: "Radhe Syam",
    tags: "cpp,PHP,nodejs",
    upVotes: 3,
    downVotes: 0,
    authorUsername: "jagdishpal02001",
  },
  {
    id: 3,
    title: "write hello world program",
    summery: "this is the summery of the question",
    image:
      "https://qph.cf2.quoracdn.net/main-qimg-c603062c2b793c249ca93c158ac3951a-lq",
    authorImage:
      "https://qph.cf2.quoracdn.net/main-qimg-c603062c2b793c249ca93c158ac3951a-lq",
    authorName: "Jagdish Pal",
    tags: "cpp,reactjs,nodejs",
    upVotes: 5,
    downVotes: 2,
    authorUsername: "jagdishpal02000",
  },
  {
    id: 4,
    title: "best programming language",
    summery: "please don't forget php.",
    image:
      "https://qph.cf2.quoracdn.net/main-qimg-96b671933616ac30af8f0818835abefd-lq",
    authorImage:
      "https://qph.cf2.quoracdn.net/main-qimg-96b671933616ac30af8f0818835abefd-lq",
    authorName: "Radhe Syam",
    tags: "cpp,PHP,nodejs",
    upVotes: 13,
    downVotes: 0,
    authorUsername: "jagdishpal02001",
  },
];

const posts = async (req, res) => {
  res.json(allPosts);
};

const addQuestion = async (req, res) => {
  const { title, summery, tags } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || title.length === 0 || !summery || summery.length === 0) {
    res.status(400).json({ msg: "title or summery can not be empty" });
    return;
  }
  console.log({
    title,
    summery,
    tags,
    image,
  });

  res.sendStatus(200);
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let flag = true;
    let message = "";
    let status = 200;

    // have to add checks for name,email and password and needs to add more fields.

    const checkQuery = `SELECT * FROM user_login WHERE email = '${email}' LIMIT 1`;
    const checkResult = await executeQuery(checkQuery);
    if (checkResult.length !== 0) {
      flag = false;
      message = "EMAIL_ALREADY_EXISTS";
      status = 409;
    }
    if (flag) {
      const user = { email };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      const insertQuery = `INSERT INTO user_login (username,email,password,token) VALUES ('${email}','${email}','${password}','${accessToken}')`;
      const insertResult = await executeQuery(insertQuery);
      const getIdQuery = `SELECT id FROM user_login WHERE email = '${email}' LIMIT 1`;
      const userId = await executeQuery(getIdQuery);
      const updateProfileQuery = `INSERT INTO user_profile (user_id,name) VALUES ('${userId[0].id}','${name}')`;
      const updateProfile = await executeQuery(updateProfileQuery);
      message={accessToken};
    }

    res.status(status).json(message);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const login = async (req, res) => {
  try {
  const  {email,password} = req.body;

    const findAccountQuery=`SELECT password,token FROM user_login WHERE email='${email}' LIMIT 1`;
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
      res.status(200).json({accessToken});
    }
    
  } catch (error) {
    res.status(400).json(error);
  }
  };
  
module.exports = {
  posts,
  addQuestion,
  signup,
  login,
};
