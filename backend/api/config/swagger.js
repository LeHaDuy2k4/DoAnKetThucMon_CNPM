const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CMPM API",
      version: "1.0.0",
      description: "API tài khoản thư viện",
    },
  },
  apis: ["./routes/*.js"], // nơi chứa comment Swagger
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerUi };
