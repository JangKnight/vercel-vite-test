export const apiBaseUrl = import.meta.env.VITE_URL;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

export const readErrorMessage = (
  value: unknown,
  fallback: string = "Request failed.",
): string => {
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

export const getAuthHeaders = (
  token: string | null,
  headers: Record<string, string> = {},
) => {
  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchJson = async (path: string, init: RequestInit = {}) => {
  const response = await fetch(`${apiBaseUrl}${path}`, init);
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(readErrorMessage(result, "Request failed."));
  }

  return result;
};
