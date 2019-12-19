const nodemailer = require("nodemailer");
var cors = require("cors");
var express = require("express");
var app = express();
var https = require("https");
var fs = require("fs");

var hskey = fs.readFileSync("key.pem");
var hscert = fs.readFileSync("cert.pem");

var options = {
  key: hskey,
  cert: hscert
};

var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "kshitijsaxenaingram@gmail.com",
    pass: "understand0"
  },
  debug: true, // show debug output
  logger: true // log information in cons
});

var allowedOrigins = ["https://localhost:5000", "https://localhost:3000"];

app.use(
  express.json(),
  cors({
    origin: function(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
);

app.post("/send", (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.messageHtml;
  console.log("Email Details", name, email, message);
  var mail = {
    from: name,
    to: email,
    subject: "Hello Contact form request",
    html: message
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: "fail"
      });
    } else {
      res.json({
        msg: "success"
      });
    }
  });
});

var server = https.createServer(options, app);
server.listen(5000, function() {
  console.log("HTTPS Express server is up!");
});