import Card from "@/components/Card";


export default async function TestPage(){
    const res = await fetch("https://api.pokemontcg.io/v2/cards",{
        headers:{
          // oh noooo i hard coded my api key to let people grab pokemon cards :dissipate:
          "X-Api-Key":"14a0c03f-3c38-456c-a557-219729ce0888"
        }
      });
      const data = await res.json();
    
      console.log(data);
    
      return (
        <div className="flex flex-wrap">
          {
            data.data.map(card => {
              return(
                <Card key={card.id} name={card.name} set={card.set.name} image={card.images.large}/>
              )
            })
          }
        </div>
      )
}