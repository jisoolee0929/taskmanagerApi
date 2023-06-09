const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: {
    type: Number,
    default: 20,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be positive number');
      }
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('Email is not valid');
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password can not includes password');
      }
    },
  },
  tokens: [{
    token: {
      type: String,
      required: true,

    }
  }],
  avatar: {
    type:Buffer
  }
},{
  timestamps:true
});


userSchema.pre('remove', async function(next) {
  const user= this
  await Task.deleteMany({owner:user._id})

  next()
})


userSchema.virtual('tasks',{
  ref:'Tasks',
  localField:'_id',
  foreignField:'owner'
})

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({token})
  user.save()
  return token
};

userSchema.methods.toJSON =  function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar
  return userObject
}


userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error('Un able to Login');
  }

  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Un able to Login');
  }

  return user;
};

userSchema.pre('save', async function (next) {
  const user = this;

  console.log('Before Saving');

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
