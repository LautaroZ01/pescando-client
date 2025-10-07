import { Link } from 'react-router-dom'

export default function NotFoundView() {
    return (
        <>
            <h1 className='block text-2xl font-bold'>Pagina no encontrada</h1>
            <p className='block text-gray-500 text-center mt-4'>Tal vez quieras volver al <Link to='/' className='text-blue-500 hover:underline'>inicio</Link></p>
        </>
    )
}
