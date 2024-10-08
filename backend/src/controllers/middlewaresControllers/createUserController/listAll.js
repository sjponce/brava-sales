const mongoose = require('mongoose');

const listAll = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  //  Query the database for a list of all results
  const result = await User.find({ removed: false, enabled: true })
    .sort({ enabled: -1 })
    .populate()
    .exec();
  // Counting the total documents
  // Resolving both promises
  // Calculating total pages

  // Getting Pagination Object
  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result,
      message: 'se encontro los documentos',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: 'la colección esta vacia',
    });
  }
};

module.exports = listAll;
