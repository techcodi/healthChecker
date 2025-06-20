import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabase";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, seectiom) => {
        setUser(seectiom?.user || null);
        setLoading(false);
      }
    );

    return () => {
      listener?.data?.subscription?.unsubscribe();
    };
  }, []);

  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
