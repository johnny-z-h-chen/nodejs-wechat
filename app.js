import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import log4js from 'log4js';
import swaggerUi from 'swagger-ui-express';
import middleware from './middleware';
import swaggerOption from './config/swagger/swagger.json';

const app = express();
const routes = require('./router.js');
const applicationConfiguration = require('./config/application-configuration');
const { consoleLogger } = require('./utils/LoggerUtils');

// ============= logger =============
app.use(log4js.connectLogger(consoleLogger));

// ============= cors =============
app.use(
  cors({
    exposedHeaders: applicationConfiguration.corsHeaders,
  })
);

// ============= parse the body =============
app.use(
  bodyParser.json({
    limit: applicationConfiguration.bodyLimit,
  })
);

// ============= internal middleware =============
app.use(middleware({ applicationConfiguration }));

// ============= swagger-ui =============
if (applicationConfiguration.enableSwagger) {
  app.use(
    applicationConfiguration.swaggerRoute,
    swaggerUi.serve,
    swaggerUi.setup(swaggerOption)
  );
}

// ============= router =============
routes(app);

// ============= exception handle =============
app.use((err, req, res, next) => {
  if (err) {
    const targetError = { ...err };
    res.status(targetError.status);
    res.json(targetError);
  }
});

app.listen(process.env.PORT || applicationConfiguration.port, () => {
  consoleLogger.info(
    `Started on port ${process.env.PORT || applicationConfiguration.port}`
  );
});

export default app;
