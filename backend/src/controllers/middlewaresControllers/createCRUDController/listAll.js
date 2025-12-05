const listAll = async (Model, req, res) => {
  const sort = req.query.sort || 'desc';
  const enabled = req.query.enabled || undefined;

  //  Query the database for a list of all results

  let result;
  if (enabled === undefined) {
    result = await Model.find({
      removed: false,
    })
      .sort({ created: sort })
      .populate()
      .exec();
  } else {
    result = await Model.find({
      removed: false,
      enabled: enabled,
    })
      .sort({ created: sort })
      .populate()
      .exec();
  }

  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Se encontró todos los elementos',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: 'La colección esta vacia',
    });
  }
};

module.exports = listAll;
