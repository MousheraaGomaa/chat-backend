import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { fileURLToPath } from "url";
import path from "path";
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from "swagger-ui-dist";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerUICss =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.20.7/swagger-ui.min.css";

const options = {
  customCssUrl: swaggerUICss,
};

const swaggerDocument = YAML.load(`${__dirname}/swaggerDoc.yml`);
const generateSwaggerApiDoc = (app) => {
  app.use(
    "/api/api-docs",
    swaggerUi.serveFiles(swaggerDocument, options),
    swaggerUi.setup(swaggerDocument, options)
  );
};

export default generateSwaggerApiDoc;
