import { createSignal, createContext, useContext } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

export type User = {
  id: number;
  name: string;
  email: string;
};

export interface AuthContextValue {
  user: () => User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider(props: { children: JSX.Element }) {
  const [user, setUser] = createSignal<User | null>(null);

  // Pulihkan user dari localStorage saat aplikasi dimulai
  const stored = localStorage.getItem("authUser");
  if (stored) {
    try {
      setUser(JSON.parse(stored));
    } catch (err) {
      console.error("Gagal memuat user dari localStorage", err);
    }
  }

  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const saved = JSON.parse(localStorage.getItem("registeredUser") || "null");
        if (saved && saved.email === email && saved.password === password) {
          const newUser = { id: saved.id, name: saved.name, email: saved.email };
          setUser(newUser);
          localStorage.setItem("authUser", JSON.stringify(newUser));
        } else {
          alert("Email atau password salah");
        }
        resolve();
      }, 500);
    });
  };

  const register = async (name: string, email: string, password: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser = { id: Date.now(), name, email, password };
        localStorage.setItem("registeredUser", JSON.stringify(newUser));
        const safeUser = { id: newUser.id, name, email };
        setUser(safeUser);
        localStorage.setItem("authUser", JSON.stringify(safeUser));
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus digunakan dalam <AuthProvider>");
  return context;
}