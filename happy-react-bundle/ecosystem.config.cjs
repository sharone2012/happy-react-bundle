'use strict';
module.exports = {
  apps: [{
    name        : 'cfi-api',
    script      : './server.cjs',
    cwd         : '/home/ec2-user/backend',
    instances   : 1,
    autorestart : true,
    watch       : false,
    max_memory_restart: '400M',
    env: {
      NODE_ENV : 'production',
      PORT     : 3001,
    },
  }],
};
