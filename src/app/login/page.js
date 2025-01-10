'use client'

import { Account, Client } from "appwrite";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const client = new Client();
    client
        .setEndpoint("https://appwrite.untoldtitan.org/v1")
        .setProject("67813fde00065ec83edf");

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Check to see if user is already logged in
        async function CheckLoginStatus(){
            var usr = null;
            const account = new Account(client);
            try {
                usr = await account.get();
            }
            catch{
                console.log("User not already logged in");
                return;
            }
            if(usr != null){
                router.push("/profile");
            }
        }
        CheckLoginStatus();
    },[])

    async function Login() {
        const account = new Account(client);
        await account.createEmailPasswordSession(email,password);
        router.push("/profile");
    }

    return (
        <div>
            <h1>PokeCollector Login Page</h1>
            <label>Email</label>
            <input onChange={(val) => { setEmail(val.target.value) }} value={email}></input>
            <br></br>
            <br></br>
            <label>Password</label>
            <input onChange={(val) => { setPassword(val.target.value) }} value={password}></input>
            <br></br>
            <br></br>
            <button onClick={() => Login()}>Login</button>
        </div>
    );
}
