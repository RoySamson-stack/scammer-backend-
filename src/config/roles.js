const allRoles = {
  user: ['getReports', 'createReport', 'getReport', 'updateReport', 'deleteReport', 'getUsers', 'manageUsers'],
  admin: ['getReports', 'createReport', 'getReport', 'updateReport', 'deleteReport', 'getUsers', 'manageUsers'],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));