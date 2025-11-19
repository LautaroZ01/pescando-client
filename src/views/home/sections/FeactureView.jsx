import { Link } from 'react-router'
import { FaArrowRight } from "react-icons/fa";

export default function FeactureView() {
    return (
        <section className="container-section py-20 my-10">
            <div className="flex flex-col gap-4 items-center">
                <h2 className="text-4xl font-bold text-center">
                    Características que{' '}
                    <span className="text-style">
                        transforman
                    </span>
                </h2>
                <p className="text-gray-600 text-lg">Todo lo que necesitas para construir hábitos duraderos</p>
            </div>

            <div className="grid grid-cols-2 grid-rows-4 gap-8 max-w-5xl mx-auto min-h-[400px] mt-10">
                <article className="row-span-4 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 rounded-2xl flex flex-col justify-between group relative overflow-hidden">
                    <div className="space-y-4 p-6">
                        <h3 className="text-2xl font-bold">Diseña tus <span className="text-style">hábitos</span></h3>
                        <p className="text-gray-500">No te limites. Crea hábitos semanales (como 'Ir al gimnasio 3 veces/sem') o mensuales (como 'Leer 1 libro al mes').</p>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl z-10">
                        <img src="/pex-con-idea.webp" alt="Pescando hábitos" className="rounded-2xl object-cover aspect-square translate-x-4 ml-auto translate-y-24 max-w-96 group-hover:scale-105 transition-transform duration-400" />
                    </div>
                    <div className="absolute inset-0 m-auto w-60 h-60 bg-pink-400 rounded-full opacity-50 blur-3xl group-hover:bg-pink-500 transition-colors duration-300"></div>
                </article>
                <article className="row-span-2 flex flex-col items-start justify-between bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 rounded-2xl group">
                    <div className="space-y-4 p-6">
                        <h3 className="text-2xl font-bold">Tu <span className="text-style">progreso</span>, claro y visual</h3>
                        <p className='text-gray-600 leading-relaxed'>Desde tu dashboard personal podrás ver qué toca hoy. Completa tus hábitos y edita tus rutinas..</p>
                    </div>
                    <div className="relative rounded-2xl z-10  w-full max-h-30">
                        <img src="/grafica.webp" alt="Pescando hábitos" className="rounded-2xl aspect-square -translate-y-10 object-cover ml-auto max-w-40 group-hover:scale-105 transition-transform duration-400" />
                    </div>
                </article>
                <article className="row-span-2 col-start-2 row-start-3 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 rounded-2xl p-6 flex flex-col justify-start relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-300 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

                    <div className="relative z-10 flex flex-col gap-4 justify-start items-start">
                        <h3 className="text-2xl font-bold">
                            Comienza tu <span className="text-style">viaje</span> hoy
                        </h3>

                        <p className="text-gray-600 leading-relaxed">
                            Únete gratis para sincronizar tus hábitos en la nube y acceder desde cualquier dispositivo.
                        </p>

                        <Link className="btn-primary px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 mt-12 hover:shadow-lg transition-all duration-pro">
                            Crear cuenta gratis
                            <FaArrowRight />
                        </Link>
                    </div>
                </article>
            </div>

        </section>
    )
}
