// frontend/notes-app/src/components/ui/Button.js

export function Input({ className, ...props }) {
  return (
    <input
      className={`py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${className}`}
      {...props}
    />
  );
}

