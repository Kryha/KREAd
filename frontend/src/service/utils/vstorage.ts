const abciQuery = async (path: string, height?: number, node: string = "http://localhost:26657") => {
  const options = {
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "abci_query",
      params: { path, height: height && height.toString() }, // height must be a string (bigint)
    }),
  };

  const res = await fetch(node, options);
  const d = await res.json();

  return d.result.response.value && JSON.parse(atob(d.result.response.value));
};

export const getChildren = async (path: string) => {
  const { children: keys } = await abciQuery(`/custom/vstorage/children/${path}`);
  const allPaths: string[] = [];

  await Promise.all(
    keys.map(async (key: string) => {
      const subPath = path === "" ? key : `${path}.${key}`;
      allPaths.push(subPath);

      const subPaths = await getChildren(subPath);
      allPaths.push(...subPaths);
    })
  );

  return allPaths;
};

export const getChildData = async (child: string) => {
  const rawData = await abciQuery(`/custom/vstorage/data/${child}`);
  const { values } = JSON.parse(rawData.value);
  const data: string[] = [];

  values.map((v: string) => {
    let decoded = JSON.parse(v);
    decoded = JSON.parse(decoded.body);
    data.push(decoded);
  });

  return data;
};
