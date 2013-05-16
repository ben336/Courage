#For right now just check that it passes an object along acceptably
passportconfig = require "../src/passportconfig"

describe "Passport Configurer", ->
  it "returns a passport instance", ->
    expect(passportconfig.configuredpassport).toBeDefined()
