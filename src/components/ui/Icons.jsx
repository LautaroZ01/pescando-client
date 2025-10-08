import { MdEmail } from "react-icons/md";

const icons = [
    {
        name: 'email',
        icon: <MdEmail />
    }
]

export default function Icons({ name, className }) {
    const icon = icons.find(icon => icon.name === name)?.icon;

    return (
        <>
            {icon ? <span className={className}>{icon}</span> : <span>Icono no encontrado</span>}
        </>
    )
}
