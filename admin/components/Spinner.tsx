

export default function Spinner() {
  return (
    <div className="loader" aria-hidden>
      <div className="spinner-border flex items-center justify-center  text-white" role="status">
        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )
}