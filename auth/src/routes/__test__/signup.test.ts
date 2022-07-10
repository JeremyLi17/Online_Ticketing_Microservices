import request from "supertest";
import { app } from "../../app";
import { SIGNUP_URL } from "./share";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post(SIGNUP_URL)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post(SIGNUP_URL)
    .send({
      email: "test.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post(SIGNUP_URL)
    .send({
      email: "test.com",
      password: "pw",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post(SIGNUP_URL)
    .send({
      email: "test@test.com",
    })
    .expect(400);

  await request(app)
    .post(SIGNUP_URL)
    .send({
      password: "password",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post(SIGNUP_URL)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post(SIGNUP_URL)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

// cookieSession -> need HTTPS. But supertest use HTTP
it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post(SIGNUP_URL)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
