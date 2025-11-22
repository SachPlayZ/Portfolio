import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/auth.config";
import AdminDashboard from "@/components/admin/admin-dashboard";
import AdminLogin from "@/components/admin/admin-login";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.isAdmin;

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
