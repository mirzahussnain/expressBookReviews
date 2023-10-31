const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  const validUsers=users.filter((user)=>{
    return (user.username===username)
  })

  return (validUsers.length>0)
}

const authenticatedUser = (username,password)=>{ //returns boolean
const authenticUsers=users.filter((user)=>(user.username===username && user.password===password))
return (authenticUsers.length>0)
}

regd_users.post("/login", (req,res) => {
 const username=req.body.username;
 const password=req.body.password;
 if(!username || !password){
    return res.status(404).send('Username/Password is not entered')
 }

 if(authenticatedUser(username,password)){
  let accessToken=jwt.sign({data:password},'access',{expiresIn:60*60})
  req.session.authorization={accessToken,username}
  return res.status(200).send('User Logged in!')
 }
 else{
  return res.status(208).json({message: "Invalid Login. Check username and password"});
 }
 
});

regd_users.delete('/auth/review/:isbn',(req,res)=>{
  const isbn=req.params.isbn;
  const user=req.session.authorization['username'];
  if(books[isbn]){
    const reviewerNames=Object.keys(books[isbn]['reviews']);
    if(reviewerNames.length>0){
      if(reviewerNames.includes(user)){
        delete (books[isbn]['reviews'][user]);
        return res.status(200).send(`Review of Customer: ${user} is deleted from Book:${books[isbn]['title']} !`);
      }
      else{
        return res.status(403).send(`Book ${books[isbn]['title']} does not have any review related to Customer: ${user}!`);
      }
    }
    else{
      return res.status(403).send(`Book ${books[isbn]['title']} does not have any review yet!`);
    }
  }
  else{
    return res.status(404).send('Book with given ISBN does not exist!!');
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn=req.params.isbn;
  const newReview=req.query.review;
  const postedBy=req.session.authorization['username']

  if(books[isbn]){
    const reviewerNames=Object.keys(books[isbn]['reviews'])
 

    // let reviewerNames=Object.keys(books[isbn]['reviews'])
    if(reviewerNames.includes(postedBy)){
      books[isbn]['reviews'][postedBy]={"data":newReview};
      return res.status(200).send(`Review of ${books[isbn]['title']} is updated!`)
    }
    else{
      books[isbn]['reviews']={...books[isbn]['reviews'],[postedBy]:{"data":newReview}};
      return res.status(200).send(`New Review of ${books[isbn]['title']} is added!`)
    }
  }

  else{
    res.status(403).send('Book with such ISBN does not exist');
  }
  
 
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
