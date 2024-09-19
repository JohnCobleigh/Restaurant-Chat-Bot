const express = require('express')
const app = express()

app.get("/api", (req,res)  =>{
    res.json({"users": ["userOne", "userTwo", "userThree"]})
})

//Server runs on port 5000
//Client runs on port 3000
app.listen(5000, () => { console.log("Server started on port 5000")})