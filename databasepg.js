const { Client } = require("pg");
const bcrypt = require("bcryptjs");
const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "1234qwer",
  database: "ChimpanzeeType",
});
client.connect();

function addUser(username, email, password, name) {
  try {
    client.query(
      `INSERT INTO users (email,username,password,name) VALUES ('${email}','${username}','${password}','${name}')`
    );
    client.query(`INSERT INTO userdata (username) VALUES ('${username}')`);
    return true;
  } catch (err) {
    console.log(err.mesage());
    return err.mesage();
  }
}

async function auth(username, password) {
  const a = await client.query(
    `SELECT password from USERS where USERNAME = '${username}'`
  );
  const res = await bcrypt.compare(password, a.rows[0].password);
  return res;
}

async function getData(username) {
  const data = await client.query(
    `SELECT username,speed,races from userdata where username = '${username}'`
  );
  console.log(data.rows[0]);
  return data.rows[0];
}

async function checkUsernameAvailability(username) {
  const data = await client.query(
    `SELECT count(*) from userdata where username = '${username}'`
  );
  return data.rows[0].count == 0;

  // console.log(data);
}
// client.query(`SELECT * FROM users;`, (err,res)=>{
//     if(err) console.log(err);
//     else console.log(res.rows);
//     client.end();
// });

module.exports.addUser = addUser;
module.exports.auth = auth;
module.exports.getData = getData;
module.exports.checkUsernameAvailability = checkUsernameAvailability;
