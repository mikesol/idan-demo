import { poet, step1, step2, US, ExtendedValue } from "../src";
import jsonschema from "jsonschema";
import fc from "fast-check";
test("step 1 and step 2", () => {
  // myValue is what we'd pass to unmock, a mix of constants
  // and "poet" functions
  const myValue = {
    type: "object",
    bar: {
      baz: 1,
      hello: poet.integer()
    }
  };
  // step1 turns the syntax above, a mix of nock and our special sauce,
  // into an extended form of JSON schema and keeps the JSON schema as-is
  expect(step1(myValue)).toEqual({
    type: "object",
    properties: {
      type: { const: "object" },
      bar: {
        type: "object",
        properties: {
          baz: { const: 1 },
          hello: { type: "integer" }
        },
        required: ["baz", "hello"]
      }
    },
    required: ["type", "bar"]
  });
  expect(
    jsonschema.validate(
      {
        type: "object",
        bar: {
          baz: 1,
          hello: 42
        }
      },
      step1(myValue)
    ).valid
  ).toBe(true);
  // step2 transforms a result of step1 into a fast check arbitrary
  fc.assert(
    fc.property(
      step2(step1(myValue)),
      i => jsonschema.validate(i, step1(myValue)).valid
    )
  );
});
