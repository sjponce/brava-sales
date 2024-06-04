const search = async (Model, req, res) => {
  const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name'];

  const fields = { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  const results = await Model.find({
    ...fields,
  })

    .where('removed', false)
    .limit(20)
    .exec();

  if (results.length >= 1) {
    return res.status(200).json({
      success: true,
      result: results,
      message: 'Se encontro todos los elementos',
    });
  } else {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'No se encontro ningun elemento',
      })
      .end();
  }
};

module.exports = search;
