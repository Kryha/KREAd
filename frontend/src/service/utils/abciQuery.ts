export const abciQuery = (node: string, path: string, height?: number) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'abci_query',
      params: { path, height: height && height.toString() }, // height must be a string (bigint)
    }),
  };

  return fetch(node, options)
    .then((res) => res.json())
    .then((d) => d.result.response.value && JSON.parse(atob(d.result.response.value)));
};