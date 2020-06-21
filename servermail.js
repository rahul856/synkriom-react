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
  cert: hscert,
};

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kshitijsaxenaingram@gmail.com",
    type: "OAuth2",
    clientId:
      "812477234206-jdkt5uhe2lkp4q7lsfmrc6h87re4gkjo.apps.googleusercontent.com",
    clientSecret: "FcY-jydLRriCoACsieNYbDv4",
    refreshToken:
      "1//04d_zfXOhU8iVCgYIARAAGAQSNwF-L9IruOtSxPIBbeBGrFamthZFywgLCudBSrD03UDRC-NqGBWnzytEtpvCbdSXMMo71z2903E",
  },
  debug: true, // show debug output
  logger: true, // log information in cons
});

app.use(express.json());
app.use(express.urlencoded());
//app.use(express.multipart());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
var allowedOrigins = ["https://*:5000", "https://*:3000", "https://*:5001"];

app.use(
  express.json(),
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      return callback(null, true);
    },
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
    subject: "Interview Details",
    html: message,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: "fail",
      });
    } else {
      res.json({
        msg: "success",
      });
    }
  });
});

var server = https.createServer(options, app);
server.listen(5001, function () {
  console.log("HTTPS Express server is up!");
});
