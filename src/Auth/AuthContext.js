import React, { createContext, useState, useEffect, useContext } from "react";
import { useMsal } from "@azure/msal-react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { accounts, instance } = useMsal();
  const user = accounts[0] || null;

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch user info + role when user changes
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) {
        setRole(null);
        setUserId(null);
        setLoading(false);
        return;
      }
  
      const email = user.username;
      const name = user.name || email.split("@")[0];
  
      try {
        // Insert or get user, and receive role + id
        const res = await fetch('http://localhost:4000/api/users', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        });
  
        const data = await res.json();
  
        if (data.role && data.id) {
          setRole(data.role);
          setUserId(data.id);
        } else {
          setError("No role or ID returned from server.");
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setError("Failed to fetch user info.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserInfo();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, role, loading, error, instance, userId }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);