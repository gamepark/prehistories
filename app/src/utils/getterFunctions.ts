import PlayerColor from "@gamepark/prehistories/PlayerColor"

export function getPlayerColor(color:PlayerColor):string{
    switch(color){
        case PlayerColor.Yellow :
            return '#ffcf33'
        case PlayerColor.Blue :
            return '#3c94c8'
        case PlayerColor.Red :
            return '#c02825'
        case PlayerColor.Green :
            return '#83b440'
        case PlayerColor.White :
            return '#fcfcfd'
    }
  }