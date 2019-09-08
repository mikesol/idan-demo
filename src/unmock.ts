import { ExtendedValue, step2, step1 } from "./";
import nock from "nock";
import fc from "fast-check";
const hack: {
  url: string;
  method: "get" | "post";
  path: string;
  code: number;
  res: ExtendedValue;
}[] = [];
type Operation = (
  path: string
) => {
  reply: (code: number, res: ExtendedValue) => void;
};
type Unmock = (
  url: string
) => {
  get: Operation;
  post: Operation;
};

const curryOp = (url: string, method: "get" | "post") => (path: string) => ({
  reply: (code: number, res: ExtendedValue) => {
    hack.push({ url, method, path, code, res });
  }
});

const out: Unmock = (url: string) => ({
  get: curryOp(url, "get"),
  post: curryOp(url, "post")
});

export const runner = async (f: () => Promise<boolean>) => {
  await fc.assert(
    await fc.asyncProperty(step2(step1(hack[0].res)), async p => {
      nock(hack[0].url)
        [hack[0].method](hack[0].path)
        .reply(hack[0].code, p);
      spy.response.body = p;
      return await f();
    })
  );
};

export const spy: {
  response: {
    body: any
  }
}= {
  response: {
    body: {}
  }
};

export default out;
