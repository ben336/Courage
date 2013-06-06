/**
  Contains the url for the google authentication.
  Currently set for local testing, will need to be changed for production
  Probably want to automate this, or at least contain the host name in a central
  properties file and then set it up here based on that
**/
exports.googleconfig = {
  returnURL: "http://localhost:3000/auth/google/return",
  realm: "http://localhost:3000/"
};