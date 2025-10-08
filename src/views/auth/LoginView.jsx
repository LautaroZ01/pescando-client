import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { autheticateUser } from "../../API/AuthAPI";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
      navigate('/')
    }
  })

  const handleLogin = (formData) => mutate(formData)

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="space-y-8 p-10 mt-10 bg-white"
      noValidate
    >
      <div className="flex flex-col gap-5">
        <label
          className="font-normal text-2xl"
        >Email</label>

        <input
          id="email"
          type="email"
          placeholder="Email de Registro"
          className="input-style"
          {...register("email", {
            required: "El Email es obligatorio",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "E-mail no válido",
            },
          })}
        />
        {errors.email && (
          <ErrorMessage>{errors.email.message}</ErrorMessage>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <label
          className="font-normal text-2xl"
        >Password</label>

        <input
          type="password"
          placeholder="Password de Registro"
          className="input-style"
          {...register("password", {
            required: "El Password es obligatorio",
          })}
        />
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
      </div>

      <button
        type="submit"
        className="cursor-pointer"
      >Iniciar Sesión</button>

    </form>
  )
}
