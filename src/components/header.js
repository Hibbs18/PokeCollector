'use client'

import { Client, Account } from "appwrite";
import { useEffect, useState } from "react"

export default function Header() {

    const client = new Client()
        .setEndpoint("https://appwrite.untoldtitan.org/v1")
        .setProject("675770c2003957daf87f");


    const [user, setUser] = useState(null);

    useEffect(() => {
        async function isLoggedIn() {
            const account = new Account(client);
            try{
                setUser(await account.get());
            }
            catch{
                console.log("Not Logged in")
            }
        }
        isLoggedIn();
    },[])

    return (
        <div className="flex bg-slate-500 py-2">
            <h1 className="text-2xl ml-2">PokeCollector</h1>
            <div className="ml-auto w-fit flex mr-2 mt-0.5">
                {
                    user == null
                        ? <>
                            <a href="/login" className="block mx-4">Login</a>
                            <a href="/signup">Sign Up</a>
                        </>
                        : <a href="/profile">{user.name}</a>
                }
            </div>
        </div>
    )
}