
var xss = require('xss');

var html = xss('<script>alert("xss test");</script>');
console.log(html);