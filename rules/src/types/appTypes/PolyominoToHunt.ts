type PolyominoToHunt = {
    type:'PolyominoToHunt'
    polyomino:number
    side:0|1
    huntSpot:number
}

export default PolyominoToHunt

export function isPolyominoToHunt(state:PolyominoToHunt):state is PolyominoToHunt{
    return state.type === "PolyominoToHunt"
}