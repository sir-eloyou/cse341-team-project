import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition : {
        openapi: "3.0.0",

        info: {
            title: "Kizuna Rail API",
            version: "1.0.0",
            description: "API documentation for Kizuna Rail"
        },

        servers: [
            {
                url: "http://localhost:3000/"
            }
        ]
    },

    apis: ["./src/routes/api-routes.js"]

    
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec