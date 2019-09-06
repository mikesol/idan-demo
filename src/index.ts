import { FastCheckSchema_, makeArbitrary } from "json-schema-fast-check";
import {
  JSONPrimitive,
  JSONArray,
  JSONObject,
  JSONSchemaObject,
  JSSTEmpty,
  JSONValue,
  JSSTTuple
} from "json-schema-strictly-typed";
import { extendT } from "json-schema-poet";
import fc from "fast-check";
import * as io from "io-ts";

export const US: unique symbol = Symbol();
const _v = (u: unknown): u is Unmock =>
  typeof u === "object" && (<any>u).unmock === US;
const Unmock: io.Type<Unmock, Unmock> = new io.Type<Unmock, Unmock>(
  "Unmock",
  _v,
  (input, context) =>
    _v(input) ? io.success(input) : io.failure(input, context),
  io.identity
);
type Unmock = {
  unmock: typeof US;
};
const JSO = JSONSchemaObject(JSSTEmpty(Unmock), Unmock);

type ExtendedPrimitive =
  | JSONPrimitive
  | JSONSchemaObject<JSSTEmpty<Unmock>, Unmock>;
const ExtendedPrimitive = io.union([JSONPrimitive, JSO]);
export declare type ExtendedValue =
  | ExtendedPrimitive
  | JSONArray
  | JSONObject
  | ExtendedArray
  | ExtendedObject;
const ExtendedValue: io.Type<ExtendedValue, ExtendedValue> = io.recursion(
  "ExtendedValue",
  () =>
    io.union([
      ExtendedPrimitive,
      JSONArray,
      JSONObject,
      ExtendedObject,
      ExtendedArray
    ])
);
export declare type ExtendedObject = {
  [k: string]: ExtendedValue;
};
const ExtendedObject: io.Type<ExtendedObject, ExtendedObject> = io.recursion(
  "ExtendedObject",
  () => io.record(io.string, ExtendedValue)
);
const ExtendedArray: io.Type<ExtendedArray, ExtendedArray> = io.recursion(
  "ExtendedArray",
  () => io.array(ExtendedValue)
);

export const poet = extendT<JSSTEmpty<Unmock>, Unmock>({
  unmock: US
});
export interface ExtendedArray extends Array<ExtendedValue> {}

export const step1 = (
  e: ExtendedValue
): JSONSchemaObject<JSSTEmpty<Unmock>, Unmock> =>
  JSO.is(e)
    ? e
    : JSONObject.is(e) ||
      JSONArray.is(e) ||
      io.boolean.is(e) ||
      io.string.is(e) ||
      io.number.is(e) ||
      io.null.is(e)
    ? poet.cnst(e)
    : ExtendedArray.is(e)
    ? poet.tuple(e.map(i => step1(i)))
    : poet.type(
        {},
        Object.entries(e).reduce((a, b) => ({ ...a, [b[0]]: step1(b[1]) }), {})
      );

export const step2 = (
  e: JSONSchemaObject<JSSTEmpty<Unmock>, Unmock>
): fc.Arbitrary<any> =>
  makeArbitrary<JSSTEmpty<Unmock>, Unmock>(e, {
    c: JSSTEmpty(Unmock),
    u: Unmock,
    f: (t: JSSTEmpty<Unmock>) => fc.anything()
  });
