import { LuCopy } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router";

export default function CommunityView() {
    const styleIcon = 'size-20';
    const community = [
        {
            title: 'Comparte Logros',
            description: 'Publica tus victorias, comparte tus rachas y recibe apoyo de otros usuarios que están en el mismo camino.',
            image: '/medalla-de-oro.webp',
            icon: '',
            color: ''
        },
        {
            title: 'Copia Hábitos',
            description: '¿Viste un hábito interesante que creó otro usuario? Cópialo a tu propio dashboard con un solo clic y empieza a construirlo.',
            image: '',
            icon: <LuCopy className={`${styleIcon} text-pink-500`} />
        },
        {
            title: '+10,000',
            description: 'Usuarios transformando sus vidas. No necesitas empezar de cero. Inspírate explorando los hábitos de nuestra comunidad.',
            image: '',
            icon: <FaUsers className={`${styleIcon} text-orange-500`} />
        }
    ]
    return (
        <section id="community" className="py-40 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-pink-50 to-orange-50">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">
                    No lo hagas solo.{' '}
                    <span className="bg-linear-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                        Únete a la comunidad Pescando.
                    </span>
                </h2>
                <p className="text-xl text-gray-700">La motivación es más fácil cuando se comparte.</p>
            </div>
            <div className="grid gap-6 grid-cols-3 container mx-auto">
                {community.map((card, index) => (
                    <article key={index} className="bg-white rounded-2xl p-10 space-y-8 hover:shadow-2xl transition-all duration-pro">
                        {card.image ? <img src={card.image} alt="Medalla pescando" className="size-20 object-contain aspect-square" /> : card.icon}
                        <div className="space-y-2">
                            <h4 className="text-lg font-bold">{card.title}</h4>
                            <p>{card.description}</p>
                        </div>
                    </article>
                ))}
            </div>
            <div className="text-center mt-16">
                <Link to="/community" className="btn-primary px-12 py-4 font-bold">Conoce nuestra comunidad</Link>
            </div>
        </section>
    )
}
