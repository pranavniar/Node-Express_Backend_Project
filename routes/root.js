const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname,"..", "views", "index.html"));
});

module.exports = router;

// router.get("/new-page(.html)?", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
// });

// router.get("/old-page(.html)?", (req, res) => {
//   res.redirect(301, "/new-page.html");
// });

// //Chaining rout handlers
// router.get(
//   "/hello(.html)?",
//   (req, res, next) => {
//     console.log("attempted to load hello.html");
//     next();
//   },
//   (req, res) => {
//     res.send("Hello World");
//   }
// );

// //another example
// const one = (req, res, next) => {
//   console.log("hello");
//   next();
// };

// const two = (req, res, next) => {
//   console.log("hello2");
//   next();
// };

// const three = (req, res) => {
//   console.log("hello3");
//   res.send("Chaining Example");
// };

// router.get("/chain(.html)?", [one, two, three]);