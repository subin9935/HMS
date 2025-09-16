import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-2xl font-bold">MER SHARE</Link>
        <nav className="flex gap-6">
          <Link to="/" className="hover:text-blue-200 transition-colors duration-300">Home</Link>
          {user ? (
            <>
              <Link to="/profile" className="hover:text-blue-200 transition-colors duration-300">Profile</Link>
              <button
                onClick={logout}
                className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition-colors duration-300">Login</Link>
              <Link to="/register" className="hover:text-blue-200 transition-colors duration-300">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}