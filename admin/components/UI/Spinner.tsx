

export default function Spinner({ size = 20 }: { size?: number }) {
    return (
        
        <div className="loader" aria-hidden>
            <div className="spinner-border flex items-center justify-center  text-white" role="status">
                <div className={`w-${size} h-${size} border-2 border-current border-t-transparent rounded-full animate-spin`}></div>
            </div>
        </div>
        
    )
}