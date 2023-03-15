export const DEFAULT_NODE_URL = "http://localhost:26657";

export type AbciQueryResponse = {
  children?: string[];
  value?: string;
};

export const abciQuery = async (path: string, nodeUrl: string = DEFAULT_NODE_URL): Promise<AbciQueryResponse> => {
  const options = {
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "abci_query",
      params: { path },
    }),
  };

  try {
    const result = await fetch(nodeUrl, options);
    const data = await result.json();

    return JSON.parse(atob(data.result.response.value));
  } catch (error) {
    console.error(`Error occured at abciQuery(): ${error}`);

    return { children: [], value: "" };
  }
};

export const getChildren = async (path: string): Promise<string[]> => {
  const { children } = await abciQuery(`/custom/vstorage/children/${path}`);

  if (!children) {
    return [];
  }

  const allPaths: string[] = [];

  await Promise.all(
    children.map(async (key: string) => {
      const subPath = path === "" ? key : `${path}.${key}`;
      allPaths.push(subPath);

      const subPaths = await getChildren(subPath);
      allPaths.push(...subPaths);
    })
  );

  return allPaths;
};

export const getChildData = async (child: string): Promise<string[]> => {
  const { value } = await abciQuery(`/custom/vstorage/data/${child}`);

  if (!value) {
    return [];
  }

  const { values } = JSON.parse(value);
  const data: string[] = [];

  values.map((v: string) => {
    let decoded = JSON.parse(v);
    decoded = JSON.parse(decoded.body);
    data.push(decoded);
  });

  return data;
};
