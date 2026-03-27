import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const AUTH_STORAGE_KEY = "portfolio-website-auth";

type JwtPayload = Record<string, unknown>;

export type AuthUser = {
  username: string | null;
  email: string | null;
  name: string | null;
};

type StoredAuth = {
  token: string;
  user: AuthUser | null;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, fallbackUser?: Partial<AuthUser>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const readString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
};

const normalizeStoredUser = (value: unknown): AuthUser | null => {
  if (!isRecord(value)) {
    return null;
  }

  const username = readString(value.username);
  const email = readString(value.email);
  const name = readString(value.name);

  if (!username && !email && !name) {
    return null;
  }

  return {
    username,
    email,
    name,
  };
};

const decodeJwtPayload = (token: string): JwtPayload | null => {
  const parts = token.split(".");

  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const binary = window.atob(padded);
    const bytes = Uint8Array.from(binary, (character) =>
      character.charCodeAt(0),
    );
    const parsed = JSON.parse(new TextDecoder().decode(bytes));

    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const isTokenExpired = (payload: JwtPayload | null): boolean => {
  const exp = payload?.exp;

  return typeof exp === "number" && Date.now() >= exp * 1000;
};

const buildUser = (
  payload: JwtPayload | null,
  fallbackUser: Partial<AuthUser> = {},
): AuthUser | null => {
  const username =
    readString(payload?.username) ??
    readString(payload?.preferred_username) ??
    readString(payload?.sub) ??
    fallbackUser.username ??
    null;
  const email = readString(payload?.email) ?? fallbackUser.email ?? null;
  const name =
    readString(payload?.name) ?? fallbackUser.name ?? username ?? email;

  if (!username && !email && !name) {
    return null;
  }

  return {
    username,
    email,
    name,
  };
};

const buildStoredAuth = (
  token: string,
  fallbackUser: Partial<AuthUser> = {},
): StoredAuth | null => {
  const payload = decodeJwtPayload(token);

  if (isTokenExpired(payload)) {
    return null;
  }

  return {
    token,
    user: buildUser(payload, fallbackUser),
  };
};

const readStoredAuth = (): StoredAuth | null => {
  const rawAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawAuth) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawAuth);

    if (!isRecord(parsed)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    const token = readString(parsed.token);
    const storedUser = normalizeStoredUser(parsed.user);

    if (!token) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    const auth = buildStoredAuth(token, storedUser ?? {});

    if (!auth) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return {
      ...auth,
      user: auth.user ?? storedUser,
    };
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<StoredAuth | null>(() => readStoredAuth());

  useEffect(() => {
    const syncAuth = (event: StorageEvent) => {
      if (event.key !== AUTH_STORAGE_KEY) {
        return;
      }

      setAuth(readStoredAuth());
    };

    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const login = (token: string, fallbackUser: Partial<AuthUser> = {}) => {
    const nextAuth = buildStoredAuth(token, fallbackUser);

    if (!nextAuth) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      setAuth(null);
      return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth?.token ?? null,
        user: auth?.user ?? null,
        isAuthenticated: Boolean(auth?.token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};
