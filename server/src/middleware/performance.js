const winston = require('winston');

const performanceLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'performance.log' }),
  ],
});

const performanceMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    const memoryUsage = process.memoryUsage();

    performanceLogger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: durationInMilliseconds,
      memoryUsage: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
      },
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`${req.method} ${req.path} - ${durationInMilliseconds.toFixed(2)}ms`);
    }
  });

  next();
};

const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

module.exports = performanceMiddleware;