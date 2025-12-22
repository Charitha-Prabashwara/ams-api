const {SubjectRegistrationModel} = require('../../models');
const BaseRepository = require('./BaseRepository');

class SubjectRegistrationRepository extends BaseRepository {
  constructor() {
    const defaultSelectList = [];
    super(SubjectRegistrationModel, defaultSelectList);
  }

  async findById(id, select = [], filter={}) {
      this._validateId(id);
    
       return this.model
    .findOne({ _id: id, ...filter})   // ← filter goes here
    .select(this._selectProjection(select))
    .lean();
  }
}

module.exports = SubjectRegistrationRepository;
