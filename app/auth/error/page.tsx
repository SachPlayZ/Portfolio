import Link from "next/link";

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You are not authorized to access this page. Please sign in with an
          authorized account.
        </p>
        <Link
          href="/auth/signin"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
