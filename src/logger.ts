import format from 'date-fns/format';
import chalk from 'chalk';
import { Logtail } from '@logtail/node';

function log({ logTailToken, resource }) {
  return function (req, res, next) {
    const logtail = new Logtail(logTailToken);

    const date = format(new Date(), 'PPpp');
    const dateRequest = [date, '-', req.method, req.originalUrl].join(' ');
    const body = JSON.stringify(req.body, null, 4);
    if (process.env.NODE_ENV === 'production') {
      logtail.info(dateRequest, { resource });
      logtail.info(body, { resource });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(chalk.blueBright(dateRequest));
      console.log(chalk.whiteBright(body));
    }

    next();
  };
}

export default log;
