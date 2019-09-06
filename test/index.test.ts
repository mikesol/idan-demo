import { poet, step1, step2, US, ExtendedValue } from "../src";
import jsonschema from "jsonschema";
import fc from "fast-check";
test("step 1 and step 2", () => {
  // myValue is what we'd pass to unmock, a mix of constants
  // and "poet" functions
  const myValue: ExtendedValue = {
    foo: 1,
    bar: {
      baz: 1,
      hello: poet.integer()
    }
  };
  // step1 turns the syntax above, a mix of nock and our special sauce,
  // into an extended form of JSON schema and keeps the JSON schema as-is
  expect(step1(myValue)).toEqual({
    type: "object",
    unmock: US,
    properties: {
      foo: { unmock: US, const: 1 },
      bar: {
        type: "object",
        unmock: US,
        properties: {
          baz: { unmock: US, const: 1 },
          hello: { unmock: US, type: "integer" }
        },
        required: []
      }
    },
    required: []
  });
  expect(jsonschema.validate({
    foo: 1,
    bar: {
      baz: 1,
      hello: 42
    }
  }, step1(myValue)).valid).toBe(true);
  // step2 transforms a result of step1 into a fast check arbitrary
  fc.assert(fc.property(step2(step1(myValue)), i => jsonschema.validate(i, step1(myValue)).valid))
});
