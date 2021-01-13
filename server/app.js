require('./db/config/index');

const express = require('express'),
  app = express(),
  openRouter = require('./routes/open/index'),
  userRouter = require('./routes/secure/users'),
  passport = require('./middleware/authentication/index'),
  // fileUpload = require('express-fileupload'),
  cookieParser = require('cookie-parser'),
  path = require('path');

app.use(express.json());

//Unauthenticated routes
app.use('/', openRouter);

//Middleware to parse through incoming cookies in the requests.
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
}

//Authenticated Routes
app.use('/api/*', passport.authenticate('jwt', { session: false }));
app.use('/api/users', userRouter);


if (process.env.NODE_ENV === 'production') {
  // Handle React routing, return all requests to React app
  app.get('*', (request, response) => {
    response.sendFile(
      path.resolve(__dirname, '..', 'client', 'build', 'index.html')
    );
  });
}


module.exports = app;