import request from "supertest";
import Container from "typedi";

import app from "../src/app";
import sequelize from "../src/db";
import { Url } from "../src/models/Url";
import { User } from "../src/models/User";
import { AuthService } from "../src/services/auth";
import { UrlService } from "../src/services/urls";

const authService = Container.get(AuthService);

describe("Urls E2E", () => {
  let user1: User, user2: User;
  let url1: Url, url2: Url;
  let token1: string, token2: string;

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    [user1, user2] = await User.bulkCreate([
      {
        username: "user1",
      },
      {
        username: "user2",
      },
    ]);
    [url1, url2] = await Url.bulkCreate([
      {
        url: "http://test.com",
        slug: "test12",
        userId: user1.id,
      },
      {
        url: "http://test-another.com",
        slug: "test45",
      },
    ]);

    token1 = authService.getToken(user1);
    token2 = authService.getToken(user2);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Create url", () => {
    test("should create an url", async () => {
      const response = await request(app)
        .post("/urls")
        .send({ url: "http://fake-site.com" });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        url: "http://fake-site.com",
        slug: expect.any(String),
      });
      expect(response.body.userId).toBeUndefined();
    });

    test("should create an url for user issuing the request", async () => {
      const response = await request(app)
        .post("/urls")
        .set("Authorization", `Bearer ${token1}`)
        .send({ url: "http://fake-site.com" });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        url: "http://fake-site.com",
        slug: expect.any(String),
        userId: user1.id,
      });
    });

    test("should create an url after retrying in case of a duplicated slug", async () => {
      const mockGenerateFn = jest
        .fn()
        .mockReturnValueOnce("test12")
        .mockReturnValue("valid1");
      const urlService = Container.get(UrlService);

      urlService["generateFn"] = mockGenerateFn;

      const response = await request(app)
        .post("/urls")
        .send({ url: "http://fake-site.com" });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        url: "http://fake-site.com",
        slug: expect.any(String),
      });
      expect(response.body.userId).toBeUndefined();
    });

    test("should fail after exhausting the number of retries for duplicated slugs", async () => {
      const mockGenerateFn = jest.fn().mockReturnValue("test12");
      const urlService = Container.get(UrlService);

      urlService["generateFn"] = mockGenerateFn;

      const response = await request(app)
        .post("/urls")
        .send({ url: "http://fake-site.com" });

      expect(response.status).toBe(500);
    });

    test("should create an url with a custom slug", async () => {
      const response = await request(app)
        .post("/urls")
        .send({ url: "http://fake-site.com", slug: "custom" });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        url: "http://fake-site.com",
        slug: "custom",
      });
    });

    test("should fail if request is invalid", async () => {
      const response = await request(app)
        .post("/urls")
        .send({ url: "invalid url" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: "Bad Request" });
    });

    test("should fail if slug already exists", async () => {
      const response = await request(app)
        .post("/urls")
        .send({ url: "http://fake-site.com", slug: "test12" });

      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({ error: "Conflict" });
    });
  });

  describe("Update url", () => {
    test("should allow a logged in user to update one of his urls", async () => {
      const response = await request(app)
        .put(`/urls/${url1.slug}`)
        .set("Authorization", `Bearer ${token1}`)
        .send({ slug: "custom" });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        url: url1.url,
        slug: "custom",
      });
    });

    test("should fail if user is not authenticated", async () => {
      const response = await request(app)
        .put(`/urls/${url1.slug}`)
        .send({ slug: "invalid slug" });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({ error: "Unauthorized" });
    });

    test("should fail if request is invalid", async () => {
      const response = await request(app)
        .put(`/urls/${url1.slug}`)
        .set("Authorization", `Bearer ${token1}`)
        .send({ slug: "invalid slug" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: "Bad Request" });
    });

    test("should fail if slug already exists", async () => {
      const response = await request(app)
        .put(`/urls/${url1.slug}`)
        .set("Authorization", `Bearer ${token1}`)
        .send({ slug: "test45" });

      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({ error: "Conflict" });
    });

    test("should fail if user attempts to update an url from another user", async () => {
      const response = await request(app)
        .put(`/urls/${url1.slug}`)
        .set("Authorization", `Bearer ${token2}`)
        .send({ slug: "custom" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: "Bad Request" });
    });

    test("should fail if user attempts to update an anonymous url", async () => {
      const response = await request(app)
        .put(`/urls/${url2.slug}`)
        .set("Authorization", `Bearer ${token1}`)
        .send({ slug: "custom" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: "Bad Request" });
    });
  });

  describe("Get urls", () => {
    test("should allow a logged in user to retrieve his urls", async () => {
      const response = await request(app)
        .get("/urls")
        .set("Authorization", `Bearer ${token1}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: url1.url,
            slug: url1.slug,
          }),
        ]),
      );
    });

    test("should fail if user is not authenticated", async () => {
      const response = await request(app).get("/urls").send();

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({ error: "Unauthorized" });
    });
  });

  describe("Redirect and stats", () => {
    test("should redirect to the url corresponding to the slug and increase the number of hits", async () => {
      const response = await request(app).get(`/${url1.slug}`).send();

      expect(response.status).toBe(301);
      expect(response.headers["location"]).toBe(url1.url);
      expect(url1.hits).toBe(0);
      await url1.reload();
      expect(url1.hits).toBe(1);
    });

    test("should fail if slug does not match any url", async () => {
      const response = await request(app).get("/custom").send();

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: "Not Found" });
    });
  });
});
