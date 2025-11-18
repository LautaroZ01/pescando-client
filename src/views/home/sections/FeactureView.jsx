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
                <div className="row-span-4 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 rounded-2xl flex flex-col justify-between">
                    <div className="space-y-4 p-6">
                        <h3 className="text-2xl font-bold">Diseña tus <span className="text-style">hábitos</span></h3>
                        <p>No te limites. Crea hábitos semanales (como 'Ir al gimnasio 3 veces/sem') o mensuales (como 'Leer 1 libro al mes').</p>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl">
                        <img src="/pex-con-idea.webp" alt="Pescando hábitos" className="rounded-2xl object-cover translate-x-4 ml-auto translate-y-24 max-w-96" />
                    </div>

                </div>
                <div className="row-span-2">2</div>
                <div className="row-span-2 col-start-2 row-start-3">3</div>
            </div>

        </section>
    )
}
