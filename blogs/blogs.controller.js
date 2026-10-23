const blogs = require("./blogs.data");
const { paginate } = require("../utils");


function getBlogs(req, res) {
  const visibleBlogs = blogs.filter((blog) => !blog.deleted);

  const result = paginate(
    visibleBlogs,
    req.query.page,
    req.query.limit
  );

  res.status(200).json(result);
}


function getBlogById(req, res) {
  const blog = blogs.find(
    (item) => item.id === Number(req.params.id) && !item.deleted
  );

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.status(200).json(blog);
}


function createBlog(req, res) {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({
      message: "title, content and author are required",
    });
  }

  const newBlog = {
    id: blogs.length
      ? Math.max(...blogs.map((blog) => blog.id)) + 1
      : 1,
    title,
    content,
    author,
  };

  blogs.push(newBlog);

  res.status(201).json(newBlog);
}

function updateBlog(req, res) {
  const blog = blogs.find(
    (item) => item.id === Number(req.params.id) && !item.deleted
  );

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const { title, content, author } = req.body;

  if (title !== undefined) blog.title = title;
  if (content !== undefined) blog.content = content;
  if (author !== undefined) blog.author = author;

  res.status(200).json(blog);
}


function deleteBlog(req, res) {
  const deleteMode = req.get("x-delete-mode");

  if (!["soft", "permanent"].includes(deleteMode)) {
    return res.status(400).json({
      message:
        "Header x-delete-mode must be 'soft' or 'permanent'",
    });
  }

  const index = blogs.findIndex(
    (item) => item.id === Number(req.params.id) && !item.deleted
  );

  if (index === -1) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (deleteMode === "soft") {
    blogs[index].deleted = true;

    return res.status(200).json({
      message: "Blog soft-deleted successfully",
    });
  }

  const deletedBlog = blogs.splice(index, 1)[0];

  res.status(200).json({
    message: "Blog permanently deleted",
    data: deletedBlog,
  });
}

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};