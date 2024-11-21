'use client'

import { PacmanLoader } from "react-spinners";
import { FormSuccess } from "@/app/components/FormSuccess";
import { FormError } from "@/app/components/FormError";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface DataResponseProps {
    status: number;
    message: string;
}

export const NewVerificationForm = () => {

    const [message, setMessage] = useState<string | undefined>("");
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>()
    const [success, setSuccess] = useState<boolean>()

    const onFetch = async () => {

        try {
            console.log("HELLO");
            const response = await fetch(`/api/new-verification-email/${token}`, {
                method: "GET",
            })

            const data: DataResponseProps = await response.json()
            console.log(data);


            if (data.status !== 200) {
                setSuccess(false)
                setError(true)
                setMessage(data.message)
            }
            else {
                setSuccess(true)
                setError(false)
                setMessage(data.message)
            }
        } catch (error) {
            setMessage("An error occured while verifying the email.")
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = useCallback(() => {
        if (!token) {
            setMessage("Token does not exist!");
            setError(true);
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <main className="flex flex-col min-h-screen p-6 bg-gray-100 md:justify-center md:p-24">
            <title>Email Verification</title>
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                <section className="md:w-1/3 p-6 border-2 border-solid bg-white rounded-lg mx-auto flex justify-center items-center shadow-lg">
                    <div className="container max-w-md w-full">
                        <h1 className="text-2xl font-semibold text-black-500 text-center mb-4">Confirming your email</h1>
                        <div className="flex justify-center items-center w-full mb-8">
                            {loading && <PacmanLoader />}
                            {!loading && error && <FormError message={message} />}
                            {!loading && success && <FormSuccess message={message} />}
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={async () => { onFetch() }}
                                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            >
                                Verify Email
                            </button>
                        </div>
                        <Link className="flex text-sm text-blue-500 mt-8 text-center justify-center" href="/login">Back to login</Link>
                    </div>
                </section>
            </div>
        </main>
    )
}