import api from "../libs/axios"

export async function getProfile() {
    try {
        const { data } = await api.get('/auth/user')
        return data 
    } catch (error) {
        console.error(error)
        throw error
    }
}

