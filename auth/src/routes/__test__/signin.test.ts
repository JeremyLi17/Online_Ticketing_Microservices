import request from "supertest";
import { app } from "../../app";
import { SIGNIN_URL, SIGNUP_URL } from "./share";

it("fails when signin with a email does not exist", async () => {
  await request(app)
    .post(SIGNIN_URL)
    .send({
      email: "notexist@test.com",
      password: "123456",
    })
    .expect(400);
});

it("fails when signin with incorrect password", async () => {
  await request(app)
    .post(SIGNUP_URL)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post(SIGNIN_URL)
    .send({
      email: "test@test.com",
      password: "incorrect",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post(SIGNUP_URL)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post(SIGNIN_URL)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
