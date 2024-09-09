interface NotificationProps {
    title: string
    message: string
    isSuccess: boolean
    onDismiss: () => void
}

export default function Notification({ title, message, isSuccess, onDismiss }: NotificationProps) {
    const borderColor = isSuccess ? 'border-black' : 'border-white'
    const bgColor = isSuccess ? 'bg-white' : 'bg-black'
    const textColor = isSuccess ? 'text-black' : 'text-white'
    const buttonBgColor = isSuccess ? 'bg-black' : 'bg-white'
    const buttonTextColor = isSuccess ? 'text-white' : 'text-black'

    return (
        <div
            className={`w-full p-4 border-4 ${borderColor} ${bgColor} ${textColor}`}
            style={{ fontFamily: 'monospace' }}
        >
            <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold">{title.toUpperCase()}</h2>
                <button
                    onClick={onDismiss}
                    className={`${buttonBgColor} ${buttonTextColor} px-2 py-1 text-sm font-bold border-2 ${borderColor} hover:${bgColor} hover:${textColor} transition-colors`}
                >
                    DISMISS
                </button>
            </div>
            <p className="text-lg">{message}</p>
        </div>
    )
}