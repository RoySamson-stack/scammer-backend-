const allRoles = {
  user: ['getReports', 'createReport', 'getReport', 'updateReport', 'deleteReport'],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
