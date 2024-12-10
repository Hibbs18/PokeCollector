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
        <div className="">
            <div className="flex justify-center items-center">
                <h1 className="text-2xl ml-5 h-10 mx-10">Collections</h1>
                <div>
                    <label>Collection Name</label>
                    <br/>
                    <input onChange={(val) => { setCollection(val.target.value) }} value={collection} className="border-2 border-black border-solid"></input>
                </div>
                <button onClick={() => CreateCollection()} className="px-5 bg-slate-200 border-black border-solid border-2 mx-5">Create new Collection</button>
            </div>
            <div className="flex mx-10">
                {collections == null ?
                    <p>Loading Data...</p> :
                    collections.map((data) => {
                        return (
                            <div key={data.collectionName} className="border-solid border-1 border-black bg-slate-200 p-5 cursor-pointer mx-5 rounded-md" onClick={() => {router.push("/collection/" + data.collectionid)}}>
                                <p >{data.collectionName}</p>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}