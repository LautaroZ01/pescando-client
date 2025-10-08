import { useForm } from 'react-hook-form'
import { useMutation } from "@tanstack/react-query";
import { createAccount } from '../../API/AuthAPI';
import { toast } from 'react-toastify';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { Link } from 'react-router-dom';

export default function RegisterView() {
    const defaultValues = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: ''
    }

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm(defaultValues)

    const password = watch('password')

    const { mutate } = useMutation({
        mutationFn: createAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
        }
    })

    const handleRegister = (formData) => mutate(formData)

    return (
        <section className="bg-white p-10 min-w-lg rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold text-center">Crea tu cuenta</h1>

            <form onSubmit={handleSubmit(handleRegister)} noValidate className="container-form">
                <div className="container-input">
                    <input placeholder='Tu nombre' type="text" id="firstname" {...register('firstname', {
                        required: 'El nombre es requerido',
                        minLength: {
                            value: 2,
                            message: 'El nombre debe tener al menos 2 caracteres'
                        }
                    })} />
                </div>
                <div className="container-input">
                    <input placeholder='Tu apellido' type="text"
                        id="lastname"
                        {...register('lastname', {
                            required: 'El apellido es requerido',
                            minLength: {
                                value: 2,
                                message: 'El apellido debe tener al menos 2 caracteres'
                            }
                        })} />
                </div>
                <div className="container-input">
                    <input placeholder='pescando@gmail.com' type="email" id="email" {...register('email', {
                        required: 'El email es requerido',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'El email debe ser válido'
                        }
                    })} />
                </div>
                <div className="container-input">
                    <input placeholder="Tu contraseña" type="password" id="password" {...register('password', {
                        required: 'El password es requerido',
                        minLength: {
                            value: 8,
                            message: 'El password debe tener al menos 8 caracteres'
                        }
                    })} />
                </div>
                <div className="container-input">
                    <input placeholder="Confirmar contraseña" type="password" id="password_confirmation" {...register('password_confirmation', {
                        required: 'La confirmación de password es requerida',
                        validate: value => value === password || 'Los Passwords no son iguales'
                    })} />
                </div>
                <button type="submit">Registrarse</button>
                <div>
                    {errors.firstname && (
                        <ErrorMessage>{errors.firstname.message}</ErrorMessage>
                    )}
                    {errors.lastname && (
                        <ErrorMessage>{errors.lastname.message}</ErrorMessage>
                    )}
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                    {errors.password_confirmation && (
                        <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                    )}
                </div>
            </form>

            <div>
                <Link to={'/auth/login'} className="text-center block text-sm text-gray-500">Ya tienes una cuenta? Inicia Sesión</Link>
            </div>
        </section>
    )
}
