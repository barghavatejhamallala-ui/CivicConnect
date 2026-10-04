import { useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, Eye, EyeOff, KeyRound, LogOut, X } from "lucide-react";
import { DELETE_REASONS } from "./deleteReasons.js";
import "./accountDialogs.css";

/**
 * Account dialogs shared by the Citizen, Authority and Worker profile pages,
 * so Change password / Delete account / Log out look and behave identically.
 *
 * Each portal supplies its own handler. Handlers may be async and should
 * resolve to { ok: boolean, message?: string }.
 */

function Dialog({ title, icon: Icon, tone = "navy", onClose, children, busy = false }) {
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !busy && onClose();
    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, busy]);

  return (
    <div className="cc-dialog__overlay" onMouseDown={() => !busy && onClose()}>
      <div
        ref={panelRef}
        tabIndex={-1}
        className="cc-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="cc-dialog__close"
          onClick={onClose}
          disabled={busy}
          aria-label="Close dialog"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <div className={`cc-dialog__icon cc-dialog__icon--${tone}`}>
          <Icon size={26} aria-hidden="true" />
        </div>
        <h2 id={titleId} className="cc-dialog__title">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, autoComplete, hint }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="cc-field">
      <label htmlFor={id}>{label}</label>
      <div className="cc-field__wrap">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="cc-field__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
      {hint && <small>{hint}</small>}
    </div>
  );
}

/* ----------------------------------------------------------------- Logout */

export function LogoutDialog({ portalLabel, onCancel, onConfirm }) {
  return (
    <Dialog title="Log out of CivicConnect?" icon={LogOut} onClose={onCancel}>
      <p className="cc-dialog__text">
        You will be signed out of the {portalLabel} and returned to the login page.
      </p>
      <div className="cc-dialog__actions">
        <button type="button" className="cc-btn cc-btn--ghost" onClick={onCancel} autoFocus>
          Stay signed in
        </button>
        <button type="button" className="cc-btn cc-btn--navy" onClick={onConfirm}>
          Log out
        </button>
      </div>
    </Dialog>
  );
}

/* --------------------------------------------------------- Change password */

export function ChangePasswordDialog({ onClose, onSubmit }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!current) return setError("Please enter your current password.");
    if (next.length < 8) return setError("New password must be at least 8 characters.");
    if (next !== confirm) return setError("New password and confirmation do not match.");
    if (next === current) return setError("New password must be different from the current one.");

    setBusy(true);
    try {
      const result = await onSubmit({ currentPassword: current, newPassword: next });
      if (result?.ok === false) setError(result.message || "Could not change the password.");
      else setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Dialog title="Password updated" icon={KeyRound} tone="navy" onClose={onClose}>
        <p className="cc-dialog__text">Your password has been changed successfully.</p>
        <div className="cc-dialog__actions">
          <button type="button" className="cc-btn cc-btn--navy" onClick={onClose} autoFocus>
            Done
          </button>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog title="Change password" icon={KeyRound} onClose={onClose} busy={busy}>
      <p className="cc-dialog__text">Update your password to keep your account secure.</p>
      <form className="cc-dialog__form" onSubmit={handleSubmit} noValidate>
        <PasswordField label="Current password" value={current} onChange={setCurrent} autoComplete="current-password" />
        <PasswordField label="New password" value={next} onChange={setNext} autoComplete="new-password" hint="Minimum 6 characters" />
        <PasswordField label="Confirm new password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
        {error && (
          <p className="cc-dialog__error" role="alert">
            {error}
          </p>
        )}
        <div className="cc-dialog__actions">
          <button type="button" className="cc-btn cc-btn--ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="cc-btn cc-btn--navy" disabled={busy}>
            {busy ? "Saving…" : "Update password"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

/* ---------------------------------------------------------- Delete account */

export function DeleteAccountDialog({ onClose, onSubmit, reasons = DELETE_REASONS }) {
  const reasonId = useId();
  const detailsId = useId();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!reason) return setError("Please select a reason for deleting your account.");
    if (reason === "Other" && !details.trim()) return setError("Please tell us your reason in the box below.");
    if (!password) return setError("Please enter your password to confirm.");

    setBusy(true);
    try {
      const result = await onSubmit({ password, reason, details: details.trim() });
      if (result?.ok === false) setError(result.message || "Could not delete the account.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog title="Delete your account?" icon={AlertTriangle} tone="danger" onClose={onClose} busy={busy}>
      <p className="cc-dialog__text">
        This permanently removes your account and signs you out. This action cannot be undone.
      </p>
      <form className="cc-dialog__form" onSubmit={handleSubmit} noValidate>
        <div className="cc-field">
          <label htmlFor={reasonId}>Why are you deleting your account?</label>
          <select id={reasonId} value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">Select a reason</option>
            {reasons.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="cc-field">
          <label htmlFor={detailsId}>
            {reason === "Other" ? "Tell us more" : "Additional details (optional)"}
          </label>
          <textarea
            id={detailsId}
            rows={3}
            maxLength={300}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Share anything that would help us improve…"
          />
        </div>
        <PasswordField label="Confirm your password" value={password} onChange={setPassword} autoComplete="current-password" />
        {error && (
          <p className="cc-dialog__error" role="alert">
            {error}
          </p>
        )}
        <div className="cc-dialog__actions">
          <button type="button" className="cc-btn cc-btn--ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="cc-btn cc-btn--danger" disabled={busy}>
            {busy ? "Deleting…" : "Delete account"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
