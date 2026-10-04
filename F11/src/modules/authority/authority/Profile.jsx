import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, KeyRound, LogOut, Mail, MapPin, Phone, ShieldCheck, Trash2, UserRound } from "lucide-react";
import Sidebar from "./Sidebar";
import ProfilePage from "../../../shared/ProfilePage.jsx";
import {
  ChangePasswordDialog,
  DeleteAccountDialog,
  LogoutDialog,
} from "../../../shared/AccountDialogs.jsx";
import { DELETE_REASONS } from "../../../shared/deleteReasons.js";
import { getComplaints } from "../data/complaints";
import {
  getAuthority,
  authorityName,
  authorityLogout,
  authorityChangePassword,
  authorityDeleteAccount,
} from "../authAdapter.js";
import "./Profile.css";

const DELETE_REASONS_AUTHORITY = [
  "I no longer work in this department",
  "I have been transferred to another ward",
  ...DELETE_REASONS.slice(1),
];

function Profile() {
  const navigate = useNavigate();
  const [dialog, setDialog] = useState(null); // "password" | "delete" | "logout"
  const me = getAuthority();

  /* Live counts from the shared complaint store */
  const stats = useMemo(() => {
    const all = getComplaints();
    return [
      { label: "Completed", value: all.filter((c) => c.status === "Completed").length },
      { label: "In Progress", value: all.filter((c) => c.status === "Pending" || c.status === "In Progress").length },
      { label: "New Complaints", value: all.filter((c) => c.status === "New").length },
    ];
  }, []);

  return (
    <div className="profile-page">
      <Sidebar />

      <main className="profile-main">
        <ProfilePage
          name={authorityName()}
          subtitle="Civic Authority"
          details={[
            { icon: ShieldCheck, label: "Role", value: "Civic Authority" },
            { icon: Building2, label: "Department", value: "Municipal Administration" },
            { icon: UserRound, label: "Employee ID", value: me.employeeId || "—" },
            { icon: MapPin, label: "Area", value: me.area || "—" },
            { icon: Mail, label: "Email", value: me.email || "—" },
            { icon: Phone, label: "Phone", value: me.phone || "—" },
          ]}
          stats={stats}
          actions={[
            { key: "password", label: "Change Password", description: "Update your password to keep your account secure.", icon: KeyRound, onClick: () => setDialog("password") },
            { key: "delete", label: "Delete Account", description: "You will be asked for a reason. This permanently removes your account.", icon: Trash2, tone: "danger", onClick: () => setDialog("delete") },
            { key: "logout", label: "Log Out", icon: LogOut, tone: "danger", onClick: () => setDialog("logout") },
          ]}
        >
          {dialog === "password" && (
            <ChangePasswordDialog
              onClose={() => setDialog(null)}
              onSubmit={authorityChangePassword}
            />
          )}
          {dialog === "delete" && (
            <DeleteAccountDialog
              reasons={DELETE_REASONS_AUTHORITY}
              onClose={() => setDialog(null)}
              onSubmit={async (values) => {
                const result = await authorityDeleteAccount(values);
                if (result.ok) navigate("/", { replace: true });
                return result;
              }}
            />
          )}
          {dialog === "logout" && (
            <LogoutDialog
              portalLabel="Authority Portal"
              onCancel={() => setDialog(null)}
              onConfirm={() => {
                authorityLogout();
                navigate("/", { replace: true });
              }}
            />
          )}
        </ProfilePage>
      </main>
    </div>
  );
}

export default Profile;
