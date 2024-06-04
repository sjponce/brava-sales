const profile = async (req, res) => {
  //  Query the database for a list of all results
  if (!req.admin) {
    return res.status(404).json({
      success: false,
      result: null,
      message: "No se encontro el perfil",
    });
  }
  const result = {
    _id: req.admin._id,
    email: req.admin.email,
    name: req.admin.name,
    surname: req.admin.surname,
    photo: req.admin.photo,
    role: req.admin.role,
  };

  return res.status(200).json({
    success: true,
    result,
    message: 'se encontro el perfil',
  });
};
module.exports = profile;
