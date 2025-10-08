export default function ErrorMessage({ children }) {
    return (
        <div className="text-center my-4 bg-red-50 text-red-600 font-semibold p-2 rounded-lg text-sm">
            {children}
        </div>
    )
}