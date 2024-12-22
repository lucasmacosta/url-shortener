import request from "supertest";

import app from "../src/app";
import sequelize from "../src/db";
import { User } from "../src/models/User";

describe("Users E2E", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await User.bulkCreate([
      {
        username: "user1",
      },
    ]);
  });

  describe("Create user", () => {
    test("should create a user", async () => {
      const response = await request(app)
        .post("/users")
        .send({ username: "user" });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        username: "user",
      });
    });

    test("should fail if request is invalid", async () => {
      const response = await request(app)
        .post("/users")
        .send({ username: "1user" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: "Bad Request" });
    });

    test("should fail if username already exists", async () => {
      const response = await request(app)
        .post("/users")
        .send({ username: "user1" });

      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({ error: "Conflict" });
    });
  });

  describe("Authenticate user", () => {
    test("should authenticate a user", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ username: "user1" });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        user: {
          username: "user1",
        },
        token: expect.any(String),
      });
    });

    test("should fail if credentials are invalid", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ username: "user2" });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({ error: "Unauthorized" });
    });
  });
});
