/**
 * Created by bin.shen on 4/17/16.
 */

var cluster = require('cluster');
var os = require('os');

var cpuCount = os.cpus().length;
console.log('spanning %d instances of app.js', cpuCount)

cluster.setupMaster({ exec: 'app.js' })

for (var i = 0; i < cpuCount; i++) {
    fork();
}

function fork() {
    var worker = cluster.fork()

    worker.on('exit', function (code, signal) {
        if (signal) {
            console.log('instance %d was killed by signal %d', worker.id, signal)
        } else if (0 !== code) {
            console.log('instance %d died with error code %d', worker.id, code)
        } else {
            console.log('instance %d exited, clean exit', worker.id)
        }
        setTimeout(fork, 2000)
    })
}
