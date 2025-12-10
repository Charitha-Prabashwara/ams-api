const { DepartmentModel } = require('../../models');
const BaseRepository = require('./BaseRepository');

class DepartmentRepository extends BaseRepository {
  constructor() {
    const defaultSelectList = [];
    super(DepartmentModel, defaultSelectList);
  }
}

module.exports = DepartmentRepository;
