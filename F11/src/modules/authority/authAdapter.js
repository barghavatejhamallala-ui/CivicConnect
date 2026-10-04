import {
  authLogin, authRegister, authForgot, authChangePassword, authDeleteAccount,
  clearSession, loadUser, saveUser, normalizeMobile,
} from "../../shared/api.js";

const ROLE = "authority";

const remember = (user) => {
  saveUser(ROLE, user);
  try {
    localStorage.setItem("civicAuthorityName", user.name);
    if (user.employeeId) localStorage.setItem("civicAuthorityId", user.employeeId);
  } catch { /* ignore */ }
};

/** Account logic for the Authority portal, plugged into the shared AuthPage. */
export const authorityAdapter = {
  async login({ identifier, password }) {
    const res = await authLogin(ROLE, { identifier, password });
    if (!res.ok) return { ok: false, error: res.error };
    remember(res.user);
    return { ok: true };
  },

  async signup({ name, employeeId, email, mobile, password }) {
    const res = await authRegister(ROLE, {
      name: name.trim(),
      employeeId: employeeId.trim(),
      email: email.trim(),
      phone: `+91${normalizeMobile(mobile)}`,
      password,
    });
    if (!res.ok) return { ok: false, error: res.error };
    remember(res.user);
    return { ok: true };
  },

  async forgot({ employeeId, email }) {
    await authForgot(ROLE, { employeeId, email });
    return {
      ok: true,
      message: "If the details are registered, password reset instructions will be sent to your email.",
    };
  },
};

/** The signed-in officer's cached profile (empty object when signed out). */
export const getAuthority = () => loadUser(ROLE) || {};

/** Display name for the signed-in officer. */
export function authorityName() {
  return getAuthority().name?.trim() || "Municipal Officer";
}

export function authorityLogout() {
  clearSession(ROLE);
  try {
    localStorage.removeItem("civicAuthorityName");
    localStorage.removeItem("civicAuthorityId");
  } catch { /* ignore */ }
}

export async function authorityChangePassword({ currentPassword, newPassword }) {
  const res = await authChangePassword(ROLE, { currentPassword, newPassword });
  return res.ok ? { ok: true } : { ok: false, message: res.error };
}

export async function authorityDeleteAccount({ password }) {
  const res = await authDeleteAccount(ROLE, { password });
  if (!res.ok) return { ok: false, message: res.error };
  authorityLogout();
  return { ok: true };
}
