module.exports = {
  apps: [
    // Backend API
    {
      name: 'ghumo-phiro-backend',
      script: 'dist/app.js',
      cwd: '/var/www/ghumo-phiro/backend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: '/var/www/ghumo-phiro/backend/logs/pm2-error.log',
      out_file: '/var/www/ghumo-phiro/backend/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      watch: false
    },
    // Frontend Next.js (Standalone Mode)
    {
      name: 'ghumo-phiro-frontend',
      script: '.next/standalone/server.js',
      cwd: '/var/www/ghumo-phiro/frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0'
      },
      error_file: '/var/www/ghumo-phiro/frontend/logs/pm2-error.log',
      out_file: '/var/www/ghumo-phiro/frontend/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      watch: false
    }
  ]
}
