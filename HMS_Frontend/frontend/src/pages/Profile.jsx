import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user } = AuthContext()

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
        <p><span className="font-semibold">Username:</span> {user?.username}</p>
        <p><span className="font-semibold">Email:</span> {user?.email}</p>
        <p><span className="font-semibold">Name:</span> {user?.first_name} {user?.last_name}</p>
      </div>
    </div>
  );
}
