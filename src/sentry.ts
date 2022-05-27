import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
const release = isGitSync() ? execSync('git rev-parse HEAD').toString().trim() : new Date().toString();

function isGitSync() {
  return fs.existsSync(path.resolve('') + '/.git');
}

function sentry(app, sentryToken: string) {
  Sentry.init({
    dsn: sentryToken,
    integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
    release,
    tracesSampleRate: 1.0,
  });
}

export default sentry;
