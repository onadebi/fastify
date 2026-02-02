import { buildApp } from "./app";
import appsettings from "./common/config/appsettings";

const start = async () => {
  const app = await buildApp();

  const os = require('os');
  const cpuCount = os.cpus().length;
  const maxCPU = !process.env.MAX_CPU_USAGE || Number.isNaN(Number(process.env.MAX_CPU_USAGE)) ?  2: Number(process.env.MAX_CPU_USAGE);
  
  console.info(`\n✅ Runninng on max: [${maxCPU}] of [${cpuCount}] VCPU`)
  app.listen({ port: appsettings.port }, () =>
    console.log(`🚀 Running → http://localhost:${appsettings.port}\n📃 Docs → /docs\n`)
  );
};

start();
