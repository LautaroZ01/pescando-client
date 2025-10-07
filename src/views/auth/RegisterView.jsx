import { useForm } from 'react-hook-form'
import { useMutation } from "@tanstack/react-query";
import { createAccount } from '../../API/AuthAPI';
import { toast } from 'react-toastify';
import ErrorMessage from '../../components/ui/ErrorMessage';

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
        <form onSubmit={handleSubmit(handleRegister)} noValidate>
            <div>
                <label htmlFor="firstname">Nombre</label>
                <input className="input-style" type="text" id="firstname" {...register('firstname', {
                    required: 'El nombre es requerido',
                    minLength: {
                        value: 2,
                        message: 'El nombre debe tener al menos 2 caracteres'
                    }
                })} />
                {errors.firstname && (
                    <ErrorMessage>{errors.firstname.message}</ErrorMessage>
                )}
            </div>
            <div>
                <label htmlFor="lastname">Apellido</label>
                <input className="input-style" type="text" id="lastname" {...register('lastname', {
                    required: 'El apellido es requerido',
                    minLength: {
                        value: 2,
                        message: 'El apellido debe tener al menos 2 caracteres'
                    }
                })} />
                {errors.lastname && (
                    <ErrorMessage>{errors.lastname.message}</ErrorMessage>
                )}
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input className="input-style" type="email" id="email" {...register('email', {
                    required: 'El email es requerido',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'El email debe ser válido'
                    }
                })} />
                {errors.email && (
                    <ErrorMessage>{errors.email.message}</ErrorMessage>
                )}
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input className="input-style" type="password" id="password" {...register('password', {
                    required: 'El password es requerido',
                    minLength: {
                        value: 8,
                        message: 'El password debe tener al menos 8 caracteres'
                    }
                })} />
                {errors.password && (
                    <ErrorMessage>{errors.password.message}</ErrorMessage>
                )}
            </div>
            <div>
                <label htmlFor="password_confirmation">Confirmar Password</label>
                <input className="input-style" type="password" id="password_confirmation" {...register('password_confirmation', {
                    required: 'La confirmación de password es requerida',
                    validate: value => value === password || 'Los Passwords no son iguales'
                })} />
                {errors.password_confirmation && (
                    <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                )}
            </div>
            <button type="submit">Registrarse</button>
        </form>
    )
}
