const mongoose = require('mongoose'),
  validator = require('validator'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken');

  const userSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
        trim: true
      },
      lastName: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error('Email is invalid');
          }
        }
      },
      password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
          if (value.toLowerCase().includes('password')) {
            throw new Error('Password cannot be password.');
          }
          if (value.length < 6) {
            throw new Error('Password must be at least 6 characters.');
          }
        }
      },
      admin: {
        type: Boolean,
        required: true,
        default: false
      },
      tokens: [
        {
          token: {
            type: String,
            required: true
          }
        }
      ],
      avatar: {
        type: String
      }
    },
    {
      timestamps: true
    }
  )

  userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
  };

  userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
      {
        _id: user._id.toString(),
        name: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
  };

  userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid password, try again.');
    return user;
  };

  userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password'))
      user.password = await bcrypt.hash(user.password, 8);
    next();
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;