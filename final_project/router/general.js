const express = require('express');
const axios=require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username=req.body.username;
  const password=req.body.password;
  console.log(username,password)
  if(username&&password){
    if(!isValid(username)){
      users.push({"username":username,"password":password})
      return res.status(200).send('User Successfully Registerd and can Login!');
    }
    else{
      return res.status(404).send('User already exists');
    }
  }
  else{
    return res.status(404).send('Invalid Username/Password')
  }
 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  if(!books[isbn]){
    return res.status(404).json({message:"Book with this isbn does not exist"});
  }
  return res.status(200).send(JSON.stringify(books[isbn]));
 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName=req.params.author;
  const isbnList=Object.keys(books)
  let filteredBooks={};

isbnList.forEach((key)=>{
    if(books[key].author===authorName){
        let book=books[key]
        filteredBooks={...filteredBooks,book}
    }
})

if(filteredBooks){
  return res.status(200).send(filteredBooks);
}
return res.status(403).json({message:'Books with such author does not exist.'})
  
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleName=req.params.title;
  const isbnList=Object.keys(books)
  let filteredBooks={};

isbnList.forEach((key)=>{
    if(books[key].title===titleName){
        let book=books[key]
        filteredBooks={...filteredBooks,book}
    }
})

if(filteredBooks){
  return res.status(200).send(filteredBooks);
}
return res.status(403).json({message:'Books with such title does not exist.'})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  return res.status(200).send(books[isbn].reviews)
});


/* Async/Await OR Promise Code*/

const getAllBooks=async()=>{
  try{
    const response=await axios.get('localhost:5000/');
    if(response.status(200)){
      console.log(response.data);
    }
    else{
      throw new Error(`Error: ${response.error}`)
    }
   
  }catch(error){
    console.log(error.message());
  }
  
  
}

const getBooksByIsbn=async(isbn)=>{
  try{
    const response=await axios({url:'localhost:5000/isbn',params:{"isbn":isbn}});
    if(response.status(200)){
      console.log(response.data);
    }
    else{
      throw new Error(`Error: ${response.error}`)
    }
  }catch(err){
    console.log(err.message())
  }
}

const getBooksByTitle=async(title)=>{
  try{
    const response=await axios({url:'localhost:5000/title',params:{"title":title}});
    if(response.status(200)){
      console.log(response.data);
    }
    else{
      throw new Error(`Error: ${response.error}`)
    }
  }catch(err){
    console.log(err.message())
  }
}

const getBooksByAuthor=async(author)=>{
  try{
    const response=await axios({url:'localhost:5000/author',params:{"author":author}});
    if(response.status(200)){
      console.log(response.data);
    }
    else{
      throw new Error(`Error: ${response.error}`)
    }
  }catch(err){
    console.log(err.message())
  }
}
module.exports.general = public_users;
