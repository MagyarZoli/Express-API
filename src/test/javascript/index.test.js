const request = require("supertest");
const app = require("../../main/javascript/index");

describe("API Tests", () => {
  it("GET - /", async () => {
    const {header, body} = await request(app).get("/");
  });
});
