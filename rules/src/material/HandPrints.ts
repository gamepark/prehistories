import PlayerColor from "../PlayerColor";
import Coordinates from "../types/Coordinates";

export const YellowHandPrints:Coordinates[] = [{x:4,y:3},{x:2,y:5}]
export const BlueHandPrints:Coordinates[] = [{x:1,y:2},{x:3,y:4}]
export const RedHandPrints:Coordinates[] = [{x:0,y:2},{x:4,y:5}]
export const GreenHandPrints:Coordinates[] = [{x:1,y:2},{x:6,y:4}]
export const WhiteHandPrints:Coordinates[] = [{x:5,y:1},{x:2,y:3}]

function getHandPrintsCoords(color:PlayerColor):Coordinates[]{
    switch(color){
        case PlayerColor.Yellow:return YellowHandPrints
        case PlayerColor.Blue:return BlueHandPrints
        case PlayerColor.Red:return RedHandPrints
        case PlayerColor.Green:return GreenHandPrints
        case PlayerColor.White:return WhiteHandPrints
    }
}

export default getHandPrintsCoords