import { BrowserRouter, Routes, Route } from "react-router";
import HomeLayout from "./layouts/HomeLayout";
import AuthLayout from "./layouts/AuthLayout";
import NotFoundView from "./views/404/NotFoundView";
import { ToastContainer } from "react-toastify";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import ConfirmAccountView from "./views/auth/ConfirmAccountView";
import RequestNewCodeView from "./views/auth/RequestNewCodeView";
import DashboardLayout from "./layouts/DashboardLayout";
import ProfileView from "./views/profile/ProfileView";
import IndexHomeView from "./views/home/IndexView";
import ProtectedRoute from "./components/middleware/ProtectedRoute";
import CommunityView from "./views/community/CommunityViews";
import Dashboard from "./views/habits/Dashboard";
import HabitsView from "./views/habits/HabitsView";
import IndexView from "./views/home/IndexView";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Landing pública */}
                <Route path="/" element={<HomeLayout />}>
                    <Route index element={<IndexView />} />
                    <Route path="/profile" element={<ProfileView />} />

                    <Route index element={<IndexHomeView />} />
                </Route>

                {/* COMUNIDAD PÚBLICA - Sin layout, accesible para todos */}
                <Route path="/community" element={<CommunityView />} />

                {/* Auth */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<LoginView />} />
                    <Route path="register" element={<RegisterView />} />
                    <Route path="confirm-account" element={<ConfirmAccountView />} />
                    <Route path="request-code" element={<RequestNewCodeView />} />
                </Route>

                {/* Área protegida */}
                <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/habits" element={<HabitsView />} />
                    </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundView />} />
            </Routes>

            <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
        </BrowserRouter>
    );
}