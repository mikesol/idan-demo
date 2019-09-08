///// LIMITATION
///// only one invocation of unmock works at a time
///// if you make two successive ones, the most recent one
///// will wipe out the first one
///// this can be fixed in a "real" package

import unmock, { runner, spy } from "../src/unmock";
import { poet, step1, step2, US } from "../src";
import ageMsg from "../src/age-msg";

unmock("https://example.com")
  .get("/v1/me")
  .reply(
    200,
    poet.type(
      {
        timestamp: poet.integer(),
        id: poet.number(),
        name: poet.string()
      },
      {
        age: poet.integer()
      }
    )
  );

test("Age message is sane.", async () => {
  await runner(async () => {
    const msg = await ageMsg();
    return (
      (spy.response.body.age === undefined &&
        msg === "Please enter your age.") ||
      msg === `You are ${spy.response.body.age} years old.`
    );
  });
});
