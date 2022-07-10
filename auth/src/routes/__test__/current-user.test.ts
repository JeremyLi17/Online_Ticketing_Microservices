import request from "supertest";
import { app } from "../../app";
import { CURRENT_USER_URL } from "./share";

it("response with details about the current user", async () => {
  // manually extract cookie
  const cookie = await global.signin();

  // **supertest did not automatically manage cookies for us!**
  const response = await request(app)
    .get(CURRENT_USER_URL)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("response with null if not authenticated", async () => {
  const response = await request(app).get(CURRENT_USER_URL).send().expect(200);

  expect(response.body.currentUser).toEqual(null);
});
