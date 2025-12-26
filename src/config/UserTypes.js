class UserTypes {
  constructor() {
    if (UserTypes.instance == null) {
      this.USER_TYPES = ['user', 'admin', 'student', 'department', 'lecturer'];
      this.USER_USER = this.USER_TYPES[0];
      this.USER_ADMIN = this.USER_TYPES[1];
      this.USER_STUDENT = this.USER_TYPES[2];
      this.USER_DEPARTMENT = this.USER_TYPES[3];
      this.USER_LECTURER = this.USER_TYPES[4];

      UserTypes.instance = this;
    }
    return UserTypes.instance;
  }
}

const userTypes = new UserTypes();
Object.freeze(userTypes);
module.exports = userTypes;
