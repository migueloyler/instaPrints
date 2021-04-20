const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
  }
});

express()
  .use(express.static(path.join(__dirname, 'public'), {
    index: false
  }))
  .use(express.urlencoded({extended: true}))
  .use(bodyParser.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/test', (req, res) => res.render('pages/test', {users: ["John", "Paul", "Ringo"]}))
  .get('/', function(req, res) {
    console.log(path.join(__dirname, "/image1.jpeg"));
    res.render('pages/home');  
  })

  //loads log in page
  .get('/login', function(req, res) {
    res.render('pages/login');  
  })

  //loads signup page
  .get('/signup', function(req, res) {
    res.render('pages/signup');  
  })

  //loads checkout page
  .get('/checkout', function(req, res) {
    res.render('pages/checkout');  
  })

  .get('/editprofile', function(req, res) {
    res.render('pages/editprofile');  
  })

  // .get('/api/profiles', function(req, res) {
  //   res.json(profileList);
  // })

  .get('/api/profiles', async (req, res) => {
    try {
      console.log('HI');
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM profiles;');
      // const results = { 'results': (result) ? result.rows : null};
      console.log(result.rows);
      res.json(result.rows);// res.render('pages/', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  // /db is a debugging view into the complete order_table database table
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM profiles;');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  //Happens when user clicks login from login page. If info valid, take user to home page, if not, reload login page
  //Currently only checks whether anything has been put in. no database: no actual users
  .get('/signin', function(req, res) {
    try {
      const uName = req.query.username;
      const pWord = req.query.password;

      let login_info = {id: uName, password: pWord};

      if(validateLogin(username, password)){
        //begin Miguel back-end code:
        let query_text = "SELECT COUNT(*) FROM profiles WHERE id = " + uName + " AND password = " + pWord + ";";
        

        console.log("Logged in successfully, server-side checked");
        res.render('pages/home');
        console.log(path.join(__dirname, "/public/pictures/image1.jpeg"));
      }else{
        console.log("Login unsuccessful, failed validation on server side")
        res.render('pages/login');
      }
    } catch(err){
      console.log(err);
    }
  })

  //Happens when user submits info from signup page. If info is valid, take to edit profile page, if not, reload signup page
  //curretlyy only checks whether info is valid. no database: no actual users yet
  .get('/submitsignup', function(req, res) {
    const email = req.query.email;
    const username = req.query.username;
    const password = req.query.password;
    const reenteredpw = req.query.reenteredPassword;
    try{
      if(validateSignup(email, username, password, reenteredpw)){
        console.log("signup passes");
        res.render('pages/editprofile');  
      }else{
        console.log("signup failed")
  
        res.render('pages/signup');  
      }
    }catch(err){
      console.log(err);
    }
  })

  //loads confirmaion status page if information is valid. displays order details
  //if information is not valid, reloads checkout page
  .get('/process-checkout', function(req, res) {
    try{
      const fullname = req.query.fullname;
      const email = req.query.email;
      const street = req.query.address;
      const city = req.query.city;
      const state = req.query.state;
      const zip = req.query.zip;
      const cardname = req.query.cardname;
      const cardnumber = req.query.cardnumber;
      const expmonth = req.query.expmonth;
      const expyear = req.query.expyear;
      const cvv = req.query.cvv;

      let lastfour = cardnumber.toString().replace(/.(?=.{4})/g, 'x');

      let order_info = {
        name: fullname,
        email: email,
        street: street,
        city: city,
        state: state,
        zip: zip,
        lastfour: lastfour
      }

      if(validateFullName(fullname) && validateEmail(email) && (validateAddress(street, city, state, zip)), validateCardInfo(expmonth, cvv, expyear, cardnumber, cardname)){
        console.log("you're good");
        res.render('pages/confirmationstatus', order_info);
      }else{
        res.render('pages/checkout');  
      }
    }catch(err){
      console.log(err);
    }

  })
  

  .get('/submiteditprofile', function(req, res){
    const email = req.query.email;
    const firstname = req.query.firstname;
    const lastname = req.query.lastname;
    const username = req.query.username;
    const bio = req.query.bio;
    if(validateEditprofile(email, username, firstname, lastname, bio)){
      console.log("Validation failed, coming from server");
      res.render('pages/home');
    }else{
      console.log("Validation failed, coming from server")
      res.render('pages/editprofile');
    }

  })

  

  .get('/confirmationstatus', async (req, res) => {
    try {
      const client = await pool.connect();

      const result = await client.query('SELECT * FROM orders;');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/confirmationstatus', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .post("/submitsignup", function(req, res){
    try {
      const email = req.query.email;
      const username = req.query.username;
      const password = req.query.password;
      const re_enter = req.query.reenteredPassword;

      

      const client = await pool.connect();

      const result = await client.query("SELECT COUNT(*) AS count FROM profiles WHERE id = " + username + " OR email = " + email + ";");

      let count = (result) ? result.rows[0].count : null;
      
      if (count > 0) {
        throw "username or email not unique";
      }

      let query_text = "INSERT INTO profiles (id, email, password) VALUES ('";
      query_text += username + "', '" + email + "', '" + password + "';";

      const result = await client.query(query_text);
  

      if(validateSignup(email, username, password, re_enter)){
        console.log("Validation failed, coming from server");
        res.render('pages/home');
      }else{
        console.log("Validation failed, coming from server")
        res.render('pages/signup');
      }
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

//validate first name
function validateFullName(fullname){
    if(fullname.length > 0){
        return true;
    } else {
        return false;
    }
}

function validateEmail(email){
    let re = /\S+@\S+\.\S+/;
    if(re.test(email) === true){
        return true;
    } else {
        return false;
    }
}

function validateAddress(street, city, state, zip){
    if((street.length > 0 && city.length > 0
        && zip.length === 5) && !isNaN(zip) && state.length > 0){
        return true;
    } else {
        return false;
    }
}

function validateCardInfo(expMonth, cvv, expYear, cardnumber, cardname){
    if(!isNaN(expMonth) && expMonth.length == 2 &&
        cvv.length === 3 && !isNaN(cvv) &&
        expYear.length === 4 && !isNaN(expYear)
        && cardnumber.length === 16 && !isNaN(cardnumber)
        && cardname.length > 0){
        return true;
    } else {
        return false;
    }
}

function validateLogin(username, password) {
  let userNameValid = false;
  let passwordValid = false;
  
  if(username.length > 0){
    userNameValid = true;
  }
  if(password.length > 0){
    passwordValid = true;
  }

  if(userNameValid && passwordValid){
    let query_text = "SELECT COUNT(*) as count FROM profiles WHERE id = " + username + " AND password = " + password + ";"

    try {
      const client = await pool.connect();

      
      const result = await client.query(query_text);

      // get the new ID number returned from the INSERT query
      let count = (result) ? result.rows[0].count : null;
      if (count > 0){
        return true;
      }
      else{
        return false;
      }
      
   } catch (err) {
      console.error(err);
      res.send("Error " + err);
   }

  }else{
    return false;
  }
}


function validateSignup(email, username, password, reenteredpw){
  let userNameValid = false;
  let passwordValid = false;
  let emailValid = false;
  let rePasswordValid = false;
  let re = /\S+@\S+\.\S+/;
  if(username.length > 0){
    userNameValid = true;
  }
  if(password.length > 0){
    passwordValid = true;
  }
  if(username.length > 0){
    userNameValid = true;
  }
  if(re.test(email) === true){
    emailValid = true;
  } else {
    console.log("Email wrong, coming from server")
    emailValid = false;
  }
  if((password == reenteredpw)){
    rePasswordValid = true;
  }else{
    console.log("Entered passwords do not match: coming from server")
  }
  if(userNameValid && passwordValid && emailValid && rePasswordValid){
    return true;
  }else{
    return false;
  }
}

function validateEditprofile(email, username, firstname, lastname, bio){
  let emailValid = false;
  let firstNameValid = false;
  let lastNameValid = false;
  let userNameValid = false;
  let bioValid = false;
  let re = /\S+@\S+\.\S+/;

  if(username.length > 0){
    userNameValid = true;
  }
  if(firstname.length > 0){
    firstNameValid = true;
  }
  if(lastname.length > 0){
    lastNameValid = true;
  }
  if(re.test(email) === true){
    emailValid = true;
  } else {
    console.log("Email wrong, coming from server")
    emailValid = false;
  }
  if(bio.length > 0){
    bioValid = true;
  }
  if(emailValid && firstNameValid && lastNameValid && userNameValid && bioValid){
    return true;
  }else{
    return false;
  }

}



var profileList = [
                   { imageLink: "/pictures/2.jpeg", profilePictureLink: "/pictures/2.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/3.jpeg", profilePictureLink: "/pictures/3.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/4.jpeg", profilePictureLink: "/pictures/4.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/5.jpeg", profilePictureLink: "/pictures/1.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/6.jpeg", profilePictureLink: "/pictures/2.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/7.jpeg", profilePictureLink: "/pictures/3.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/8.jpeg", profilePictureLink: "/pictures/4.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/9.jpeg", profilePictureLink: "/pictures/1.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/10.jpeg", profilePictureLink: "/pictures/2.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/11.jpeg", profilePictureLink: "/pictures/3.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/12.jpeg", profilePictureLink: "/pictures/4.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/13.jpeg", profilePictureLink: "/pictures/1.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/14.jpeg", profilePictureLink: "/pictures/2.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/15.jpeg", profilePictureLink: "/pictures/3.jpeg", username: "nebiyou"},
                   { imageLink: "/pictures/16.jpeg", profilePictureLink: "/pictures/4.jpeg", username: "nebiyou"},
                   
                 ];
