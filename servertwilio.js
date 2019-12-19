require("dotenv").config();

var express = require("express");
var cors = require("cors");
var faker = require("faker");
var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
var ChatGrant = AccessToken.ChatGrant;
var https = require("https");
var fs = require("fs");
var hskey = fs.readFileSync("key.pem");
var hscert = fs.readFileSync("cert.pem");
var bodyParser = require("body-parser");
var options = {
  key: hskey,
  cert: hscert
};
var app = express();
var allowedOrigins = ["https://localhost:5000", "https://localhost:3000"];

app.use(
  express.json(),
  cors({
    origin: function(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      return callback(null, true);
    }
  })
);

// Endpoint to generate access token
app.get("/token", function(request, response) {
  var identity = faker.name.findName();

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  // Assign the generated identity to the token
  token.identity = identity;

  const grant = new VideoGrant();
  // Grant token access to the Video API features
  token.addGrant(grant);
  console.log("Video Token", token);
  // Serialize the token to a JWT string and include it in a JSON response
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.post("/chat/token", function(request, response) {
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );
  // Create a unique ID for the client on their current device
  const endpointId = "Rahul1234567";
  var chat_grant = new ChatGrant({
    serviceSid: process.env.TWILIO_CHAT_SERVICE_SID,
    endpointId: endpointId
  });
  token.addGrant(chat_grant);
  token.identity = request.identity;
  console.log("Chat Token", token);
  response.set("Content-Type", "application/json");
  // Serialize the token to a JWT string and include it in a JSON response
  response.send(
    JSON.stringify({
      identity: identity,
      token: token.toJwt()
    })
  );
  
}
var server = https.createServer(options, app);
server.listen(5000, function() {
  console.log("HTTPS Express server is up!");
});
