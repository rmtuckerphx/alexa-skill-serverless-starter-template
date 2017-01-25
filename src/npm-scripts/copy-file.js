const cp = require('cp');
const src = process.argv[2];
const dest = process.argv[3];

console.log('copying file from ' + src + ' to ' + dest );
cp.sync(src, dest);