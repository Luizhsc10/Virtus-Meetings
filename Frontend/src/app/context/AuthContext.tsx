import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { socket } from "../../lib/socket";

type User = {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  bio?: string;
  nativeLanguage?: string;
  learningLanguage?: string;
  location?: string;
  isOnboarded: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const connectSocket = (userId: string) => {
    if (!socket.connected) socket.connect();
    socket.emit("join-user-room", userId);
  };

  const disconnectSocket = () => {
    if (socket.connected) socket.disconnect();
  };

  const checkAuth = async () => {
    try {
      console.log("checking auth...");
      const res = await api.get("/api/auth/check");
      console.log("auth success:", res.data);

      setUser(res.data);
      connectSocket(res.data._id);
    } catch (error) {
      console.log("auth failed:", error);
      setUser(null);
      disconnectSocket();
    } finally {
      console.log("auth check finished");
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.post("/api/auth/login", { email, password });
    setUser(res.data.user);
    connectSocket(res.data.user._id);
  };

  const signup = async (fullName: string, email: string, password: string) => {
    const res = await api.post("/api/auth/signup", {
      fullName,
      email,
      password,
    });
    setUser(res.data.user);
    connectSocket(res.data.user._id);
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
    disconnectSocket();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
