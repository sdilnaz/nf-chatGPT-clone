import { NextFunction, Request, Response } from 'express';

const logger = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    console.log(
      `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} ${
        res.statusCode
      }`
    );
  });
  next();
};

export { logger };
// import { Request, Response, NextFunction } from 'express';

// export const logger = (req: Request, res: Response, next: NextFunction) => {
// 	console.log(`${req.method} ${req.url}`);
// 	next();
// };