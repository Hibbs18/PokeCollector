"use client";

import { Account, Client, ID } from "appwrite";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUpPage() {
    const client = new Client();
    client
        .setEndpoint("https://appwrite.untoldtitan.org/v1")
        .setProject("67813fde00065ec83edf");

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function onSignUp() {
        const account = new Account(client);
        await account.create(
            ID.unique(),
            email,
            password,
            username
        );
        redirect("/");
    }

    async function checkLogin(){
        const account = new Account(client);
        const user = await account.get();

        console.log(user);
    }

    return (
        <div>
            <h1>PokeCollector Signup Page</h1>
            <label>Email</label>
            <input onChange={(val) => { setEmail(val.target.value) }} value={email} type="email"></input>
            <br></br>
            <br></br>
            <label>Username</label>
            <input onChange={(val) => { setUsername(val.target.value) }} value={username}></input>
            <br></br>
            <br></br>
            <label>Password</label>
            <input onChange={(val) => { setPassword(val.target.value) }} value={password}></input>
            <br></br>
            <br></br>
            <button onClick={() => onSignUp()}>Sign Up</button>
            <button onClick={() => checkLogin()}>Check Login Status</button>
        </div>
    );
}
