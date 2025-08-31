import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
