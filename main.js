const express = require("express");

const animalsRoutes = require("./animals/animals.routes");
const blogsRoutes = require("./blogs/blogs.routes");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/animals", animalsRoutes);
app.use("/blogs", blogsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});