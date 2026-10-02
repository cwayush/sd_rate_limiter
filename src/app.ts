import "dotenv/config";
import express from "express";
import testRoutes from "./routes/test.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    server: process.env.SERVER_NAME,
  });
});

app.use("/api/test", testRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

export default app;
