const listAll = async (Model, req, res) => {
  const sort = parseInt(req.query.sort) || 'desc';

  //  Query the database for a list of all results
  const result = await Model.find({
    removed: false,
  })
    .sort({ created: sort })
    .populate()
    .exec();

  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result: result,
      message: 'Se encontro todos los elementos',
    });
  } else {
    return res.status(203).json({
      success: true,
      result: [],
      message: 'La coleccion esta vacia',
    });
  }
};

module.exports = listAll;
