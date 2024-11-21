import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (session?.user) {
        return (
            <div>
                <h1>{session.user.email}</h1>
            </div>
        )
    } else if (session?.admin) {
        return (
            <div>
                <h1>{session.admin.email}</h1>
            </div>
        )
    } else {
        // Redirect user to login page or handle the session absence as per your requirement
        return (
            <div>
                <h1>No session found</h1>
            </div>
        )
    }
}
