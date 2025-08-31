import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setMessage("Check your email for the confirmation link!");
      // Optionally, redirect user after signup (after confirmation)
      // navigate("/login");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-indigo-400 mb-6 text-center">
          Sign Up
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        {message && (
          <div className="text-green-500 text-sm text-center">{message}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded font-semibold transition"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 underline hover:text-indigo-600"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
