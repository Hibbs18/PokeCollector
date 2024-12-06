export default function Card({name, set, image}){
    return (
        <div className="w-1/6 mx-5 my-2">
            <img src={image}/>
            <h1>{name}</h1>
            <p>{set}</p>
        </div>
    )
}