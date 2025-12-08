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
import IndexView from "./views/user/IndexView";
import IndexHomeView from "./views/home/IndexView";
import ProtectedRoute from "./components/middleware/ProtectedRoute";
import Dashboard from "./views/habits/Dashboard";
import HabitsView from "./views/habits/HabitsView"; //

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Landing pública */}
                <Route path="/" element={<HomeLayout />}>
                    <Route index element={<IndexHomeView />} />
                </Route>

                {/* Auth */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route index path="login" element={<LoginView />} />
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

