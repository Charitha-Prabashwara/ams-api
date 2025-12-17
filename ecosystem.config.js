module.exports = {
  apps: [
    {
      name: "ams-api",
      script: process.env.NODE_ENV === "production" ? "build/app.js" : "src/server.js",
      instances: 1,
      fork: true,
      autorestart: true,
      max_memory_restart: "200M",
      watch: false, 
      env: {
        NODE_ENV: "development",
        PORT: 8080,
        WATCH: true
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8080,
        WATCH: false
      },
      watch: process.env.NODE_ENV === "development" 
    }
  ]
};
