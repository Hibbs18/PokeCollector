"use client"

import { Account, Client, Databases, Query } from "appwrite";
import { useParams } from "next/navigation";
import { useEffect, useState, useReducer } from "react"

export default function Page() {
    const params = useParams();
    const [loggedin, setLoggedin] = useState(false);
    const [user, setUser] = useState(null);
    const [collectionCards, setCollectionCards] = useState([]);
    const [collection, setCollection] = useState(null);
    const [searchedCards, setSearchedCards] = useState(null);
    const [search, setSearch] = useState("");
    const client = new Client()
        .setEndpoint("https://appwrite.untoldtitan.org/v1")
        .setProject("675770c2003957daf87f");


    useEffect(() => {
        async function LoadData() {
            const account = new Account(client);
            var usr = null;
            try {
                usr = account.get();
            }
            catch {
                console.log("User not logged in, viewing in guest mode");
            }
            if (usr != null) {
                setUser(usr);
            }
            Reload();
        }
        LoadData();
    }, [])

    async function Search() {
        // Call the pokecard api to search for cards
        const res = await fetch("https://api.pokemontcg.io/v2/cards?q=name:" + search, {
            headers: {
                // oh noooo i hard coded my api key to let people grab pokemon cards :dissipate:
                "X-Api-Key": "14a0c03f-3c38-456c-a557-219729ce0888"
            },
        });
        const data = await res.json();
        console.log(data);
        setSearchedCards(data.data);
    }

    async function AddToCollection(id) {
        const db = new Databases(client);
        await db.updateDocument("67577e77002cafcac9a7", "67577e8500026d9a515e",
            collection.collectionid,
            {
                pokemonCards: [
                    ...collection.pokemonCards,
                    id
                ]
            }
        )
        Reload();
    }

    async function RemoveFromCollection(id) {

    }

    async function Reload() {
        const db = new Databases(client);
        var dbData = await db.listDocuments("67577e77002cafcac9a7", "67577e8500026d9a515e", [
            Query.select(["collectionName", "collectionid", "pokemonCards"]),
            Query.equal("collectionid", params.slug)
        ]);
        setCollection(dbData.documents[0]);

        var data = new Array();
        for (const card of dbData.documents[0].pokemonCards) {
            const res = await fetch("https://api.pokemontcg.io/v2/cards/" + card, {
                headers: {
                    // oh noooo i hard coded my api key to let people grab pokemon cards :dissipate:
                    "X-Api-Key": "14a0c03f-3c38-456c-a557-219729ce0888"
                },
            });
            const cardData = await res.json();
            data.push(cardData.data);
        };
        let dataClone = JSON.parse(JSON.stringify(data));
        setCollectionCards(() => [...dataClone]);

    }

    return (
        <div>
            <a href="/profile">Back to Profile</a>
            <div>
                Collection ID: {params.slug}
                <br></br>
                <p>Collection Name:</p> {collection == null ? <p>Loading...</p> : <p>{collection.collectionName}</p>}
            </div>
            <div>
                Cards:
                {
                    collectionCards.length == 0
                        ? <p>Loading!</p>
                        : collectionCards.map((card, i) => {
                            return (
                                <div key={card.id + i}>
                                    <p>{card.name} - {card.set.name}</p>
                                    <button onClick={() => RemoveFromCollection(card.id)}>Add to Collection</button>
                                </div>
                            )
                        })
                }
            </div>
            <label>Search for card to add:</label>
            <input onChange={(val) => { setSearch(val.target.value) }} value={search}></input>
            <button onClick={() => Search()}>Search</button>
            <div>
                Found These Cards:
                {
                    searchedCards == null
                        ? <p>Do a search to find cards to add!</p>
                        : searchedCards.map((card) => {
                            return (
                                <div key={card.id}>
                                    <p>{card.name} - {card.set.name}</p>
                                    <button onClick={() => AddToCollection(card.id)}>Add to Collection</button>
                                </div>
                            )
                        })
                }
            </div>
        </div>
    )
}