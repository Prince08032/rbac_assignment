const EmptyState = ({ title, description, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {Icon && <Icon className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default EmptyState; 