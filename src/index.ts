import { FastCheckSchema_, makeArbitrary } from "json-schema-fast-check";
import {
  JSONPrimitive,
  JSONArray,
  JSONObject,
  JSONSchemaObject,
  JSSTEmpty,
  JSSTAnything
} from "json-schema-strictly-typed";
import { extendT, tuple_, type_, cnst_ } from "json-schema-poet";
import fc from "fast-check";
import * as io from "io-ts";

export const RandomHackishSymbolThatWeWillRemoveLater: unique symbol = Symbol();
const _v = (u: unknown): u is RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater =>
  typeof u === "object" && (<any>u).randomHackishField === RandomHackishSymbolThatWeWillRemoveLater;
const RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater: io.Type<RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater, RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater> = new io.Type<RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater, RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater>(
  "RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater",
  _v,
  (input, context) =>
    _v(input) ? io.success(input) : io.failure(input, context),
  io.identity
);
type RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater = {
  randomHackishField: typeof RandomHackishSymbolThatWeWillRemoveLater;
};
const JSO = JSONSchemaObject(JSSTEmpty(RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater), RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater);

type ExtendedPrimitive =
  | JSONPrimitive
  | JSONSchemaObject<JSSTEmpty<RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater>, RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater>;
const ExtendedPrimitive = io.union([JSONPrimitive, JSO]);
export declare type ExtendedValue =
  | ExtendedPrimitive
  | ExtendedArray
  | ExtendedObject
  | JSONArray
  | JSONObject;
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

export const poet = extendT<JSSTEmpty<RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater>, RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater>({
  randomHackishField: RandomHackishSymbolThatWeWillRemoveLater
});
export interface ExtendedArray extends Array<ExtendedValue> {}

export const regularize = (
  i: JSONSchemaObject<JSSTEmpty<RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater>, RandomHackishTypeContainingTheRandomHackishSymbolThatWeWillRemoveLater>
): JSONSchemaObject<JSSTEmpty<{}>, {}> => {
  const { randomHackishField, ...rest } = i;
  return rest;
};
export const step1 = (e: ExtendedValue): JSSTAnything<JSSTEmpty<{}>, {}> =>
  JSO.is(e)
    ? regularize(e)
    : ExtendedArray.is(e) || JSONArray.is(e)
    ? tuple_<JSSTEmpty<{}>, {}>({})(e.map(i => step1(i)))
    : ExtendedObject.is(e) || JSONObject.is(e)
    ? type_<JSSTEmpty<{}>, {}>({})(
        Object.entries(e).reduce((a, b) => ({ ...a, [b[0]]: step1(b[1]) }), {}),
        {}
      )
    : cnst_<{}>({})(e);

export const step2 = (
  e: JSONSchemaObject<JSSTEmpty<{}>, {}>
): fc.Arbitrary<any> =>
  makeArbitrary<JSSTEmpty<{}>, {}>(e, {
    c: JSSTEmpty(io.type({})),
    u: io.type({}),
    f: (t: JSSTEmpty<{}>) => fc.anything()
  });
