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
    <section className="bg-white p-10 min-w-lg rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center">Inicio de Sesion </h1>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="container-form"
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

        <button
          type="submit"
        >Iniciar Sesión</button>

        <div>
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>
      </form>

      <div className="px-10 space-y-4">
        <Link
          to={'http://localhost:3000/api/auth/google'}
          className="flex items-center justify-center w-full space-x-2 bg-gray-100 border border-gray-200 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors duration-pro"
        >
          <FcGoogle />
          <p className="font-bold text-sm text-gray-500">Google</p>
        </Link>
        <Link to={'/auth/register'} className="text-center block text-sm text-gray-500">Registrate</Link>
      </div>

    </section>
  )
}
