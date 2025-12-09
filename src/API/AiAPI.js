import { isAxiosError } from "axios"
import { openRouter } from "../libs/ia"
import { streamText } from "ai"
import api from "../libs/axios"

export async function generateRoutine({ habits }) {
    console.log(habits)
    const result = streamText({
        model: openRouter('openai/gpt-oss-20b:free'),
        system: `Actúa como un experto en gestión del tiempo. Tu objetivo es organizar una agenda diaria para el usuario basándote exclusivamente en la lista de hábitos y tareas proporcionada, sin inventar hábitos nuevos.

Reglas obligatorias:

El formato de salida debe ser únicamente una lista cronológica.

Cada línea debe empezar con una hora específica (ej: 08:00 AM) seguida de la actividad.

Debes incluir las tareas específicas de cada hábito dentro del bloque de tiempo asignado.

Intercala breves periodos de 'Descanso' o 'Tiempo libre' entre los hábitos principales para hacer la rutina realista.

Sé conciso y directo, no escribas introducciones ni conclusiones, solo la lista.`,
        prompt: [
            {
                role: 'user',
                content: `Estos son los hábitos del usuario: ${JSON.stringify(habits)}`
            }
        ]
    })

    return result.textStream
}

export async function getHabitsForRoutine() {
    try {
        const url = '/habits'
        const { data } = await api.get(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}