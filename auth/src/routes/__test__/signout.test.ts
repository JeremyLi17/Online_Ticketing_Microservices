import request from "supertest";
import { app } from "../../app";
import { SIGNUP_URL, SIGNOUT_URL } from "./share";

it("clears the cookie after signout", async () => {
  await request(app)
    .post(SIGNUP_URL)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app).post(SIGNOUT_URL).send({}).expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
