const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  //Copy req.query
  let reqQuery = { ...req.query };

  //Exclude fields
  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over the query params and remove the fields to be excluded
  removeFields.forEach((params) => delete reqQuery[params]);

  //Create the query string
  let queryStr = JSON.stringify(reqQuery);

  //Create the operators to query within($gte)

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  //Finding the resource
  query = model.find(JSON.parse(queryStr));

  //Select Fields to show
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");

    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  //Executing the query
  const results = await query;

  //Pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
  }
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResults;
