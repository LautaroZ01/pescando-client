import { useQuery } from "@tanstack/react-query";
import { IoClose } from "react-icons/io5";
import { generateRoutine, getHabitsForRoutine } from "../../API/AiAPI";
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import ReactMarkdown from 'react-markdown';

export default function GenerateRoutineModel() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isOpen = queryParams.get('isOpen');

    const [isLoadingRoutine, setIsLoadingRoutine] = useState(false);
    const [isRoutineGenerated, setIsRoutineGenerated] = useState(false);
    const [routine, setRoutine] = useState('');


    const { data: habitsData, isLoading } = useQuery({
        queryKey: ['habits'],
        queryFn: getHabitsForRoutine
    });

    const handleGenerateRoutine = useCallback(async () => {
        if (!habitsData) return;

        setRoutine('');
        setIsLoadingRoutine(true);
        setIsRoutineGenerated(true);

        try {
            if (!habitsData) return;
            const streamResponse = await generateRoutine({ habits: habitsData });

            for await (const chunk of streamResponse) {
                setRoutine((prev) => prev + chunk);
            }

            setIsLoadingRoutine(false);

        } catch (error) {
            console.error("Error generando rutina:", error);
            setIsLoadingRoutine(false);
        }
    }, [habitsData]);

    useEffect(() => {
        const storedRoutine = localStorage.getItem('routine');

        if (isOpen && !isLoading) {
            if (storedRoutine) {
                setRoutine(storedRoutine);
                setIsRoutineGenerated(true);
            } else {
                handleGenerateRoutine();
            }
        }
    }, [isOpen, isLoading, handleGenerateRoutine]);

    const closeModal = () => {
        navigate(location.pathname, { replace: true });
    };

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full grid place-items-center bg-black/10 backdrop-blur-xl ${isOpen ? 'block' : 'hidden'}`}>
            <div className="relative p-8 w-full max-w-2xl h-full md:h-auto bg-orange-50 rounded-lg">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="title-style text-4xl">Tu rutina para hoy</h1>
                    <button onClick={closeModal} className="cursor-pointer">
                        <IoClose size={24} />
                    </button>
                </header>

                {isRoutineGenerated && (
                    <section className="my-8 flex flex-col items-center justify-center border-b border-gray-300 pb-4">
                        {isLoadingRoutine ? (
                            <p className="text-gray-500 animate-pulse">Generando...</p>
                        ) : (
                            <h3 className="text-center text-xl font-semibold">Rutina generada con IA</h3>
                        )}
                        <div className="max-w-[80ch] mt-8 mx-auto pt-4 prose prose-lg">
                            <ReactMarkdown>
                                {routine}
                            </ReactMarkdown>
                        </div>
                    </section>
                )}

                <footer className="flex gap-4 mt-10">
                    <button onClick={closeModal} className="cursor-pointer px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors duration-pro grow">
                        Cancelar
                    </button>
                    <button className="cursor-pointer bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105 grow text-center duration-pro">
                        Guardar
                    </button>
                </footer>
            </div>
        </div>
    );
}