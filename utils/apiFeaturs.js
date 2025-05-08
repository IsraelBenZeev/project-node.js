const qs = require('qs');
class APIfeaturs {
  constructor(query, paramsQuery) {
    console.log('enter to API featurs');
    this.query = query;
    this.paramsQuery = paramsQuery;
  }
  filter() {
    console.log('enter filter');
    const queryObj = qs.parse({ ...this.paramsQuery });
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    console.log('enter sort');
    if (this.paramsQuery.sort) {
      if (this.paramsQuery.sort) {
        const sortBy = this.paramsQuery.sort
          .split(',')
          .join(' ');
        console.log('sort:', sortBy);
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
    }
    return this;
  }
  limitFields() {
    // console.log('enter limitFields');
    if (this.paramsQuery.fields) {
      const fields = this.paramsQuery.fields
        .split(',')
        .join(' ');
      console.log('fields: ', fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    console.log('enter paginate');

    const page = this.paramsQuery.page * 1 || 1;
    const limit = this.paramsQuery.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIfeaturs;
