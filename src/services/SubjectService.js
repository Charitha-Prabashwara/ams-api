const NullSubject = require('../classes/NullSubject')
const Subject = require('../classes/Subject')
const SubjectBuilder = require('../classes/SubjectBuilder')
const subjectClass = new Subject()

/**
 * Service layer for managing Subject entities.
 * Provides methods for creating, retrieving, updating, deleting,
 * and querying subjects using the Subject model and SubjectBuilder.
 *
 * @class SubjectService
 */
class SubjectService{

    
    /**
    * Creates an instance of SubjectService.
    * Currently no dependencies are injected.
    *
    * @constructor
    */
    constructor(){}

    /**
     * Retrieve a subject by its unique identifier.
     *
     * @async
     * @param {String|Number} id - Unique ID of the subject.
     * @param {Array<string>} [select=[]] - Fields to select in the result.
     * @param {Object} [filter={}] - Additional filter criteria.
     * @returns {Promise<Object|null>} The subject object or null if not found.
     */
    async getSubjectById(id, select=[], filter={}){
        return subjectClass.findById(id, select, filter)
    }

    /**
     * Create a new subject.
     *
     * @async
     * @param {Object} data - Subject payload.
     * @param {String} data.code - Subject code.
     * @param {String} data.name - Subject name.
     * @param {Number} data.credits - Number of credits.
     * @returns {Promise<Object>} The newly created subject.
     */
    async createNewSubject(data={}){
        const builder = new SubjectBuilder()
        builder.code = data.code;
        builder.credits = data.credits;
        builder.name = data.name
        
        return builder.create()
    }

        /**
     * Update an existing subject by its ID.
     *
     * @async
     * @param {Object} data - Updated subject data. Must include an identifier.
     * @param {Array<string>} [select=[]] - Optional fields to return.
     * @returns {Promise<Object|null>} The updated subject or null if not found.
     */
    async updateSubjectById(data={}, select=[]){
        return subjectClass.findByIdAndUpdate(data, select)
    }

        /**
     * Find one or more subjects based on dynamic search criteria.
     *
     * @async
     * @param {Object} data - Search filters.
     * @param {String} [data.name] - Filter by name.
     * @param {String} [data.code] - Filter by code.
     * @param {Number} [data.credits] - Filter by credit value.
     * @param {Boolean} [data.deleted] - Filter by deleted status.
     * @param {Number} [data.createdAt_timestamp] - Filter by creation timestamp.
     * @param {Number} [data.updatedAt_timestamp] - Filter by update timestamp.
     * @param {Object} [options={}] - Additional query options (pagination, sort, etc.).
     * @returns {Promise<Array<Object>>} Array of subjects that match the query.
     */
    async findSubject(data={}, options={}){
        const subjectClass = new Subject()

        if(data.name) subjectClass.name = data.name;
        if(data.code) subjectClass.code = data.code;
        if(data.credits) subjectClass.credits = data.credits;
        if(data.deleted != undefined) subjectClass.deleted = data.deleted;
        if(data.createdAt_timestamp) subjectClass.createdAt_timestamp = data.createdAt_timestamp;
        if(data.updatedAt_timestamp) subjectClass.updatedAt_timestamp = data.updatedAt_timestamp;

        return await subjectClass.find(options)
    }

        /**
     * Soft-delete or permanently delete a subject by ID.
     *
     * @async
     * @param {String|Number} id - Unique ID of the subject.
     * @returns {Promise<Boolean>} True if deleted, false otherwise.
     */
    async deleteSubjectById(id){
        return subjectClass.deleteById(id)
    }

    /**
     * Check if a given subject instance is considered a NullSubject.
     *
     * @param {Object} subject - Subject instance to check.
     * @returns {Boolean} True if the subject is a NullSubject instance.
     */
    isNullSubject(subject){
        return subject == NullSubject
    }


}

module.exports = SubjectService