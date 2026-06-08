const swaggerDocument = {
    openapi: "3.0.0",
    info: {
      title: "Eventful API",
      version: "1.0.0",
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:5000",
      },
    ],
  };
  
  export default swaggerDocument;