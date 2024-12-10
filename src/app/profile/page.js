'use client'

import { Account, Client, Databases, ID, Query } from "appwrite"
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const client = new Client();
    client
        .setEndpoint("https://appwrite.untoldtitan.org/v1")
        .setProject("675770c2003957daf87f");

    const [user, setUser] = useState(null);
    const [collections, setCollections] = useState(null);
    const [collection, setCollection] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function LoadUserData() {
            var accountData;
            const account = new Account(client);
            try {
                accountData = await account.get();
            }
            catch {
                router.push("/login")
            }
            console.log(accountData);
            setUser(accountData)

            // Load Collections
            const db = new Databases(client);
            var collectionData = await db.listDocuments("67577e77002cafcac9a7", "67577e8500026d9a515e", [
                Query.select(["collectionName", "collectionid"]),
                Query.equal("userId", accountData.$id)
            ]);
            console.log(collectionData);
            setCollections(collectionData.documents);
        }
        LoadUserData();
    }, [])

    async function LogOut() {
        const account = new Account(client);
        await account.deleteSession("current");
        router.push("/login");
    }

    async function CreateCollection() {
        const db = new Databases(client);
        var collectionId = ID.unique();
        await db.createDocument(
            "67577e77002cafcac9a7",
            "67577e8500026d9a515e",
            collectionId,
            {
                userId: user.$id,
                collectionName: collection,
                collectionid: collectionId
            }
        )
        router.push("/collection/" + collectionId);
    }

    return (
        <div>
            {user == null ? <p>Loading</p> :
                <p>Username: {user.name}</p>
            }
            <button onClick={() => LogOut()}>Log Out</button>
            <label>Collection Name</label>
            <input onChange={(val) => { setCollection(val.target.value) }} value={collection}></input>
            <button onClick={() => CreateCollection()}>Create new Collection</button>
            <br></br>
            <p>Collections: </p>
            {collections == null ?
                <p>Loading Data...</p> :
                collections.map((data) => {
                    return (
                        <div key={data.collectionName}>
                            <p >{data.collectionName}</p>
                            <a href={"/collection/" + data.collectionid}>Go to Collection</a>
                        </div>
                    )
                })}
        </div>
    )
}