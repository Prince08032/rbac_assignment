// Initial mock data
let mockData = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Viewer", status: "Inactive" }
  ],
  roles: [
    { id: 1, name: "Admin", description: "Full system access", permissions: ["create", "read", "update", "delete"] },
    { id: 2, name: "Editor", description: "Content management", permissions: ["read", "update"] },
    { id: 3, name: "Viewer", description: "View only access", permissions: ["read"] }
  ],
  permissions: [
    { id: 1, name: "create", description: "Create new resources", module: "Core" },
    { id: 2, name: "read", description: "View resources", module: "Core" },
    { id: 3, name: "update", description: "Modify existing resources", module: "Core" },
    { id: 4, name: "delete", description: "Remove resources", module: "Core" }
  ]
};

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
  const storedData = localStorage.getItem('mockData');
  if (storedData) {
    mockData = JSON.parse(storedData);
  } else {
    localStorage.setItem('mockData', JSON.stringify(mockData));
  }
}

// Helper function to save data
const saveData = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockData', JSON.stringify(mockData));
  }
};

// CRUD operations for users
export const getUsers = () => mockData.users;

export const addUser = (userData) => {
  const newUser = { ...userData, id: mockData.users.length + 1 };
  mockData.users.push(newUser);
  saveData();
  return newUser;
};

export const updateUser = (userData) => {
  mockData.users = mockData.users.map(user => 
    user.id === userData.id ? userData : user
  );
  saveData();
  return userData;
};

export const deleteUser = (id) => {
  mockData.users = mockData.users.filter(user => user.id !== id);
  saveData();
  return id;
};

export const updateUserStatus = (userId, status) => {
  mockData.users = mockData.users.map(user => 
    user.id === userId 
      ? { ...user, status: status ? "Active" : "Inactive" }
      : user
  );
  saveData();
  return { userId, status };
};

// CRUD operations for roles
export const getRoles = () => mockData.roles;

export const addRole = (roleData) => {
  const newRole = { ...roleData, id: mockData.roles.length + 1 };
  mockData.roles.push(newRole);
  saveData();
  return newRole;
};

export const updateRole = (roleData) => {
  mockData.roles = mockData.roles.map(role => 
    role.id === roleData.id ? roleData : role
  );
  saveData();
  return roleData;
};

export const deleteRole = (id) => {
  mockData.roles = mockData.roles.filter(role => role.id !== id);
  saveData();
  return id;
};

export const reorderRoles = (newRoles) => {
  mockData.roles = newRoles;
  saveData();
  return newRoles;
};

// CRUD operations for permissions
export const getPermissions = () => mockData.permissions;

export const addPermission = (permissionData) => {
  const newPermission = { ...permissionData, id: mockData.permissions.length + 1 };
  mockData.permissions.push(newPermission);
  saveData();
  return newPermission;
};

export const updatePermission = (permissionData) => {
  mockData.permissions = mockData.permissions.map(permission => 
    permission.id === permissionData.id ? permissionData : permission
  );
  saveData();
  return permissionData;
};

export const deletePermission = (id) => {
  mockData.permissions = mockData.permissions.filter(permission => permission.id !== id);
  saveData();
  return id;
};

// Reset data to initial state
export const resetData = () => {
  mockData = {
    users: [...initialUsers],
    roles: [...initialRoles],
    permissions: [...initialPermissions]
  };
  saveData();
};

// Simulated async behavior
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Async wrapper for all operations
export const performOperation = async (operation, ...args) => {
  await delay(500); // Simulate network delay
  return operation(...args);
}; 