const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const request = require("request");
const bodyParser = require("body-parser")
const https = require("https");

require("dotenv").config();
const MAPI_KEY = process.env.API_KEY;
const MLIST_ID = process.env.LIST_ID;
const MAPI_SERVER = process.env.API_SERVER;

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");

})

app.post("/", (req,res) => {
    let fName = req.body.firstName;
    let lName = req.body.lastName;
    let email = req.body.email;
    const apiUrl = MAPI_SERVER + MLIST_ID;
    
    let options = {
        method: "post",
        auth: MAPI_KEY
    }

    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }

 

  let jsonData = JSON.stringify(data);
  const request = https.request(apiUrl, options, (apiResponse) => {
    if(apiResponse.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
        } else {
        res.sendFile(__dirname + "/failure.html");
        }
    apiResponse.on("data", (apiData) => {
    console.log(JSON.parse(apiData));
        
    })
    
  })

  request.write(jsonData);
  request.end();

})

app.post("/failure.html", (req, res) => {
    res.redirect("/")
})


app.listen(port, () => {
    console.log("Server Started");
})



