import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroView from "./views/home/HeroView";
import HomeLayout from "./layouts/HomeLayout";
import AuthLayout from "./layouts/AuthLayout";
import NotFoundView from "./views/404/NotFoundView";
import { ToastContainer } from "react-toastify";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";

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
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path='*' element={<NotFoundView />} />
                </Route>
            </Routes>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </BrowserRouter>
    )
}
