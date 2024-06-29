const userExceptions = {
  create: {
    emailExists: async (Model, req) => {
      const existingUser = await Model.findOne({ email: req.body.email, removed: false });
      if (existingUser) {
        return {
          success: false,
          result: null,
          message: 'Este email ya esta en uso.',
        };
      }
      return null;
    },
  },
  update: {
    emailExists: async (Model, req) => {
      const existingUser = await Model.findOne({ email: req.body.email, removed: false });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return {
          success: false,
          result: null,
          message: 'Este email ya esta en uso.',
        };
      }
      return null;
    },
  },
};

module.exports = userExceptions;