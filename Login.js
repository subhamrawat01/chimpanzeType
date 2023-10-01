const myDatabase = require('./databasepg');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5501;

// app.get('/signup', function(req,res){
//     res.send(`signup page for get`);
//     console.log(req);
//     console.log(res);
// })
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.post('/Login',async function(req,res){
    const postData = req.body;
    console.log(postData);
    username = postData.username;
    password = postData.password;
    if(await myDatabase.auth(username,password)){
        const userData = await myDatabase.getData(username);
        console.log(userData);
        res.status(200).json({message:'Authentication successful',data:userData});
    }
    else{
        res.status(401).json({message:'Authentication failed'});
    }
    
    
});





app.listen(port);