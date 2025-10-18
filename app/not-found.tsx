// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-950 text-gray-100">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg text-gray-400 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
      >
        Go Back Home
      </a>
    </div>
  );
}