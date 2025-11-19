import { LuCopy } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";

export default function CommunityView() {
    return (
        <section id="comunidad" className="py-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-orange-50">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">
                    No lo hagas solo.{' '}
                    <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                        Únete a la comunidad Pescando.
                    </span>
                </h2>
                <p className="text-xl text-gray-700">La motivación es más fácil cuando se comparte.</p>
            </div>
            <div className="grid gap-6 grid-cols-3 container mx-auto">
                <article className="bg-white rounded-2xl p-10 space-y-8">
                    <img src="/medalla-de-oro.webp" alt="Medalla pescando" className="size-20 object-contain aspect-square" />
                    <div className="space-y-2">
                        <h4 className="text-lg font-bold">Comparte Logros</h4>
                        <p>Publica tus victorias, comparte tus rachas y recibe apoyo de otros usuarios que están en el mismo camino.</p>

                    </div>
                </article>
                <article className="bg-white rounded-2xl p-10 space-y-8">
                    <LuCopy className="size-20 text-pink-500" />
                    <div className="space-y-2">
                        <h4 className="text-lg font-bold">Copia Hábitos</h4>
                        <p>¿Viste un hábito interesante que creó otro usuario? Cópialo a tu propio dashboard con un solo clic y empieza a construirlo.</p>
                    </div>
                </article>
                <article className="bg-white rounded-2xl p-10 space-y-8">
                    <FaUsers className="size-20 text-orange-500" />
                    <div className="space-y-2">
                        <h4 className="text-lg font-bold">+10,000</h4>
                        <p>Usuarios transformando sus vidas. No necesitas empezar de cero. Inspírate explorando los hábitos de nuestra comunidad.</p>
                    </div>
                </article>
            </div>
        </section>
    )
}
