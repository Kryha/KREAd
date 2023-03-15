import { abciQuery, getChildren, getChildData, DEFAULT_NODE_URL } from "./vstorage";

const setupFetchMock = (getResponseValue: (path: string) => string) => {
  global.fetch = jest.fn((_, { body }) => {
    const requestBody = JSON.parse(body);
    const { path } = requestBody.params;
    const responseValue = getResponseValue(path);

    return Promise.resolve({
      json: () =>
        Promise.resolve({
          result: {
            response: {
              value: responseValue,
            },
          },
        }),
    });
  }) as any;
};

describe("abciQuery", () => {
  beforeEach(() => {
    setupFetchMock(() => btoa(JSON.stringify({ value: "mock data" })));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("calls fetch with the correct parameters", async () => {
    await abciQuery("/custom/vstorage/children/path");

    expect(fetch).toHaveBeenCalledWith(DEFAULT_NODE_URL, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "abci_query",
        params: { path: "/custom/vstorage/children/path" },
      }),
    });
  });

  it("returns the expected data", async () => {
    const result = await abciQuery("/custom/vstorage/children/path");

    expect(result).toEqual({ value: "mock data" });
  });

  it("returns a default value when an error occurs", async () => {
    global.fetch = jest.fn(() => Promise.reject("error")) as any;

    const result = await abciQuery("/custom/vstorage/children/path");

    expect(result).toEqual({ children: [], value: "" });
  });
});

describe("getChildren", () => {
  beforeEach(() => {
    setupFetchMock((path) => {
      let value: any;

      if (path === "/custom/vstorage/children/path") {
        value = { children: ["child1", "child2"] };
      } else if (path === "/custom/vstorage/children/path.child1") {
        value = { children: ["subchild1", "subchild2"] };
      } else {
        value = { children: [] };
      }

      return btoa(JSON.stringify(value));
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns the expected children", async () => {
    const children = await getChildren("path");

    expect(children).toEqual(["path.child1", "path.child2", "path.child1.subchild1", "path.child1.subchild2"]);
  });

  it("returns an empty array if there are no children", async () => {
    const children = await getChildren("path/without/children");

    expect(children).toEqual([]);
  });
});

describe("getChildData", () => {
  beforeEach(() => {
    setupFetchMock((path) => {
      let value: any;

      if (path === "/custom/vstorage/data/child") {
        value = {
          value: JSON.stringify({
            values: [
              JSON.stringify({ body: JSON.stringify({ data: "mock data 1" }) }),
              JSON.stringify({ body: JSON.stringify({ data: "mock data 2" }) }),
            ],
          }),
        };
      } else {
        value = {};
      }

      return btoa(JSON.stringify(value));
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns the expected child data", async () => {
    const data = await getChildData("child");

    expect(data).toEqual([{ data: "mock data 1" }, { data: "mock data 2" }]);
  });

  it("returns an empty array if there is no value", async () => {
    setupFetchMock(() => btoa(JSON.stringify({})));

    const data = await getChildData("no.data.child");

    expect(data).toEqual([]);
  });
});
