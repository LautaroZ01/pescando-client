export default function FeactureView() {
    return (
        <section className="container-section py-20">
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
                <div className="row-span-4 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 rounded-2xl flex flex-col justify-between group relative overflow-hidden">
                    <div className="space-y-4 p-6">
                        <h3 className="text-2xl font-bold">Diseña tus <span className="text-style">hábitos</span></h3>
                        <p className="text-gray-500">No te limites. Crea hábitos semanales (como 'Ir al gimnasio 3 veces/sem') o mensuales (como 'Leer 1 libro al mes').</p>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl z-10">
                        <img src="/pex-con-idea.webp" alt="Pescando hábitos" className="rounded-2xl object-cover translate-x-4 ml-auto translate-y-24 max-w-96 group-hover:scale-105 transition-transform duration-400" />
                    </div>
                    <div className="absolute inset-0 m-auto w-60 h-60 bg-pink-400 rounded-full opacity-50 blur-3xl group-hover:bg-pink-500 transition-colors duration-300"></div>

                </div>
                <div className="row-span-2">2</div>
                <div className="row-span-2 col-start-2 row-start-3">3</div>
            </div>

        </section>
    )
}
