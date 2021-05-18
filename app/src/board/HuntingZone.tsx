/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import GameView from "@gamepark/prehistories/GameView";
import { allPolyominos } from "@gamepark/prehistories/material/Polyominos";
import { FC } from "react";
import Images from "../utils/Images";
import Polyomino from "./Polyomino";

type Props = {
    game:GameView
    numberOfPlayers:number
}

const HuntingZone : FC<Props> = ({game, numberOfPlayers}) => {

    return(

        <div css={[huntingZonePosition, huntingZoneStyle, numberOfPlayers < 4 ? bG23Players : bG45Players]}>

            {game.huntingBoard.map((polyomino, index) => 
            
                <Polyomino key = {index}
                           css = {polyominoToHuntPosition(index, numberOfPlayers)}
                           polyomino={polyomino} 
                           side={0}
                />
            
            )}

        </div>

    )

}

const polyominoToHuntPosition = (position:number, numberOfPlayers:number) => css`
position:absolute;
top:${getTop(position, numberOfPlayers)}%;
left:${getLeft(position, numberOfPlayers)}%;
width:${getWidth(position, numberOfPlayers)}%;
height:${getHeight(position, numberOfPlayers)}%;
transform:rotateZ(${getRotate(position, numberOfPlayers)}deg);
`

const huntingZonePosition = css`
    position:absolute;
    top:7%;
    left:0;
    width:24%;
    height:93%;
`

const huntingZoneStyle = css`
    background-color:green;
`

const bG23Players = css`
background-image: url(${Images.huntingBoard23Players});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
`

const bG45Players = css`
background-image: url(${Images.huntingBoard45Players});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
`

function getTop(pos:number, players:number):number{
    switch (pos){
        case 0 :
            return players < 4 ? 7 : 4
        case 1 :
            return players < 4 ? 14 : 15
        case 2 :
            return players < 4 ? 38 : 5.5
        case 3 :
            return players < 4 ? 64 : 21
        case 4 :
            return players < 4 ? 80 : 41
        case 5 :
            return players < 4 ? 0 : 67
        case 6 :
            return players < 4 ? 0 : 82
        default :
            return 0
    } 
}

function getLeft(pos:number, players:number):number{
    switch (pos){
        case 0 :
            return players < 4 ? 20 : 10
        case 1 :
            return players < 4 ? 53 : 4
        case 2 :
            return players < 4 ? 44 : 43
        case 3 :
            return players < 4 ? 6 : 72
        case 4 :
            return players < 4 ? 68 : 45
        case 5 :
            return players < 4 ? 0 : 5
        case 6 :
            return players < 4 ? 0 : 68
        default :
            return 0
    } 
}

function getWidth(pos:number, players:number):number{
    switch (pos){
        case 0 :
            return players < 4 ? 12 : 12
        case 1 :
            return players < 4 ? 24 : 12
        case 2 :
            return players < 4 ? 24 : 24
        case 3 :
            return players < 4 ? 36 : 24
        case 4 :
            return players < 4 ? 24 : 24
        case 5 :
            return players < 4 ? 0 : 36
        case 6 :
            return players < 4 ? 0 : 24
        default :
            return 0
    }     
}

function getHeight(pos:number, players:number):number{
    switch (pos){
        case 0 :
            return players < 4 ? 12 : 12
        case 1 :
            return players < 4 ? 24 : 12
        case 2 :
            return players < 4 ? 24 : 12
        case 3 :
            return players < 4 ? 24 : 12
        case 4 :
            return players < 4 ? 24 : 24
        case 5 :
            return players < 4 ? 0 : 24
        case 6 :
            return players < 4 ? 0 : 24
        default :
            return 0
    }  
}

function getRotate(pos:number, players:number):number{
        switch (pos){
        case 0 :
            return players < 4 ? -40 : -20
        case 1 :
            return players < 4 ? 30 : 8
        case 2 :
            return players < 4 ? -10 : 100
        case 3 :
            return players < 4 ? 20 : -15
        case 4 :
            return players < 4 ? -22 : -10
        case 5 :
            return players < 4 ? 0 : 20
        case 6 :
            return players < 4 ? 0 : -22
        default :
            return 0
    } 
}

export default HuntingZone