import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { fileURLToPath } from "url";
import path from "path";

// import swaggerDocument from './swagger.json';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerUICss =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";

const swaggerDocument = YAML.load(`${__dirname}/swaggerDoc.yml`);
const generateSwaggerApiDoc = (app) => {
  app.use(
    "/api/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
};

export default generateSwaggerApiDoc;
