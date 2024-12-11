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
            {/* <a href="/profile">Back to Profile</a> */}
            <div>
                <p className="text-2xl ml-2">{collection == null ? "Loading..." : collection.collectionName}</p>
            </div>
            <div className="flex flex-wrap">
                <div className="w-1/2 pl-2 border-r-2 border-solid border-black flex flex-wrap">
                    {
                        collectionCards.length == 0
                            ? <p>No Cards, find some using the right hand window!</p>
                            : collectionCards.map((card, i) => {
                                console.log(card)
                                return (
                                    <div key={card.id + i} className="w-1/5 bg-slate-200 m-2 h-fit">
                                        <p>{card.name} - {card.set.name}</p>
                                        <img src={card.images.large} className="rounded-lg p-2"></img>
                                        {
                                            card.tcgplayer.prices.normal == undefined ? <p>TCGPlayer: ${card.tcgplayer.prices.holofoil.mid}</p> :<p>TCGPlayer: ${card.tcgplayer.prices.normal.mid}</p>
                                        }
                                        {/* <p>TCGPlayer: ${card.tcgplayer.prices.normal.mid}</p> */}
                                        {/* <button onClick={() => AddToCollection(card.id)}>Add to Collection</button> */}
                                    </div>
                                )
                            })
                    }
                </div>
                <div className="w-1/2 pr-2 pl-2">
                    <div>
                        <label>Search for card to add:</label>
                        <input onChange={(val) => { setSearch(val.target.value) }} value={search} className="border-solid border-black border-2 mx-2"></input>
                        <button onClick={() => Search()} className="bg-slate-200 p-1 border-solid border-black border-2 border-radius">Search</button>
                    </div>
                    <div className="flex flex-wrap">
                        {
                            searchedCards == null
                                ? <p>Do a search to find cards to add!</p>
                                : searchedCards.map((card) => {
                                    return (
                                        <div key={card.id} className="w-1/5 bg-slate-200 m-2 h-fit">
                                            <p>{card.name} - {card.set.name}</p>
                                            <img src={card.images.large} className="rounded-lg p-2"></img>
                                            <button onClick={() => AddToCollection(card.id)}>Add to Collection</button>
                                        </div>
                                    )
                                })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}