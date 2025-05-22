const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Node.js API Documentation",
    version: "1.0.0",
    description: "API documentation for your Node.js project",
  },
  servers: [
    {
      url: "http://localhost:3000", // Update with your API base URL
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to your JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);
console.log(JSON.stringify(swaggerSpec, null, 2));
module.exports = swaggerSpec;