import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

// Your app's user type (matching relevant supabase properties you want)
type User = {
  id: string;
  email: string | null;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }: { data: { session: Session | null } }) => {
        if (data.session && data.session.user) {
          const supabaseUser: SupabaseUser = data.session.user;
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email,
          });
        } else {
          setUser(null);
        }
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        if (session && session.user) {
          const supabaseUser: SupabaseUser = session.user;
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email,
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
