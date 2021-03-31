import log4js from 'log4js';

log4js.configure(
  {
    appenders: {
      file: {
        type: 'file',
        layout: {
          type: 'pattern',
          pattern: '%d %h %f:%l (%z) %p %c - %m %s',          
        },
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
        type: 'console',
        layout: {   // https://github.com/log4js-node/log4js-node/blob/master/docs/layouts.md
          type: 'pattern',
          pattern: '%[%d %h %z %x{traceId} %f:%l %p %c -%] %m %s',
          tokens: {
            //pid: function () {return process.pid; },
            traceId: function(logEvent) {
              return 'xyz';
            }
          }
        },
      }
    },
    categories: {
      default: { appenders: ['file', 'console'], level: 'trace', enableCallStack: true}
    }
  }
);

export const connectLogger =  (logger) => log4js.connectLogger(logger, {
  level: 'auto',
  nolog: ['/metrics', '/favicon.ico'],
  // include the Express request ID in the logs
  format: (req, res, format) => format(`:remote-addr - traceID=${req.traceId} - ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent"`)
})