import { ExtendedValue, step2, step1 } from "./";
import nock, { Body } from "nock";
import fc from "fast-check";
import { ReplyBody } from "nock";
import { JSONValue } from "json-schema-strictly-typed";
type Middleware = (uri: string, body: Body, reply: JSONValue) => JSONValue;
const hack: {
  url: string;
  method: "get";
  path: string | RegExp;
  code: number;
  middleware: Middleware;
  res: ExtendedValue;
}[] = [];
type Operation = (
  path: string | RegExp
) => {
  reply: (code: number, res: ExtendedValue, middleware?: Middleware) => void;
};
type Unmock = (
  url: string
) => {
  get: Operation;
};

const curryOp = (url: string, method: "get") => (path: string | RegExp) => ({
  reply: (
    code: number,
    res: ExtendedValue,
    middleware: Middleware = (_, __, i) => i
  ) => {
    hack.push({ url, method, path, code, res, middleware });
  }
});

const out: Unmock = (url: string) => ({
  get: curryOp(url, "get")
});

export const runner = async <U>(
  a: fc.Arbitrary<U>,
  f: (u: U) => Promise<boolean>
) => {
  await fc.assert(
    await fc.asyncProperty(a, step2(step1(hack[0].res)), async (z, p) => {
      nock(hack[0].url)
        [hack[0].method](hack[0].path)
        .reply(hack[0].code, (uri: string, body: Body) => {
          const out = hack[0].middleware(uri, body, p);
          spy.response.body = out;
          return out;
        });
      return await f(z);
    })
  );
};

export const spy: {
  response: {
    body: any;
  };
} = {
  response: {
    body: {}
  }
};

export default out;
