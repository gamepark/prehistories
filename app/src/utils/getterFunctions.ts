import PlayerColor from "@gamepark/prehistories/PlayerColor"
import Images from "./Images"

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

  export function getCardBack(color:PlayerColor):string{
    switch (color){
        case PlayerColor.Blue :
            return Images.cardBackBlue
        case PlayerColor.Green :
            return Images.cardBackGreen
        case PlayerColor.Red :
            return Images.cardBackRed
        case PlayerColor.White :
            return Images.cardBackWhite
        case PlayerColor.Yellow :
            return Images.cardBackYellow
    }
}