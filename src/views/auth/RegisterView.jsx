import { useForm } from 'react-hook-form'
import { useMutation } from "@tanstack/react-query";
import { createAccount } from '../../API/AuthAPI';
import { toast } from 'react-toastify';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { Link } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import { FaFingerprint, FaLock, FaUser } from 'react-icons/fa';

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
        <section className="container-form">
            <h1 className="title-style">Crea tu cuenta</h1>

            <form onSubmit={handleSubmit(handleRegister)} noValidate>
                <div className="flex gap-4">
                    <div>
                        <div className="container-input">
                            <FaUser />
                            <input placeholder='Tu nombre' type="text" id="firstname" {...register('firstname', {
                                required: 'El nombre es requerido',
                                minLength: {
                                    value: 2,
                                    message: 'El nombre debe tener al menos 2 caracteres'
                                }
                            })} />
                        </div>
                        {errors.firstname && (
                            <ErrorMessage>{errors.firstname.message}</ErrorMessage>
                        )}
                    </div>
                    <div>
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
                        {errors.lastname && (
                            <ErrorMessage>{errors.lastname.message}</ErrorMessage>
                        )}
                    </div>
                </div>
                <div className="container-input">
                    <MdEmail />
                    <input placeholder='pescando@gmail.com' type="email" id="email" {...register('email', {
                        required: 'El email es requerido',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'El email debe ser válido'
                        }
                    })} />
                </div>
                {errors.email && (
                    <ErrorMessage>{errors.email.message}</ErrorMessage>
                )}
                <div className="container-input">
                    <FaFingerprint />
                    <input placeholder="Tu contraseña" type="password" id="password" {...register('password', {
                        required: 'El password es requerido',
                        minLength: {
                            value: 8,
                            message: 'El password debe tener al menos 8 caracteres'
                        }
                    })} />
                </div>
                {errors.password && (
                    <ErrorMessage>{errors.password.message}</ErrorMessage>
                )}
                <div className="container-input">
                    <FaLock />
                    <input placeholder="Confirmar contraseña" type="password" id="password_confirmation" {...register('password_confirmation', {
                        required: 'La confirmación de password es requerida',
                        validate: value => value === password || 'Los Passwords no son iguales'
                    })} />
                </div>
                {errors.password_confirmation && (
                    <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                )}
                <button type="submit">Registrarse</button>
            </form>

            <div>
                <Link to={'/auth/login'} className="btn-link">¿Ya tienes una cuenta? Inicia Sesión</Link>
            </div>
        </section>
    )
}
