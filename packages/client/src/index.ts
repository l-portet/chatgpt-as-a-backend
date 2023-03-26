export default function Client({ context, url = '' }) {
  return new Proxy(this, {
    // @ts-ignore
    get(target: string, prop: string, receiver) {
      return async (...args) => {
        const argsStr = args.map((arg) => JSON.stringify(arg)).join(', ');
        const endpoint = encodeURIComponent(`${prop}(${argsStr})`);
        const payload = { context };

        const response = await fetch(`${url}/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        return await response.json();
      };
    },
  });
}
