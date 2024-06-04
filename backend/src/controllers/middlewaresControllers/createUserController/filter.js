const mongoose = require('mongoose');

const filter = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  if (req.query.filter === undefined || req.query.equal === undefined) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'El filtro no se especifico',
    });
  }
  const result = await User.find({ removed: false })
    .where(req.query.filter)
    .equals(req.query.equal);

  return res.status(200).json({
    success: true,
    result,
    message: 'se encontro el documento',
  });
};

module.exports = filter;
