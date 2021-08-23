import Card from "../types/Card";
import PlayerColor from "../PlayerColor";

export const YellowHunters:Card[] = [
    {color:PlayerColor.Yellow, power:1, speed:51},
    {color:PlayerColor.Yellow, power:1, speed:60},
    {color:PlayerColor.Yellow, power:2, speed:42},
    {color:PlayerColor.Yellow, power:2, speed:49},
    {color:PlayerColor.Yellow, power:3, speed:33},
    {color:PlayerColor.Yellow, power:3, speed:38},
    {color:PlayerColor.Yellow, power:4, speed:24},
    {color:PlayerColor.Yellow, power:4, speed:27},
    {color:PlayerColor.Yellow, power:5, speed:15},
    {color:PlayerColor.Yellow, power:5, speed:16},
    {color:PlayerColor.Yellow, power:6, speed:1},
    {color:PlayerColor.Yellow, power:6, speed:10},
]

const BlueHunters:Card[] = [
    {color:PlayerColor.Blue, power:1, speed:52},
    {color:PlayerColor.Blue, power:1, speed:59},
    {color:PlayerColor.Blue, power:2, speed:43},
    {color:PlayerColor.Blue, power:2, speed:48},
    {color:PlayerColor.Blue, power:3, speed:34},
    {color:PlayerColor.Blue, power:3, speed:37},
    {color:PlayerColor.Blue, power:4, speed:25},
    {color:PlayerColor.Blue, power:4, speed:26},
    {color:PlayerColor.Blue, power:5, speed:11},
    {color:PlayerColor.Blue, power:5, speed:20},
    {color:PlayerColor.Blue, power:6, speed:2},
    {color:PlayerColor.Blue, power:6, speed:9},
]

const RedHunters:Card[] = [
    {color:PlayerColor.Red, power:1, speed:53},
    {color:PlayerColor.Red, power:1, speed:58},
    {color:PlayerColor.Red, power:2, speed:44},
    {color:PlayerColor.Red, power:2, speed:47},
    {color:PlayerColor.Red, power:3, speed:35},
    {color:PlayerColor.Red, power:3, speed:36},
    {color:PlayerColor.Red, power:4, speed:21},
    {color:PlayerColor.Red, power:4, speed:30},
    {color:PlayerColor.Red, power:5, speed:12},
    {color:PlayerColor.Red, power:5, speed:19},
    {color:PlayerColor.Red, power:6, speed:3},
    {color:PlayerColor.Red, power:6, speed:8},
]

const GreenHunters:Card[] = [
    {color:PlayerColor.Green, power:1, speed:54},
    {color:PlayerColor.Green, power:1, speed:57},
    {color:PlayerColor.Green, power:2, speed:45},
    {color:PlayerColor.Green, power:2, speed:46},
    {color:PlayerColor.Green, power:3, speed:31},
    {color:PlayerColor.Green, power:3, speed:40},
    {color:PlayerColor.Green, power:4, speed:22},
    {color:PlayerColor.Green, power:4, speed:29},
    {color:PlayerColor.Green, power:5, speed:13},
    {color:PlayerColor.Green, power:5, speed:18},
    {color:PlayerColor.Green, power:6, speed:4},
    {color:PlayerColor.Green, power:6, speed:7},
]

const WhiteHunters:Card[] = [
    {color:PlayerColor.White, power:1, speed:55},
    {color:PlayerColor.White, power:1, speed:56},
    {color:PlayerColor.White, power:2, speed:41},
    {color:PlayerColor.White, power:2, speed:50},
    {color:PlayerColor.White, power:3, speed:32},
    {color:PlayerColor.White, power:3, speed:39},
    {color:PlayerColor.White, power:4, speed:23},
    {color:PlayerColor.White, power:4, speed:28},
    {color:PlayerColor.White, power:5, speed:14},
    {color:PlayerColor.White, power:5, speed:17},
    {color:PlayerColor.White, power:6, speed:5},
    {color:PlayerColor.White, power:6, speed:6},
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