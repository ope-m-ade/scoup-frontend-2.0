const envApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
const API_BASE_URL = (
  envApiBaseUrl || (import.meta.env.DEV ? "http://localhost:8000/api" : "")
).replace(/\/+$/, "");
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
  if (!API_BASE_URL) {
    throw new Error("Missing VITE_API_BASE_URL in production environment.");
  }

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

  adminMe: async () => apiCall("/admin/me/"),

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

  forgotPassword: async (email: string) =>
    rawApiCall("/auth/forgot-password/", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: async (token: string, password: string) =>
    rawApiCall("/auth/reset-password/", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),

  sendOtp: async (institutional_email: string) =>
    apiCall("/auth/send-otp/", {
      method: "POST",
      body: JSON.stringify({ institutional_email }),
    }),

  verifyOtp: async (otp: string) =>
    apiCall("/auth/verify-otp/", {
      method: "POST",
      body: JSON.stringify({ otp }),
    }),
};

export const cvAPI = {
  upload: async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return apiCall("/faculty/upload-cv-papers/", { method: "POST", body });
  },
  confirm: async (data: {
    profile?: { title?: string; bio?: string; department?: string };
    papers?: any[];
    patents?: any[];
    projects?: any[];
  }) => apiCall("/faculty/confirm-cv-items/", { method: "POST", body: JSON.stringify(data) }),
  searchPapers: async (q: string) => apiCall(`/faculty/paper-search/?q=${encodeURIComponent(q)}`),
  generateBio: async (data: {
    name?: string; title?: string; department?: string;
    qualifications?: any[]; research_interests?: string; keywords?: string[];
  }) => apiCall("/faculty/generate-bio/", { method: "POST", body: JSON.stringify(data) }),
  generateResearchInterests: async (data: {
    title?: string; department?: string;
    qualifications?: any[]; keywords?: string[]; papers?: string[];
  }) => apiCall("/faculty/generate-research-interests/", { method: "POST", body: JSON.stringify(data) }),
  generateProfileKeywords: async (data: {
    department?: string; bio?: string; research_interests?: string; title?: string;
  }) => apiCall("/faculty/generate-profile-keywords/", { method: "POST", body: JSON.stringify(data) }),
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
    apiCall(`/papers/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: async (id: number) => apiCall(`/papers/${id}/`, { method: "DELETE" }),
  bulkPublish: async (ids?: number[]) =>
    apiCall("/faculty/papers/bulk-publish/", {
      method: "POST",
      body: JSON.stringify(ids ? { ids } : { all_draft: true }),
    }),
  extractAbstract: async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return apiCall("/faculty/extract-abstract/", { method: "POST", body });
  },
  generateKeywords: async (title: string, abstract?: string) =>
    apiCall("/faculty/generate-keywords/", {
      method: "POST",
      body: JSON.stringify({ title, abstract }),
    }),
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

export const networkAPI = {
  discovery: async ({ q = "", limit = 50 }: { q?: string; limit?: number } = {}) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (limit) params.set("limit", String(limit));
    const query = params.toString();
    return apiCall(`/network/discovery/${query ? `?${query}` : ""}`);
  },
};

export const contactAPI = {
  getTeam: async () => apiCall("/contact/team/"),
  getSettings: async () => apiCall("/contact/settings/"),

  adminGetTeam: async () => apiCall("/admin/contact/team/"),
  adminCreateMember: async (data: any) =>
    apiCall("/admin/contact/team/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  adminUpdateMember: async (id: number, data: any) =>
    apiCall(`/admin/contact/team/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  adminDeleteMember: async (id: number) =>
    apiCall(`/admin/contact/team/${id}/`, { method: "DELETE" }),
  adminUpdateSettings: async (data: any) =>
    apiCall("/admin/contact/settings/", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  adminUploadPhoto: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("photo", file);
    return apiCall(`/admin/contact/team/${id}/photo/`, {
      method: "POST",
      body: formData,
    });
  },
};

export const adminAPI = {
  getPendingFaculty: async () => apiCall("/admin/faculty/?pending=true"),
  approveFaculty: async (id: number) =>
    apiCall(`/admin/faculty/${id}/approve/`, { method: "POST" }),
  rejectFaculty: async (id: number, reason?: string) =>
    apiCall(`/admin/faculty/${id}/reject/`, {
      method: "POST",
      body: JSON.stringify({ reason: reason || "" }),
    }),
};

export { apiCall };
