import { useState } from "react";
import { Link, NavLink } from "react-router";
import { GrHomeRounded, GrUser } from "react-icons/gr";
import { FaUserCog, FaUser, FaFish } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { LuLogOut } from "react-icons/lu";
import { FaTag } from "react-icons/fa";


export default function SideBar() {
    const [isOpen, setIsOpen] = useState(true)
    const { logout } = useAuth()

    const links = [
        { to: '/dashboard', label: 'Dashboard', icon: <GrHomeRounded /> },
        { to: '/dashboard/habits', label: 'Hábitos', icon: <FaUser /> },
        { to: '/community', label: 'Barcos', icon: <FaFish /> },
        { to: '/dashboard/category', label: 'Categorías', icon: <FaTag /> },
    ];


    return (
        <aside className={`bg-gradient-to-b sidebar from-bg-200 to-bg-orange/75 rounded-2xl h-full ${isOpen ? 'w-64' : 'w-16 items-center'} flex flex-col justify-between p-4 transition-all duration-pro`}>
            <div>
                <button onClick={() => setIsOpen(!isOpen)} className="p-4 cursor-pointer flex items-center justify-start gap-2">
                    <span className="p-2 rounded-full bg-primary-100 flex items-center justify-center">🎣</span>
                    <h1 className={`${isOpen ? 'block' : 'hidden'} font-bold title-style text-2xl`}>Pescando</h1>
                </button>
                <nav className="p-4 space-y-4">
                    {links.map((link) => (
                        <NavLink key={link.to} to={link.to} className={({ isActive }) => `flex items-center gap-2 text-gray-800 ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>
                            <span className="p-2 rounded-full bg-primary-100 flex items-center justify-center">{link.icon}</span>
                            {isOpen && <span className="">{link.label}</span>}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div>
                <Link to='/profile' className="flex items-center gap-2 p-4">
                    <span className="p-2 rounded-full bg-primary-100 flex items-center justify-center text-gray-800">
                        <FaUserCog />
                    </span>
                    <span className={`${isOpen ? 'block' : 'hidden'}`}>Ver perfil</span>
                </Link>
                <button className="flex items-center gap-2 p-4 cursor-pointer" onClick={logout}>
                    <span className="p-2 rounded-full bg-primary-100 flex items-center justify-center text-gray-800">
                        <LuLogOut />
                    </span>
                    <span className={`${isOpen ? 'block' : 'hidden'}`}>Cerrar sesión</span>
                </button>
            </div>
        </aside>
    )
}
