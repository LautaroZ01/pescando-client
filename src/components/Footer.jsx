import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-20">
                    <div>
                        <h4 className="text-white font-bold mb-4 flex items-center space-x-2">
                            <img src="/pezicon.png" alt="Pescando Icono" className='size-8' />
                            <span>Pescando</span>
                        </h4>
                        <ul className="space-y-2">
                            <li><a href="#caracteristicas" className="hover:text-white transition">Características</a></li>
                            <li><a href="#comunidad" className="hover:text-white transition">Comunidad</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Compañía</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition">Sobre nosotros</a></li>
                            <li><a href="#" className="hover:text-white transition">Blog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
                            <li><a href="#" className="hover:text-white transition">Términos y Condiciones</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Síguenos</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-white transition">
                                <FaInstagram />
                            </a>
                            <a href="#" className="hover:text-white transition">
                                <FaFacebook />
                            </a>
                            <a href="#" className="hover:text-white transition">
                                <FaTwitter />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center">
                    <p>© 2025 Pescando. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}