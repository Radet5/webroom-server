import express from "express";
import cors from "cors";

//import apiRoutes from "./routes/api-routes";
import { apiRoutes } from "./routes/api-routes";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json())

app.use("/api/", apiRoutes);

app.listen(port, () => {
  console.log(`webroom is running on port ${port}.`);
});
