const childProcess = require('child_process');

console.log('Running translation maintenance task')
let cmd = "";
if (process.platform === 'win32') {
	cmd = "set NODE_ENV=production&& babel ./src >NUL";
} else {
	cmd = "NODE_ENV=production babel ./src --out-file /dev/null";
}
const exec = childProcess.exec;
let extractMessagesProcess = exec(cmd);
extractMessagesProcess.stdout.on('data', function (data) {
	console.log(data);
});
