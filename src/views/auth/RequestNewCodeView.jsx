import { toast } from "react-toastify";
import { requestConfirmationCode } from "../../API/AuthAPI";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../components/ui/ErrorMessage";

export default function RequestNewCodeView() {
    const defaultValues = {
        email: ''
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

    const { mutate } = useMutation({
        mutationFn: requestConfirmationCode,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)

        }
    })

    const handleRequestCode = (formData) => mutate(formData)

    return (
        <form
            onSubmit={handleSubmit(handleRequestCode)}
            className="space-y-8 p-10 rounded-lg bg-white mt-10"
            noValidate
        >
            <div className="flex flex-col gap-5">
                <label
                    className="font-normal text-2xl"
                    htmlFor="email"
                >Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email de Registro"
                    className="input-style"
                    {...register("email", {
                        required: "El Email de registro es obligatorio",
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

            <button
                type="submit"
                className=" font-black cursor-pointer"
            >Enviar Código</button>
        </form>
    )
}
