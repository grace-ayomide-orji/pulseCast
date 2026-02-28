export function Loader({ className = "" }: { className?: string }) {
    return(
        <div className={`m-0 w-full flex justify-center items-center gap-[8px] py-8 ${className}`}>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    )
}
