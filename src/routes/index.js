const base_router = require('./base.route');
const adminRouter = require('./user.routes/admin.routes');
const departmentRouter = require('./department.routes/department.routes');
const subjectRouter = require('./subject.routes/subject.routes')
const corseRouter = require('./course.routes/course.routes')
const semesterRouter = require('./semester.routes/semester.routes')
const batchRouter = require('./batch.routes/batch.routes')
module.exports = { base_router, adminRouter, departmentRouter, subjectRouter, corseRouter, semesterRouter, batchRouter};
