import CardInHand from "./CardInHand"

type CardPlayed = {
    type:"CardPlayed"
    card:number
}

export default CardPlayed

export function isCardPlayed(state:CardInHand|CardPlayed):state is CardPlayed{
    return state.type === "CardPlayed"
}