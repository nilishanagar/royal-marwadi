class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Text search on indexed fields
  search() {
    const keyword = this.queryStr.keyword
      ? { $text: { $search: this.queryStr.keyword } }
      : {};
    this.query = this.query.find(keyword);
    return this;
  }

  // Filter by category, price range, material, color, rating, featured
  filter() {
    const queryCopy = { ...this.queryStr };

    // Remove fields not meant for filtering
    const removeFields = ['keyword', 'page', 'limit', 'sort', 'fields'];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Price range filter: ?minPrice=1000&maxPrice=5000
    if (queryCopy.minPrice || queryCopy.maxPrice) {
      queryCopy.price = {};
      if (queryCopy.minPrice) {
        queryCopy.price.$gte = Number(queryCopy.minPrice);
        delete queryCopy.minPrice;
      }
      if (queryCopy.maxPrice) {
        queryCopy.price.$lte = Number(queryCopy.maxPrice);
        delete queryCopy.maxPrice;
      }
    }

    // Rating filter: ?minRating=4
    if (queryCopy.minRating) {
      queryCopy.rating = { $gte: Number(queryCopy.minRating) };
      delete queryCopy.minRating;
    }

    this.query = this.query.find(queryCopy);
    return this;
  }

  // Sort: ?sort=price,-createdAt (default: newest first)
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // Field limiting: ?fields=name,price,images
  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  // Pagination: ?page=2&limit=12
  paginate() {
    const page = Math.max(1, parseInt(this.queryStr.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(this.queryStr.limit, 10) || 12));
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }
}

export default ApiFeatures;
