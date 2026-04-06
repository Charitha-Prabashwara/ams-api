const {LectureModel} = require('../../models');
const BaseRepository = require('./BaseRepository');

class LectureRepository extends BaseRepository {
  constructor() {
    const defaultSelectList = [];
    super(LectureModel, defaultSelectList);
  }

    async findById(id, select = [], filter={}) {
      this._validateId(id);
      return this.model.findOne({ _id: id, ...filter}).select(this._selectProjection(select)).lean();
    }
}

module.exports = LectureRepository;
