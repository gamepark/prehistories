/** @jsxImportSource @emotion/react */
import {css, keyframes} from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import {PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView";
import {FC, HTMLAttributes, useState} from "react";
import {caveBorder, caveLeft, caveTop, setPercentDimension, squareSize, toAbsolute} from "../utils/styles";
import Images from "../utils/Images";
import AnimalTile from "./AnimalTile";
import TilesDropArea from "./TilesDropArea";
import {useAnimation, usePlayerId} from "@gamepark/react-client";
import {cavesSize} from "@gamepark/prehistories/material/Caves";
import Coordinates from "@gamepark/prehistories/types/Coordinates";
import FulfillObjective, { isFulfillObjective } from "@gamepark/prehistories/moves/FulfillObjective";
import getObjectiveSquaresHighlight from "./ObjectiveSquaresHighlight";
import {getPlayerColor} from "../utils/getterFunctions"

type Props = {
  player: PlayerView | PlayerViewSelf
  isActiveHuntingPlayer:boolean
} & HTMLAttributes<HTMLDivElement>

enum Borders {Top = 1, Bottom, Left, Right} 

const Cave: FC<Props> = ({player, isActiveHuntingPlayer, ...props}) => {

  const playerId = usePlayerId()
  const fulfillObjectiveAnimation = useAnimation<FulfillObjective>(animation => isFulfillObjective(animation.move))
    
  let caveExample:boolean[][] | undefined = fulfillObjectiveAnimation && isActiveHuntingPlayer ? getObjectiveSquaresHighlight(fulfillObjectiveAnimation?.move.objective, player) : undefined
  
  function getBorders(coordinates:Coordinates, cave:boolean[][]):Borders[]{
    const result:Borders[] = []
    if (coordinates.y === 6 || (coordinates.y<6 && cave[coordinates.y+1][coordinates.x] === false)) {result.push(Borders.Bottom)}
    if (coordinates.y === 0 || coordinates.y>0 && cave[coordinates.y-1][coordinates.x] === false) {result.push(Borders.Top)}
    if (coordinates.x === 6 || coordinates.x<6 && cave[coordinates.y][coordinates.x+1] === false) {result.push(Borders.Right)}
    if (coordinates.x === 0 || coordinates.x>0 && cave[coordinates.y][coordinates.x-1] === false) {result.push(Borders.Left)}
    return result
  }

  return (
    <div css={[style, background(caveBackground[player.color]), fulfillObjectiveAnimation && isActiveHuntingPlayer && scaleCaveAnimation(fulfillObjectiveAnimation.duration)]}>
      {playerId === player.color && <TilesDropArea player={player}/>}
      {player.cave.map((paint, index) =>
        <AnimalTile key={index} tile={paint.tile} side={paint.side} css={tilePosition(paint.x, paint.y)}/>
      )}
      {caveExample !== undefined && 
        <div css={innerCave}>
          {caveExample.map((line, y) => 
            line.map((column, x) => 
              column === true && <div key={x+"_"+y} css={[toAbsolute, squarePosition(x,y),setPercentDimension(15.5, 15.5),drawBorder(getBorders({x,y}, caveExample!), getPlayerColor(player.color)), fulfillObjectiveAnimation && opacityAnimation(fulfillObjectiveAnimation.duration)]}></div>
            )
          )}
        </div>}
    </div>
  )
}

const scaleCaveKeyframes = keyframes`
from{transform:scale(1);}
20%,80%{transform:scale(1.55);}
to{transform:scale(1);
`

const scaleCaveAnimation = (duration:number) => css`
z-index:3;
transform-origin:top left;
animation: ${scaleCaveKeyframes} ${duration}s ease-out infinite;
`

const opacityKeyframes = keyframes`
from,20%{opacity:0; transform:scale(1);}
50%,80%{opacity:1;transform:scale(1);}
to{opacity:0;transform:scale(1);}
`

const opacityAnimation = (duration:number) => css`
animation: ${opacityKeyframes} ${duration}s ease-in infinite;
`

const squarePosition = (x:number, y:number) => css`
top:${14.2857*y-0.5}%;
left:${14.2857*x-0.5}%;
`

const drawBorder = (borders:Borders[], color:string) => css`
${borders.includes(Borders.Top) && `border-top:0.5em solid ${color};`}
${borders.includes(Borders.Bottom) && `border-bottom:0.5em solid ${color};`}
${borders.includes(Borders.Left) && `border-left:0.5em solid ${color};`}
${borders.includes(Borders.Right) && `border-right:0.5em solid ${color};`}
`

const innerCave = css`
  position: absolute;
  left: ${caveBorder}em;
  top: ${caveBorder}em;
  width: ${squareSize * cavesSize}em;
  height: ${squareSize * cavesSize}em;
`

const style = css`
  position: absolute;
  left: ${caveLeft}em;
  top: ${caveTop}em;
  width: 42.5em;
  height: 42.5em;
  background-size: contain;
  background-repeat: no-repeat;
  filter: drop-shadow(0 0 2em black);
  border-radius: 10%;
`

const background = (url: string) => css`
  background-image: url(${url});
`

export const tilePosition = (x: number, y: number) => css`
  position: absolute;
  left: ${x * squareSize + caveBorder}em;
  top: ${y * squareSize + caveBorder}em;
`

const caveBackground = {
  [PlayerColor.Blue]: Images.caveBlue,
  [PlayerColor.Green]: Images.caveGreen,
  [PlayerColor.Red]: Images.caveRed,
  [PlayerColor.White]: Images.caveWhite,
  [PlayerColor.Yellow]: Images.caveYellow
}

export default Cave