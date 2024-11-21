import React from "react"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface FormWarningProps {
    message?: string;
}

export const FormWarning = ({ message }: FormWarningProps) => {
    if (!message) return null

    return (
        <div className='bg-yellow-400/35 p-3 text-yellow-500 rounded-md flex items-center gap-x-2 text-sm text-destructive'>
            <ExclamationTriangleIcon className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
}
