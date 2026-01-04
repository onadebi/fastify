const os = require('os');
const cpuCount = os.cpus().length;
const maxCPU = !process.env.MAX_CPU_USAGE || Number.isNaN(Number(process.env.MAX_CPU_USAGE)) ?  2: Number(process.env.MAX_CPU_USAGE);
console.info(`Runninng on max of ${maxCPU} VCPU !!!`)
module.exports = {
    apps: [{
        name: 'onaxerp',
        script: './dist/server.js',
        // Smart: Use available CPUs, don't exceed
        instances: Math.min(maxCPU, cpuCount), // To use all CPU cores set as 'max'
        exec_mode: 'cluster', // Set to 'cluster' if using multiple instances
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        max_memory_restart: '200M', //Conservative at 200 || Comfortable at 500M
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        autorestart: true,
        watch: false,
        merge_logs: true
    }]
};