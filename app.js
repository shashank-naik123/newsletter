const express = require("express")
const bodyParser = require("body-parser")
const request= require("request")
const https= require("https")
const app= express()

app.listen(process.env.PORT||3000,function(){
  console.log("server is running on server 3000")
})

app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html")
})
app.use(bodyParser.urlencoded({extended:true}));

app.post("/",function(req,res){
  let first=req.body.firstName;
  let last =req.body.lastName;
  let email= req.body.emailId;
  const data = {
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:first,
          LNAME:last
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data)

  const url="https://us10.api.mailchimp.com/3.0/lists/3de791a7de"
  const options ={
    method:"POST",
    auth:"shashank:5a19bfc5faa0b32b8fa4abeefeba587d-us10"
  }

  const request= https.request(url,options,function(response){

    if (response.statusCode===200){
      res.sendFile(__dirname+"/success.html")
    }else{
      res.sendFile(__dirname+"/failure.html")
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData)

  request.end()
})

app.post("/failure",function(req,res){
  res.redirect("/")
})



// api key=5a19bfc5faa0b32b8fa4abeefeba587d-us10
// list id =3de791a7de
