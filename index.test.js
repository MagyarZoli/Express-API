const request = require("supertest");
const app = require("./index");

describe("API Tests", () => {
  it("GET - /", async () => {
    const {header, body} = await request(app).get("/");
  });
});