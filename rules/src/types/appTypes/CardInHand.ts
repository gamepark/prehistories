import CardPlayed from "./CardPlayed"

type CardInHand = {
    type:"CardInHand"
    card:number
}

export default CardInHand

export function isCardInHand(state:CardInHand|CardPlayed):state is CardInHand{
    return state.type === "CardInHand"
}