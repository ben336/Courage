//For right now just check that it passes an object along acceptably
var passportconfig = require("../src/passportconfig");

describe("Passport Configurer", function() {
  it("returns a passport instance", function() {
    expect(passportconfig.configuredpassport).toBeDefined();
  });
});