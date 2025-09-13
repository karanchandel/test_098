const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/situ",(req,res)=>{
    return res.send("Hello new")
})



module.exports = router;