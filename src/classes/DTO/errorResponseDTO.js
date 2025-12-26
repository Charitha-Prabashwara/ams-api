class ErrorResponseDTO {
  /**
   * @param {string} message - main error message
   * @param {Array|string} details - optional array of field-specific errors
   */
  constructor(message, details = []) {
    this.success = false; // always false for errors
    this.message = message; // general error message
    this.details = Array.isArray(details) ? details : [details]; // array of detailed errors
    this.timestamp = new Date(); // optional: timestamp
  }
}

module.exports = { ErrorResponseDTO };
