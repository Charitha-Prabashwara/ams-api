const { BatchModel } = require('../../models');
const BaseRepository = require('./BaseRepository');

class BatchRepository extends BaseRepository {
  constructor() {
    const defaultSelectList = [];
    super(BatchModel, defaultSelectList);
  }
}

module.exports = BatchRepository;
