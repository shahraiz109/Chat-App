import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login, signup } from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socket";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "chat_app_auth";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      try {
        const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw || !mounted) {
          return;
        }
        const parsed = JSON.parse(raw);
        if (parsed?.token && parsed?.user) {
          setToken(parsed.token);
          setUser(parsed.user);
          connectSocket(parsed.token);
        }
      } catch (err) {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        if (mounted) {
          setBootstrapping(false);
        }
      }
    };
    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const authenticate = async (type, name, email, password) => {
    setLoading(true);
    setError("");
    try {
      const apiFn = type === "signup" ? signup : login;
      const payload = type === "signup" ? { name, email, password } : { email, password };
      const response = await apiFn(payload);
      setToken(response.token);
      setUser(response.user);
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ token: response.token, user: response.user })
      );
      connectSocket(response.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    disconnectSocket();
    setToken(null);
    setUser(null);
    setError("");
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      bootstrapping,
      loading,
      error,
      login: (email, password) => authenticate("login", "", email, password),
      signup: (name, email, password) => authenticate("signup", name, email, password),
      logout,
    }),
    [token, user, bootstrapping, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
