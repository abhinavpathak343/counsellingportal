export function Button({ children, className, ...props }) {
  return (
    <Button
      className={`py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}
