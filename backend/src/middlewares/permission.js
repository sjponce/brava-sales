//this middleware will check if the user has permission

const roles = {
  owner: ['create', 'read', 'update', 'delete', 'download', 'upload'],
  admin: ['admin', 'create', 'read', 'update', 'delete', 'download', 'upload'],
  seller: ['create', 'read', 'update', 'download', 'upload'],
  createOnly: ['create', 'read', 'download', 'upload'],
  readOnly: ['read', 'download'],
};

exports.ROLE_ENUM = Object.freeze(
  Object.keys(roles).reduce((acc, role) => {
    acc[role.toUpperCase()] = role;
    return acc;
  }, {})
);

exports.roles = roles;

exports.hasPermission = (permissionName = 'none') => {
  return (req, res, next) => {
    const currentUserRole = req.admin.role;

    if (
      roles[currentUserRole]?.includes(permissionName) ||
      req.admin.role === this.ROLE_ENUM.OWNER ||
      req.admin.role === this.ROLE_ENUM.ADMIN
    ) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Acceso denegado.',
      });
    }
  };
};
