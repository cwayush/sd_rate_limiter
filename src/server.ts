import "dotenv/config";
import app from "./app.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT;
const SERVER_NAME = process.env.SERVER_NAME;

async function startServer() {
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server ${SERVER_NAME} running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
