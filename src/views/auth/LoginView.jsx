import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { autheticateUser } from "../../API/AuthAPI";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaFingerprint } from "react-icons/fa";

export default function LoginView() {
  const defaultValues = {
    email: '',
    password: '',
  }
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  const { mutate } = useMutation({
    mutationFn: autheticateUser,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Iniciando Sesion')
      navigate('/dashboard')
    }
  })

  const handleLogin = (formData) => mutate(formData)

  return (
    <section className="container-form">
      <h1 className="title-style">Inicio de Sesion </h1>
      <form
        onSubmit={handleSubmit(handleLogin)}
        noValidate
      >
        <div className="container-input">
          <MdEmail />
          <input
            id="email"
            type="email"
            placeholder="pescando@gmail.com"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
        </div>
        {errors.email && (
          <ErrorMessage>{errors.email.message}</ErrorMessage>
        )}

        <div className="container-input">
          <FaFingerprint />
          <input
            type="password"
            placeholder="********"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
        </div>
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}

        <button
          type="submit"
        >Iniciar Sesión</button>
      </form>

      <div className="px-10 space-y-6">
        <Link
          to={'http://localhost:3000/api/auth/google'}
          className="flex items-center justify-center w-full space-x-2 backdrop-blur-lg px-4 py-2 rounded-md group"
        >
          <FcGoogle />
          <p className="font-bold text-sm text-secundary-400 group-hover:text-secundary-500 transition-colors duration-pro">Google</p>
        </Link>
        <Link to={'/auth/register'} className="btn-link">¿No tienes una cuenta? Crea una</Link>
      </div>

    </section>
  )
}
