import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, logoutUser } from "../API/AuthAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export const useAuth = () => {
    const navigate = useNavigate()

    const { data, isError, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: 0,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: logoutUser,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.removeQueries({ queryKey: ['user'] })
            navigate('/')
        }
    })

    const logout = () => mutate()

    return { data, isError, isLoading, logout }
}