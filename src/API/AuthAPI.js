import { isAxiosError } from "axios"
import api from "../libs/axios"

export async function createAccount(formData) {
    try {
        const url = '/auth/create-account'
        const { data } = await api.post(url, formData)
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}