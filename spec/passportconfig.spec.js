/*
For right now just check that it passes an object along acceptably
*/
var passportconfig;

passportconfig = require("../src/passportconfig");

describe("Passport Configurer", function() {
  return it("returns a passport instance", function() {
    return expect(passportconfig.configuredpassport).toBeDefined();
  });
});


