import {
  authLogin, authRegister, authForgot, authChangePassword, authDeleteAccount,
  clearSession, loadUser, saveUser, normalizeMobile,
} from "../../shared/api.js";

const ROLE = "worker";

export const DEFAULT_WORKER = {
  name: "Municipal Worker",
  username: "",
  email: "",
  phone: "",
  area: "",
  workerId: "",
  department: "Municipal Services",
};

/* Backend user -> the profile shape the Worker pages already use. */
const toWorker = (u) => ({
  name: u.name,
  username: u.username || "",
  email: u.email || "",
  phone: u.phone || "",
  area: u.area || "",
  workerId: u.workerId || "",
  department: u.department || "Municipal Services",
});

const remember = (user) => {
  const w = toWorker(user);
  saveUser(ROLE, user);
  try { localStorage.setItem("workerAccount", JSON.stringify(w)); } catch { /* ignore */ }
};

/** Account logic for the Worker portal, plugged into the shared AuthPage. */
export const workerAdapter = {
  async login({ identifier, password }) {
    const res = await authLogin(ROLE, { identifier, password });
    if (!res.ok) return { ok: false, error: res.error };
    remember(res.user);
    return { ok: true };
  },

  async signup({ name, username, email, phone, area, password }) {
    const res = await authRegister(ROLE, {
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: `+91${normalizeMobile(phone)}`,
      area: area.trim(),
      password,
    });
    if (!res.ok) return { ok: false, error: res.error };
    remember(res.user);
    return { ok: true };
  },

  async forgot({ identifier }) {
    await authForgot(ROLE, { identifier });
    return {
      ok: true,
      message: "Your password reset request has been submitted. Please contact your municipal authority to complete the reset.",
    };
  },
};

export function getWorker() {
  const u = loadUser(ROLE);
  return u ? toWorker(u) : { ...DEFAULT_WORKER };
}

export function workerLogout() {
  clearSession(ROLE);
  try { localStorage.removeItem("workerAccount"); } catch { /* ignore */ }
}

export async function workerChangePassword({ currentPassword, newPassword }) {
  const res = await authChangePassword(ROLE, { currentPassword, newPassword });
  return res.ok ? { ok: true } : { ok: false, message: res.error };
}

export async function workerDeleteAccount({ password }) {
  const res = await authDeleteAccount(ROLE, { password });
  if (!res.ok) return { ok: false, message: res.error };
  workerLogout();
  return { ok: true };
}
