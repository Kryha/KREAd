type AbciQueryResponse = {
  children?: string[];
  value?: string;
};

const abciQuery = async (path: string, node: string = "http://localhost:26657"): Promise<AbciQueryResponse> => {
  const options = {
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "abci_query",
      params: { path },
    }),
  };

  const res = await fetch(node, options);
  const d = await res.json();

  return JSON.parse(atob(d?.result?.response?.value));
};

export const getChildren = async (path: string): Promise<string[]> => {
  const { children: keys } = await abciQuery(`/custom/vstorage/children/${path}`);

  if (!keys) {
    return [];
  }

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

export const getChildData = async (child: string): Promise<string[]> => {
  const rawData = await abciQuery(`/custom/vstorage/data/${child}`);

  if (!rawData.value) {
    return [];
  }

  const { values } = JSON.parse(rawData.value);
  const data: string[] = [];

  values.map((v: string) => {
    let decoded = JSON.parse(v);
    decoded = JSON.parse(decoded.body);
    data.push(decoded);
  });

  return data;
};
