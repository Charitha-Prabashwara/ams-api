const { SubjectModel } = require('../../models');
const BaseRepository = require('./BaseRepository');

class SubjectRepository extends BaseRepository {
  constructor() {
    const defaultSelectList = [];
    super(SubjectModel, defaultSelectList);
  }
}

module.exports = SubjectRepository;
