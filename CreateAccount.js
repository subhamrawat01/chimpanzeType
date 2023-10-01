const myDatabase = require("./databasepg");
const express = require("express");
const hashPasswordMiddleware = require("./hashPasswordMiddleware");
const cors = require("cors");
const app = express();
const port = 5502;
// app.get('/signup', function(req,res){
//     res.send(`signup page for get`);
//     console.log(req);
//     console.log(res);
// })
app.use(cors());
let username, email, password;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/signup",hashPasswordMiddleware, function (req, res) {
  let {username,email,password,name} = req.body;
  // let postData = req.body;
  // let username = postData.username;
  // let email = postData.email;
  // let password = postData.password;
  // let name = postData.name;
  const msg = myDatabase.addUser(username, email, password, name);
  if (msg == true) res.json({ message: "Account Succesfully created" });
  else res.send({ message: msg });

  //   myDatabase.addUser(username, email, password);
  //   res.send(
  //     `Account Successuly created <a href="http://127.0.0.1:5500/signin.html">Sign In</a> Redirect to signIN now`
  //   );
});

app.get("/checkAvailability", async (req, res) => {
  const username = req.query.username;
  //   myDatabase.checkUsernameAvailability(username);
  const ans = await myDatabase.checkUsernameAvailability(username);
  res.send(ans);
});

app.listen(port);
