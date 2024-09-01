const read = async (Model, req, res) => {
  const populateQuery = Object.keys(Model.schema.paths).reduce((acc, field) => {
    if (Model.schema.paths[field].instance === 'ObjectId' && field !== '_id') {
      acc.push(field);
    }
    return acc;
  }, []);

  // Find document by id
  const result = await Model.findOne({
    _id: req.params.id,
    removed: false,
  }).populate(populateQuery).exec();
  // If no results found, return document not found
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'no se encontro un documento',
    });
  } else {
    // Return success resposne
    return res.status(200).json({
      success: true,
      result,
      message: 'Se encontro el documento',
    });
  }
};

module.exports = read;
