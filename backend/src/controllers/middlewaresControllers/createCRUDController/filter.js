const filter = async (Model, req, res) => {
  if (req.query.filter === undefined || req.query.equal === undefined) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Por favor indique los parametros a buscar',
    });
  }
  const result = await Model.find({
    removed: false,
  })
    .where(req.query.filter)
    .equals(req.query.equal)
    .exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No se encontró un documento',
    });
  } else {
    // Return success resposne
    return res.status(200).json({
      success: true,
      result,
      message: 'Se encontró el documento',
    });
  }
};

module.exports = filter;
