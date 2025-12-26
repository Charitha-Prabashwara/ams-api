function withDTO(DTOClass, controllerFn) {
  return async (req, res, next) => {
    await controllerFn(new DTOClass(req.body), req, res, next);
  };
}

module.exports = { withDTO };
