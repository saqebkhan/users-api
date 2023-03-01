
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");
mongoose.set('strictQuery', false);
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

const uri =
  "mongodb+srv://saqebk619:CPaY1H7lWRrwuu3T@cluster12.jdw95pj.mongodb.net/usersData?retryWrites=true&w=majority";
// Replace <username>, <password>, <cluster-url>, and <database-name> with your own credentials

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB Atlas", err);
  });

// Define the User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  city: String,
  createdBy: String,
  createdAt: Date,
  paymentStatus: Boolean,
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Middleware to parse request body as JSON
app.use(bodyParser.json());

// Endpoint to create a new user
app.post("/users", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    city: req.body.city,
    createdBy: req.body.createdBy,
    createdAt: new Date(),
    paymentStatus: req.body.paymentStatus,
  });

  try {
    await user.save();
    res.send("User created");
  } catch (err) {
    res.status(500).send(err);
  }
});

// Endpoint to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Endpoint to get a specific user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Endpoint to update a specific user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      user.name = req.body.name;
      user.email = req.body.email;
      user.phone = req.body.phone;
      user.city = req.body.city;
      user.createdBy = req.body.createdBy;
      user.paymentStatus = req.body.paymentStatus;
      user.save();
      res.send("User updated");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Endpoint to delete a specific user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      await user.delete();
      res.send("User deleted");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log("listeng at 3000");
});

module.exports = app;