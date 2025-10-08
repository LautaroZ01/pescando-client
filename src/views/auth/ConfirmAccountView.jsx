import { useMutation } from "@tanstack/react-query"
import { confirmAccount } from "../../API/AuthAPI"
import { useState } from "react"
import { toast } from "react-toastify"
import { PinInput, PinInputField } from "@chakra-ui/pin-input"
import { Link } from "react-router-dom"

export default function ConfirmAccountView() {
    const [token, setToken] = useState('')

    const handleChange = (token) => {
        setToken(token)
    }

    const { mutate } = useMutation({
        mutationFn: confirmAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })

    const handleComplete = (token) => mutate({ token })

    return (
        <>
            <form
                className="space-y-8 p-10 bg-white mt-10"
            >
                <label
                    className="font-normal text-2xl text-center block"
                >Código de 6 dígitos</label>

                <div className="flex justify-center gap-5">
                    <PinInput otp value={token} onChange={handleChange} onComplete={handleComplete}>
                        <PinInputField className="size-10 p-3 rounded-lg border border-gray-300 placeholder-white" />
                        <PinInputField className="size-10 p-3 rounded-lg border border-gray-300 placeholder-white" />
                        <PinInputField className="size-10 p-3 rounded-lg border border-gray-300 placeholder-white" />
                        <PinInputField className="size-10 p-3 rounded-lg border border-gray-300 placeholder-white" />
                        <PinInputField className="size-10 p-3 rounded-lg border border-gray-300 placeholder-white" />
                        <PinInputField className="size-10 p-3 rounded-lg border border-gray-300 placeholder-white" />
                    </PinInput>
                </div>
            </form>
            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to='/auth/request-code'
                    className="text-center text-gray-500 font-normal"
                >
                    Solicitar un nuevo Código
                </Link>
            </nav>
        </>
    )
}
