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

//Australia english part
app.get('/au',function(req,res){
    res.sendFile(__dirname + "/index_australia.html")
})

app.get('/au/queensland', function(req, res){
    res.sendFile(__dirname + "/index_queensland.html")
})

app.get('/au/queensland/brisbane', function(req, res){
    res.sendFile(__dirname + "/index_brisbane.html")
})

app.get('/au/queensland/brisbane/redland', function(req, res){
    res.sendFile(__dirname + "/index_redland.html")
})

app.get('/au/queensland/brisbane/redland/detailed_redland_en', function(req, res){
    res.sendFile(__dirname + "/detailed_redland_en.html")
})

// Australia zh part
app.get('/au_zh', function(req, res){
    res.sendFile(__dirname + "/index_australia_zh.html")
})

app.get('/au_zh/queensland_zh', function(req, res){
    res.sendFile(__dirname + "/index_queensland_zh.html")
})

app.get('/au_zh/queensland_zh/brisbane_zh', function(req, res){
    res.sendFile(__dirname + "/index_brisbane_zh.html")
})

app.get('/au_zh/queensland_zh/brisbane_zh/redland_zh', function(req, res){
    res.sendFile(__dirname + "/index_redland_zh.html")
})

app.get('/au_zh/queensland_zh/brisbane_zh/redland_zh/detailed_redland_zh', function(req, res){
    res.sendFile(__dirname + "/detailed_redland_zh.html")
})



app.listen(3000 ,function(){
    console.log("server is running on port 3000");
    
})