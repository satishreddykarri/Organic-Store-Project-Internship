const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const JSONParser = bodyParser.json();
const server = "127.0.0.1:27017";
const db = "newdatabase";
const port = 3000;
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoURI = 'mongodb://localhost:27017/newdatabase';
app.get('/', function (req, res) {
  res.send('Hello World from newdatabase');
});

mongoose.connect(mongoURI, {})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});
const EmailSchema = new mongoose.Schema({
  email: String
});

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});
const DetailSchema = new mongoose.Schema({
  name: String,
  email: String,
  website: String,
  message: String
});

const Detail = mongoose.model('Detail', DetailSchema);
const User = mongoose.model('User', UserSchema);
const Email = mongoose.model('Email', EmailSchema);
const Contact = mongoose.model('Contact', ContactSchema);

app.get('/', (req, res) => {
  res.send('Hello World');
  console.log("Hello WOrld")
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate inputs
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    // Delete all existing users
    await User.deleteMany({});

    // Create a new user instance
    const newUser = new User({
      email,
      password // Save hashed password
    });

    // Save new user to database
    await newUser.save();
    console.log('New user data saved to MongoDB');
    res.status(201).send("Sign-up successful!");
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).send(`Error signing up user: ${error.message}`);
  }
});


app.post("/signin", JSONParser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && bcrypt.compare(req.body.password, user.password)) {
      console.log("Sign-in successful");
      res.send("Sign-in successful");
    } else {
      console.log("Sign-in failed");
      res.send("Sign-in failed");
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.send("Error during sign-in");
  }
});

app.post("/submitemail", JSONParser, async (req, res) => {
  try {
    const newEmail = new Email({ email: req.body.email });
    await newEmail.save();
    console.log('Email saved to MongoDB');
    res.send("Email stored successfully!");
  } catch (error) {
    console.error('Error storing email:', error);
    res.send("Error storing email");
  }
});

app.post("/contact", JSONParser, async (req, res) => {
  try {
    const newContact = new Contact({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message
    });

    await newContact.save();
    console.log('Contact data saved to MongoDB');
    res.send("Contact details stored successfully!");
  } catch (error) {
    console.error('Error storing contact details:', error);
    res.send("Error storing contact details");
  }
});
app.post("/submitdetails", async (req, res) => {
  console.log("got data:::", req.body);
  const newDetail = new Detail({
    name: req.body.name,
    email: req.body.email,
    website: req.body.website,
    message: req.body.message
  });

  newDetail.save()
    .then(() => {
      console.log('Save Detail data at MongoDB');
      res.send("Details submitted successfully!");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error submitting details");
    });
});
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});