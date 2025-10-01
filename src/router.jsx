import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroView from "./views/home/HeroView";
import HomeLayout from "./layouts/HomeLayout";

export default function router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeLayout />}>
                    <Route index element={<HeroView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
