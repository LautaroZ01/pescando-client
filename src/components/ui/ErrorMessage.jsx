export default function ErrorMessage({ children }) {
    return (
        <div className="text-center my-4 bg-red-100 text-red-600 font-bold p-2 rounded-lg text-sm">
            {children}
        </div>
    )
}