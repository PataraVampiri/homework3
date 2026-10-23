function paginate(data, page = 1, limit = 10) {
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Math.min(100, Number(limit) || 10));

  const startIndex = (currentPage - 1) * pageSize;
  const results = data.slice(startIndex, startIndex + pageSize);

  return {
    data: results,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total: data.length,
      totalPages: Math.ceil(data.length / pageSize),
    },
  };
}

module.exports = { paginate };