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

export async function confirmAccount(formData) {
    try {
        const url = '/auth/confirm-account'
        const { data } = await api.post(url, formData)
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function requestConfirmationCode(formData) {
    try {
        const url = '/auth/request-code'
        const { data } = await api.post(url, formData)
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function autheticateUser(formData) {
    try {
        const url = '/auth/login'
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getUser() {
    try {
        const { data } = await api.get('/auth/user')
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function logoutUser() {
    try {
        const { data } = await api.get('/auth/logout');
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al cerrar sesión');
    }
}
