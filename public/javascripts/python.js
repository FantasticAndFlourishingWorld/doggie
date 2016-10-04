var cp = require('child_process');

var sniffer = cp.spawn('python', ['../py/sniffer.py']);

sniffer.stderr.setEncoding('utf8');
sniffer.stderr.on('data', function (err) {
  console.log(err);
});
sniffer.stdout.on('data', function (data) {
  console.log(data.toString());
});
sniffer.on('exit', function (code) {
  // console.log(code);
});
