import type { Request, Response } from 'express';

import Core from 'chatgpt-as-a-backend/core';

export type Options = {
  apiKey: string;
};

export default function (options: Options) {
  const { apiKey } = options;
  const backend = new Core({ apiKey });

  return async function (req: Request, res: Response) {
    const endpoint = req.path.split('/').pop();
    const context = req.query.context || req.body.context;

    if (typeof endpoint === 'undefined') {
      res.status(400).send('No endpoint specified');
      return;
    }

    const response = await backend.sendRequest({
      endpoint,
      context,
    });

    res.send(response);
  };
}
