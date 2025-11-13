import { BrowserRouter, Routes, Route } from "react-router";
import HeroView from "./views/home/HeroView";
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
import ProtectedRoute from "./components/middleware/ProtectedRoute";

export default function router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeLayout />}>
                    <Route index element={<HeroView />} />
                </Route>

                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<LoginView />} index />
                    <Route path="register" element={<RegisterView />} />
                    <Route path='confirm-account' element={<ConfirmAccountView />} />
                    <Route path='request-code' element={<RequestNewCodeView />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<IndexView />} />
                    </Route>
                </Route>

                <Route path='*' element={<NotFoundView />} />
            </Routes>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </BrowserRouter>
    )
}
