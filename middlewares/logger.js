function log(req, res, next) {
  console.log("Logging working........");
  next();
}
module.exports = log;
