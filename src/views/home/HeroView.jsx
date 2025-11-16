import { Link } from "react-router";

export default function HeroView() {
    return (
        <section className="relative py-30 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 overflow-hidden">
            <div className="flex gap-4 container mx-auto items-center justify-center relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-400 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-pink-400 rounded-full opacity-50 blur-3xl"></div>
                <div className="w-1/2 flex flex-col gap-8 items-start">
                    <h1 className="text-2xl md:text-4xl font-bold leading-tight">
                        Deja de intentar.{' '}
                        <span className="bg-gradient-to-r block from-pink-500 to-orange-500 bg-clip-text text-transparent">
                            Empieza a pescar
                        </span>{' '}
                        hábitos que perduren.
                    </h1>
                    <p className="text-xl text-gray-700 text-balance">
                        Con Pescando, diseña, rastrea y domina tus rutinas. Desde hábitos mensuales complejos
                        hasta tareas diarias simples, todo en un solo lugar.
                    </p>
                    <Link to='/auth/register' className="z-10 px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-pro">
                        Comienza tu transformación
                    </Link>
                </div>
                <div className="w-1/2 mask-radial-at-center mask-radial-from-60% mask-radial-to-80% mask-x-from-80% mask-x-to-93%">
                    <video className="aspect-video" src="/pescando-habitos.mp4" autoPlay loop muted></video>
                </div>
            </div>
        </section>
    )
}