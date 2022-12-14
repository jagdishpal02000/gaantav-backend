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


// getting views and updating views.
const views = async (req, res) => {
    
};

//for upvote
const upVote = async (req, res) => {
  const userId = req.userId;
  const {questionId}=req.body;
  if(!questionId || !userId) {
    res.status(404).json({message:'question and userid cannot be empty'});
    return;
  }
  // 1 case :
    // entry not found in votes Table
        // just add one entry votes table.
  // 2 case :
    // found with upvote.
        // do nothing
  // 3 case:
    // found with downvote.
    // remove the downvote and add upvote.
  let currRepo=null;
  const find = await executeQuery(`SELECT vote FROM votes WHERE user_id ='${userId}'  and question_id ='${questionId}' LIMIT 1`);
  // case 1:
  if(find.length == 0){
    const updatingVote = await executeQuery(`INSERT INTO votes(user_id,question_id,vote,type) VALUES('${userId}','${questionId}','${1}','Q')`);
    const updateQuestionTable = await executeQuery(`UPDATE questions SET repo=1 WHERE question_id='${questionId}'`);
    // currRepo = await executeQuery(`SELECT repo FROM questions WHERE question_id ='${questionId}'`);
  }
  // case 2:
  else if(find[0].vote == 1){
      // do nothing.
  }
  // case 3:
  else if(find[0].vote == -1){
    const updatingVote = await executeQuery(`UPDATE votes SET vote = '1' WHERE question_id = '${questionId}' AND user_id = '${userId}'`);
    // const updateQuestionTable = await  executeQuery(`UPDATE questions SET repo = (CASE 
    //                                                                   WHEN repo = -1 
    //                                                                   THEN 1 
    //                                                                   ELSE repo+1
    //                                                                   END)
    //                                                                    WHERE question_id='${questionId}'`);
    currRepo = await executeQuery(`SELECT repo FROM questions WHERE question_id ='${questionId}'`);
    if(currRepo[0].repo == -1) {
      const updateQuestionTable = await  executeQuery(`UPDATE questions SET repo = 1 WHERE question_id='${questionId}'`);
      currRepo[0].repo = 1;
    }
    else {
      const updateQuestionTable = await  executeQuery(`UPDATE questions SET repo = repo+1 WHERE question_id='${questionId}'`);
      currRepo[0].repo += 1;
    }
    
  }
  
  if(!currRepo) currRepo = await executeQuery(`SELECT repo FROM questions WHERE question_id ='${questionId}'`);
//  const getCurrentRepo = await executeQuery(`SELECT repo FROM questions WHERE question_id ='${questionId}'`);
res.status(200).json(currRepo[0]);
};

//for downvote
const downVote = async (req, res) => {
  const userId = req.userId;
  const {questionId}=req.body;
  if(!questionId || !userId) {
    res.status(404).json({message:'question and userid cannot be empty'});
    return;
  }
  // 1 case :
    // entry not found in votes Table
        // just add one entry votes table.
  // 2 case :
    // found with upvote.
      // remove the downvote and add upvote.
  // 3 case:
      // found with downvote.
      // do nothing
  let currRepo=null;
  const find = await executeQuery(`SELECT vote FROM votes WHERE user_id ='${userId}'  and question_id ='${questionId}' LIMIT 1`);
  // case 1:
  if(find.length == 0){
    const updatingVote = await executeQuery(`INSERT INTO votes(user_id, question_id,vote,type) VALUES('${userId}','${questionId}','${-1}','Q')`);
    const updateQuestionTable = await executeQuery(`UPDATE questions SET repo=repo-1 WHERE question_id='${questionId}'`);
  }
  // case 2:
  else if(find[0].vote == 1){
    const updatingVote = await executeQuery(`UPDATE votes SET vote='-1' WHERE question_id = '${questionId}' AND user_id = '${userId}'`);
    // const updateQuestionTable = await executeQuery(`UPDATE questions SET repo=
    //                                                                   (
    //                                                                   CASE 
    //                                                                     WHEN repo=1
    //                                                                     THEN -1
    //                                                                     ELSE 
    //                                                                     repo-1
    //                                                                     END 
    //                                                                   )
    
    //                                                                 WHERE question_id='${questionId}'`);
    currRepo = await executeQuery(`SELECT repo FROM questions WHERE question_id ='${questionId}'`);
    if(currRepo[0].repo == 1) {
      const updateQuestionTable = await  executeQuery(`UPDATE questions SET repo = -1 WHERE question_id='${questionId}'`);
      currRepo[0].repo = -1;
    }
    else {
      const updateQuestionTable = await  executeQuery(`UPDATE questions SET repo = repo-1 WHERE question_id='${questionId}'`);
      currRepo[0].repo -= 1;
    }
  
  }
  // case 3:
  else if(find[0].vote == -1){
    // do nothing.
  }

  if(!currRepo)
      currRepo = await executeQuery(`SELECT repo FROM questions WHERE question_id ='${questionId}'`);
//  const getCurrentRepo = await executeQuery(`SELECT repo FROM questions WHERE question_id ='${questionId}'`);
 res.status(200).json(currRepo[0]);
};




  
module.exports = {
  posts,
  downVote,
  upVote,
};
