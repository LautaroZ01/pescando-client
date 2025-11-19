import { Link } from "react-router";

export default function CTAView() {
    return (
        <section className="py-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-500 to-orange-500">
            <div className="max-w-4xl mx-auto text-center text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    ¿Listo para construir tu mejor versión?
                </h2>
                <p className="text-xl mb-20 opacity-90">
                    Únete a Pescando gratis. Los primeros 3 hábitos son por nuestra cuenta.
                </p>
                <Link to='/auth/register' className="px-10 py-4 bg-white text-orange-500 rounded-full text-lg font-bold hover:bg-white/90 transition-all duration-pro">
                    Registrarse Gratis
                </Link>
            </div>
        </section>
    )
}
