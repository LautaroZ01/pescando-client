import { isAxiosError } from "axios"
import api from "../libs/axios"

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

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

export const uploadImageToCloudinary = async (file) => {
    // 1. Preparamos el paquete
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        // 2. Enviamos el paquete a Cloudinary

        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error al subir imagen a Cloudinary');
        }

        const data = await response.json();
        
        // 3. ¡Éxito! Devolvemos la URL y el ID que nos dio Cloudinary
        return { 
            secure_url: data.secure_url, 
            public_id: data.public_id 
        };
        
    } catch (error) {
        console.error("Error en Cloudinary:", error);
        throw error;
    }
};

export async function changeProfilePhoto(photoData) {
    try {
        const { data } = await api.post('/user/photo', photoData)
        return data
    } catch (error) {
        throw error
    }
}