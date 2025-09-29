import type { Context } from 'hono';

import { HttpException } from '../exception/HttpException';

export interface ErrorFilter {
  filter(err: Error, _c: Context): Response;
}

export const AppErrorFilterSymbol: symbol = Symbol.for('AppErrorFilter');

export class AppErrorFilter implements ErrorFilter {
  public filter(err: Error, _c: Context): Response {
    let message: string = 'Internal Server Error';
    let status: number = 500;

    if (err instanceof HttpException) {
      message = err.message;
      status = err.status;
    } else {
      // eslint-disable-next-line no-console
      console.log(err);
    }

    return new Response(
      JSON.stringify({
        message,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status,
      },
    );
  }
}
