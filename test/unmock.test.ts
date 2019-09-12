///// LIMITATION
///// only one invocation of unmock works at a time
///// if you make two successive ones, the most recent one
///// will wipe out the first one
///// this can be fixed in a "real" package

import fc from "fast-check";
import unmock, { runner, spy } from "../src/unmock";
import { poet, step1, step2, US } from "../src";
import ageMsg from "../src/age-msg";
import { JSONObject } from "json-schema-strictly-typed";

unmock("https://example.com")
  .get(/\/v1\/user\/[0-9]+/)
  .reply(
    200,
    poet.type(
      {
        timestamp: poet.integer(),
        name: poet.string()
      },
      {
        age: poet.integer()
      }
    ),
    (uri, _, i) => ({
      id: parseInt(uri.split("/").slice(-1)[0]),
      ...(<JSONObject>i)
    })
  );

test("Age message is sane.", async () => {
  await runner(fc.integer(0, 555), async n => {
    const msg = await ageMsg(n);
    const { id, age, name } = spy.response.body;
    return (
      id === n &&
      ((age === undefined && msg === `Please enter your age, ${name}.`) ||
        msg === `Hi ${name}, you are ${age} years old.`)
    );
  });
});
