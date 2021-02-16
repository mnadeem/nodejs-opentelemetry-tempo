import log4js from 'log4js';

log4js.configure(
    {
      appenders: {
        file: {
          type: 'file',
          filename: process.env.LOG_FILE_NAME,
          //pattern: 'yyyy-MM-dd-hh',
          maxLogSize: 10 * 1024 * 1024, // = 10Mb
          backups: 5, // keep five backup files
          compress: true, // compress the backups
          encoding: 'utf-8',
          mode: 0o0640,
          flags: 'w+'
        },
        console: {
            type: 'console'
        }
      },
      categories: {
        default: { appenders: ['file', 'console'], level: 'trace' }
      }
    }
  );