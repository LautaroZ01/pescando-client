import { isAxiosError } from "axios"
import api from "../libs/axios"

export async function getProfile() {
    try {
        const { data } = await api.get('/auth/user')
        return data 
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
 
}

// Llamo a la ruta para que el back actualice los datos 
export async function updateProfile(formData) {
    console.log(formData);
    const url = '/user'
    try {
        const { data } = await api.put(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
        throw new Error('Error al actualizar el perfil')
    }

}