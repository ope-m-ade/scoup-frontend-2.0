const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const ACCESS_KEY = "facultyAccessToken";
const REFRESH_KEY = "facultyRefreshToken";

const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

const setTokens = (access?: string, refresh?: string) => {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

async function rawApiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const isFormDataBody = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!isFormDataBody && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      message = err?.detail || err?.error || err?.message || message;
    } catch {
      try {
        const text = await res.text();
        if (text) {
          // Strip HTML tags if server returned an HTML error page.
          const cleaned = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          if (cleaned) {
            message = cleaned.slice(0, 240);
          }
        }
      } catch {}
    }
    throw new Error(message);
  }

  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

let isRefreshing = false;

async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
): Promise<any> {
  try {
    return await rawApiCall(endpoint, options);
  } catch (err: any) {
    const msg = String(err?.message || "");
    const looks401 =
      msg.includes("HTTP 401") || msg.toLowerCase().includes("token");

    if (looks401 && retry && getRefreshToken()) {
      try {
        if (!isRefreshing) {
          isRefreshing = true;
          await authAPI.refresh();
          isRefreshing = false;
        }
        return await apiCall(endpoint, options, false);
      } catch {
        isRefreshing = false;
        clearTokens();
        throw new Error("Session expired. Please log in again.");
      }
    }

    throw err;
  }
}

export const authAPI = {
  login: async (usernameOrEmail: string, password: string) => {
    const data = await rawApiCall("/token/", {
      method: "POST",
      body: JSON.stringify({ username: usernameOrEmail, password }),
    });

    setTokens(data.access, data.refresh);
    return data;
  },

  register: async ({
    username,
    email,
    password,
    firstName,
    lastName,
  }: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    try {
      return await rawApiCall("/faculty/signup/", {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });
    } catch {
      return rawApiCall("/faculty/signup/", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });
    }
  },

  me: async () => apiCall("/faculty/me/"),

  refresh: async () => {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error("No refresh token");

    const data = await rawApiCall("/token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
    });

    setTokens(data.access, refresh);
    return data;
  },

  logout: () => {
    clearTokens();
  },

  isAuthenticated: () => !!getAccessToken(),
};

export const facultyAPI = {
  getAll: async () => apiCall("/faculty/"),
  getById: async (id: number) => apiCall(`/faculty/${id}/`),
  update: async (id: number, data: any) =>
    apiCall(`/faculty/${id}/`, { method: "PUT", body: JSON.stringify(data) }),
  updateMe: async (data: any) =>
    apiCall("/faculty/me/", { method: "PATCH", body: JSON.stringify(data) }),
  uploadPhoto: async (file: File) => {
    const body = new FormData();
    body.append("photo", file);
    return apiCall("/faculty/upload-photo/", { method: "POST", body });
  },
};

export const papersAPI = {
  getAll: async () => apiCall("/papers/"),
  getById: async (id: number) => apiCall(`/papers/${id}/`),
  create: async (data: any) =>
    apiCall("/papers/", { method: "POST", body: JSON.stringify(data) }),
  update: async (id: number, data: any) =>
    apiCall(`/papers/${id}/`, { method: "PUT", body: JSON.stringify(data) }),
  delete: async (id: number) => apiCall(`/papers/${id}/`, { method: "DELETE" }),
};

export const projectsAPI = {
  getAll: async () => apiCall("/projects/"),
  getById: async (id: number) => apiCall(`/projects/${id}/`),
  create: async (data: any) =>
    apiCall("/projects/", { method: "POST", body: JSON.stringify(data) }),
  update: async (id: number, data: any) =>
    apiCall(`/projects/${id}/`, { method: "PUT", body: JSON.stringify(data) }),
  delete: async (id: number) =>
    apiCall(`/projects/${id}/`, { method: "DELETE" }),
};

export const patentsAPI = {
  getAll: async () => apiCall("/patents/"),
  getById: async (id: number) => apiCall(`/patents/${id}/`),
  create: async (data: any) =>
    apiCall("/patents/", { method: "POST", body: JSON.stringify(data) }),
  update: async (id: number, data: any) =>
    apiCall(`/patents/${id}/`, { method: "PUT", body: JSON.stringify(data) }),
  delete: async (id: number) =>
    apiCall(`/patents/${id}/`, { method: "DELETE" }),
};

export { apiCall };
