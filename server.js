//jshint esversion:6

const express = require('express')
const bodyParser = require('body-parser')


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))

app.get('/landing',function(req,res){
    
    res.sendFile(__dirname+ "/landnavcss.html")
})

// Taiwan  
app.get('/',function(req,res){
    
    res.sendFile(__dirname+ "/index.html")
})

app.get('/tainan',function(req,res){
    res.sendFile(__dirname+ "/index2.html")
})

app.get('/tainan/detail',function(req,res){
    res.sendFile(__dirname+ "/detailed.html")
})

//Taiwan english part
app.get('/en',function(req,res){
    res.sendFile(__dirname+ "/index_en.html")
})

app.get('/tainan_en',function(req,res){
    res.sendFile(__dirname+ "/index2_en.html")
})

app.get('/tainan/detail_en',function(req,res){
    res.sendFile(__dirname+ "/detailed_en.html")
})


app.listen(3000 ,function(){
    console.log("server is running on port 3000");
    
})