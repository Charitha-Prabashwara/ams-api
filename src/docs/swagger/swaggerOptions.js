const { version } = require('../../../package.json');
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Academic Management System API',
      version: version,
      description: `
        This API provides backend services for a comprehensive Academic Management System (AMS) designed for universities, institutes, and higher-education platforms. The system supports secure user operations, departmental management, authentication, academic data handling, and long-term system scalability.

Core capabilities include authentication using JSON Web Tokens (JWT), granular Role-Based Access Control (RBAC), modular domain separation, and entity lifecycle management through highly structured service layers.

### Key features:
- Secure authentication and authorization using JWT.
- Role-based access for Admin, Department Head, Lecturer, and Student.
- Fully structured user management including creation, update, removal, role assignment, and department affiliation.
- Department creation and maintenance, with strict validation and domain-level business logic.
- Extendable academic domain consisting of courses, attendance, and student enrollment.
- Repository-based data access with soft-delete support, embedded timestamps, and consistent domain builders.

### Architecture:
The system follows Clean Architecture and SOLID principles, offering:
- Separation of concerns across service, controller, and repository layers.
- Predictable entity creation using Builder pattern.
- Dependency-driven testing with mocked infrastructure layers.
- Clear mapping between domain objects and persistence storage.

### Database:
- MongoDB with Mongoose schema enforcement.
- Automatic auditing fields (createdAt_timestamp, updatedAt_timestamp).
- Soft-delete flags for recoverable objects.

### Testing:
- Integrated Jest test suite.
- Repository mocks for deterministic test execution.
- High testability through dependency inversion.

### Target deployments:
This backend is suitable for:
- Academic administration systems
- Student portals
- Department-level academic control systems
- Cloud-based academic services
- Offline-deployable educational products

The system is optimized for long-term maintainability, extensibility, and enterprise use cases while enabling integration with web, mobile, and third-party platforms.

      `,
    },
    servers: [
      {
        url: 'http://localhost:8080/api/v1',
        description: 'Local Development Server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerOptions;
