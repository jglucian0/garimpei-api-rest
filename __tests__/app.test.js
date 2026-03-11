const PORT = process.env.PORT || 3001;

describe("GET /health", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch(`http://localhost:${PORT}/health`);
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.message).toBeDefined();
      expect(responseBody.message).toEqual("Server online");
    });
  });
});