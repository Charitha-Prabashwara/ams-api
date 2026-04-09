const base_router = require('./base.route');
const adminRouter = require('./user.routes/admin.routes');
const departmentRouter = require('./department.routes/department.routes');
const subjectRouter = require('./subject.routes/subject.routes')
const corseRouter = require('./course.routes/course.routes')
const semesterRouter = require('./semester.routes/semester.routes')
const batchRouter = require('./batch.routes/batch.routes')
const subjectRegistrationRouter = require('./subjectRegistration.routes/subjectRegistration.routes')
const lecturerSubjectRegistrationRouter = require('./lecturerSubjectRegistration.routes/lecturerSubjectRegistration.routes')
const lectureRouter = require('./lecture.routes/lecture.routes')
module.exports = (app) => {
  app.use('/api/v1', base_router);
  app.use('/api/v1/admin', adminRouter);
  app.use('/api/v1/department', departmentRouter);
  app.use('/api/v1/subject', subjectRouter);
  app.use('/api/v1/course', corseRouter);
  app.use('/api/v1/semester', semesterRouter);
  app.use('/api/v1/batch', batchRouter);
  app.use('/api/v1/subject-registration', subjectRegistrationRouter);
  app.use('/api/v1/lecturer-subject-registration', lecturerSubjectRegistrationRouter);
  app.use('/api/v1/lecture', lectureRouter);
};

