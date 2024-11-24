import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Switch } from '@headlessui/react';

const UserTable = ({ users, onDelete, onStatusChange, onEdit, onDeleteClick }) => {
  const ToggleButton = ({ isActive, onChange, userId }) => (
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        onChange={(checked) => onChange(userId, checked)}
        className={`${
          isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-red-600'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
      >
        <span
          className={`${
            isActive ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
      <span className={`text-xs font-medium ${
        isActive 
          ? 'text-green-600 dark:text-green-400' 
          : 'text-red-500 dark:text-red-400'
      }`}>
        {isActive ? 'ACTIVE' : 'INACTIVE'}
      </span>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      {/* Desktop/Tablet View */}
      <div className="hidden sm:block">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden md:table-cell">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Roles
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-gray-600 dark:text-gray-200 font-medium">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map(role => (
                          <span 
                            key={role._id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                          >
                            {role.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ToggleButton 
                        isActive={user.status === "Active"}
                        onChange={onStatusChange}
                        userId={user._id}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => onEdit(user)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteClick(user._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Mobile View */}
      <div className="sm:hidden space-y-4">
        {users.map((user) => (
          <div key={user._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-200 font-medium">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onEdit(user)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full"
                >
                  <FiEdit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => onDeleteClick(user._id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex flex-wrap gap-1 mb-2">
                {user.roles?.map(role => (
                  <span 
                    key={role._id}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                  >
                    {role.name}
                  </span>
                ))}
              </div>
              <ToggleButton 
                isActive={user.status === "Active"}
                onChange={onStatusChange}
                userId={user._id}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable; 