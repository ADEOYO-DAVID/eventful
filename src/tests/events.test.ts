import request from "supertest";
import app from "../app";

describe("Events Module", () => {

  it("should return all events", async () => {

    const response = await request(app)
      .get("/events");

    expect(response.status).toBe(200);

  }, 10000);

});
