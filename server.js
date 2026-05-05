const app = require("./app");
const connectDB = require("./src/config/database");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on  http://localhost:${PORT}`);
  });
});
