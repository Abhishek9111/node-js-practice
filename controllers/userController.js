const asyncHandler = require("express-async-handler"); //handles the erorrs and reduces effort by helping avoid the try catch block
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email }); //checks if email exists in database
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  //hashpassword
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res
      .status(201)
      .json({ _id: user.id, email: user.email, username: user.username });
  } else {
    res.status(401);
    throw new Error("User creation failed");
  }
});

// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     res.status(400);
//     throw new Error("Please fill both the fields");
//   }
//   const checkEmail = await User.findOne(email);
//   if (!checkEmail) {
//     res.status(400);
//     throw new Error("User doesn't exist");
//   }

//   if (checkEmail && (await bcrypt.compare(password, user.password))) {
//     const accessToken = jwt.sign(
//       {
//         user: {
//           username: checkEmail.username,
//           email: checkEmail.email,
//           id: checkEmail.id,
//         },
//       },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: "1m" }
//     );
//     res.status(200).json({ accessToken });
//   } else {
//     res.status(400);
//     throw new Error("Incorrect password");
//   }
// });

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

const currentUser = asyncHandler(async (req, res) => {
  res.json({ message: " current user" });
});

module.exports = { registerUser, currentUser, loginUser };
