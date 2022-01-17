import express from "express";
import * as ConnectionController from "../controllers/connection-controller";

export const apiRoutes = express.Router();

apiRoutes.get("/connections/", ConnectionController.getConnections);
apiRoutes.get("/initialize/", ConnectionController.newConnection);
apiRoutes.post("/poll/", ConnectionController.poll);

//Home page route
apiRoutes.get("/", (req, res) => {
  res.send(
    "<html><title>Webroom Server API</title><body><h1>Webroom Server API</h1><p>Welcome!</p></body></html>"
  );
});
