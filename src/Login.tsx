import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth.tsx";

type LoginCredentials = {
  username: string;
  password: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const extractErrorMessage = (value: unknown, fallback: string): string => {
  if (!isRecord(value)) {
    return fallback;
  }

  if (typeof value.message === "string" && value.message.trim().length > 0) {
    return value.message;
  }

  if (typeof value.detail === "string" && value.detail.trim().length > 0) {
    return value.detail;
  }

  return fallback;
};

const extractToken = (value: unknown): string | null => {
  if (!isRecord(value)) {
    return null;
  }

  const nestedData = isRecord(value.data) ? value.data : null;
  const token =
    value.token ??
    value.accessToken ??
    value.access_token ??
    value.jwt ??
    nestedData?.token ??
    nestedData?.accessToken ??
    nestedData?.access_token ??
    nestedData?.jwt;

  return typeof token === "string" && token.trim().length > 0 ? token : null;
};

const buildFormBody = (values: Record<string, string>): string => {
  return new URLSearchParams(values).toString();
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: LoginCredentials) => {
      const response = await fetch(`${import.meta.env.VITE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: buildFormBody({ username, password }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(extractErrorMessage(result, "Login failed."));
      }

      const token = extractToken(result);

      if (!token) {
        throw new Error("Login response did not include a JWT.");
      }

      return { token, username };
    },
    onSuccess: ({ token, username }) => {
      login(token, { username });
      navigate("/demos");
    },
  });

  const sendData = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    if (typeof username !== "string" || typeof password !== "string") {
      return;
    }

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return;
    }

    loginMutation.mutate({
      username: trimmedUsername,
      password,
    });
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Sign in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={sendData} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                type="text"
                name="username"
                required
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                name="password"
                required
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {loginMutation.isError ? (
          <p className="mt-4 text-center text-sm text-red-400">
            {loginMutation.error.message}
          </p>
        ) : null}

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Not a member?{" "}
          <Link
            to="/demos/signup"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Sign up
          </Link>
        </p>
        <p className="mt-10 text-center text-sm/6 text-gray-400">
          OR: Use test user -&gt; test / abc123
        </p>
      </div>
    </div>
  );
};

export default Login;
