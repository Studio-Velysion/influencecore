// Configuration PM2 pour gérer l'application en production
// Installation: npm install -g pm2
// Utilisation: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'influencecore',
      script: 'npx',
      args: 'next start -H 0.0.0.0',
      cwd: '/var/www/influencecore',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/influencecore/error.log',
      out_file: '/var/log/influencecore/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
      ignore_watch: ['node_modules', '.git', '*.log'],
    },
  ],
}

