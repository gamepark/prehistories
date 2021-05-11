import Card from "../types/Card";
import PlayerColor from "../PlayerColor";

const YellowHunters:Card[] = [
    {color:PlayerColor.Yellow, power:1, speed:50},
    {color:PlayerColor.Yellow, power:1, speed:51},
    {color:PlayerColor.Yellow, power:2, speed:40},
    {color:PlayerColor.Yellow, power:2, speed:41},
    {color:PlayerColor.Yellow, power:3, speed:30},
    {color:PlayerColor.Yellow, power:3, speed:31},
    {color:PlayerColor.Yellow, power:4, speed:20},
    {color:PlayerColor.Yellow, power:4, speed:21},
    {color:PlayerColor.Yellow, power:5, speed:10},
    {color:PlayerColor.Yellow, power:5, speed:11},
    {color:PlayerColor.Yellow, power:6, speed:0},
    {color:PlayerColor.Yellow, power:6, speed:1},
]

const BlueHunters:Card[] = [
    {color:PlayerColor.Blue, power:1, speed:50},
    {color:PlayerColor.Blue, power:1, speed:51},
    {color:PlayerColor.Blue, power:2, speed:40},
    {color:PlayerColor.Blue, power:2, speed:41},
    {color:PlayerColor.Blue, power:3, speed:30},
    {color:PlayerColor.Blue, power:3, speed:31},
    {color:PlayerColor.Blue, power:4, speed:20},
    {color:PlayerColor.Blue, power:4, speed:21},
    {color:PlayerColor.Blue, power:5, speed:10},
    {color:PlayerColor.Blue, power:5, speed:11},
    {color:PlayerColor.Blue, power:6, speed:0},
    {color:PlayerColor.Blue, power:6, speed:1},
]

const RedHunters:Card[] = [
    {color:PlayerColor.Red, power:1, speed:50},
    {color:PlayerColor.Red, power:1, speed:51},
    {color:PlayerColor.Red, power:2, speed:40},
    {color:PlayerColor.Red, power:2, speed:41},
    {color:PlayerColor.Red, power:3, speed:30},
    {color:PlayerColor.Red, power:3, speed:31},
    {color:PlayerColor.Red, power:4, speed:20},
    {color:PlayerColor.Red, power:4, speed:21},
    {color:PlayerColor.Red, power:5, speed:10},
    {color:PlayerColor.Red, power:5, speed:11},
    {color:PlayerColor.Red, power:6, speed:0},
    {color:PlayerColor.Red, power:6, speed:1},
]

const GreenHunters:Card[] = [
    {color:PlayerColor.Green, power:1, speed:50},
    {color:PlayerColor.Green, power:1, speed:51},
    {color:PlayerColor.Green, power:2, speed:40},
    {color:PlayerColor.Green, power:2, speed:41},
    {color:PlayerColor.Green, power:3, speed:30},
    {color:PlayerColor.Green, power:3, speed:31},
    {color:PlayerColor.Green, power:4, speed:20},
    {color:PlayerColor.Green, power:4, speed:21},
    {color:PlayerColor.Green, power:5, speed:10},
    {color:PlayerColor.Green, power:5, speed:11},
    {color:PlayerColor.Green, power:6, speed:0},
    {color:PlayerColor.Green, power:6, speed:1},
]

const WhiteHunters:Card[] = [
    {color:PlayerColor.White, power:1, speed:50},
    {color:PlayerColor.White, power:1, speed:51},
    {color:PlayerColor.White, power:2, speed:40},
    {color:PlayerColor.White, power:2, speed:41},
    {color:PlayerColor.White, power:3, speed:30},
    {color:PlayerColor.White, power:3, speed:31},
    {color:PlayerColor.White, power:4, speed:20},
    {color:PlayerColor.White, power:4, speed:21},
    {color:PlayerColor.White, power:5, speed:10},
    {color:PlayerColor.White, power:5, speed:11},
    {color:PlayerColor.White, power:6, speed:0},
    {color:PlayerColor.White, power:6, speed:1},
]

export function getColoredDeck(color:PlayerColor):Card[]{
    switch(color){
        case PlayerColor.Yellow :
            return YellowHunters
        case PlayerColor.Blue :
            return BlueHunters
        case PlayerColor.Red :
            return RedHunters
        case PlayerColor.Green :
            return GreenHunters
        case PlayerColor.White :
            return WhiteHunters
    }
}