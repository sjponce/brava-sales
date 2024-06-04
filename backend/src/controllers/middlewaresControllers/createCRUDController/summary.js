const summary = async (Model, req, res) => {
  //  Query the database for a list of all results
  const countPromise = Model.countDocuments({
    removed: false,
  });

  const resultsPromise = await Model.countDocuments({
    removed: false,
  })
    .where(req.query.filter)
    .equals(req.query.equal)
    .exec();
  // Resolving both promises
  const [countFilter, countAllDocs] = await Promise.all([resultsPromise, countPromise]);

  if (countAllDocs.length > 0) {
    return res.status(200).json({
      success: true,
      result: { countFilter, countAllDocs },
      message: 'Se encontro todos los elementos',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: 'La coleccion esta vacia',
    });
  }
};

module.exports = summary;
