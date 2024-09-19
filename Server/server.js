require('dotenv').config()

const express = require('express')
const app = express()

// route
app.get("/api", (req,res)  =>{
    res.json({"users": ["userOne", "userTwo", "userThree"]})
})

// Listen for requests
app.listen(process.env.PORT, () => { console.log("Server started on port", process.env.PORT)})
