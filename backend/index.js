const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;

  console.log(` Master PID: ${process.pid}`);
  console.log(` Starting ${cpuCount} backend workers...\n`);

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`❌ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  require("./server");
}
