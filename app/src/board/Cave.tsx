/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import {PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView";
import {FC} from "react";
import {caveBorder, caveLeft, caveTop, setPercentDimension, squareSize, toAbsolute} from "../utils/styles";
import Images from "../utils/Images";
import AnimalTile from "./AnimalTile";
import TilesDropArea from "./TilesDropArea";
import {usePlayerId} from "@gamepark/react-client";
import {cavesSize} from "@gamepark/prehistories/material/Caves";
import Coordinates from "@gamepark/prehistories/types/Coordinates";

type Props = {
  player: PlayerView | PlayerViewSelf
}


const X:boolean = true
const _:boolean = false
let caveExample:boolean[][] | undefined 

enum Borders {Top = 1, Bottom, Left, Right} 

function getBorders(coordinates:Coordinates, cave:boolean[][]):Borders[]{
  const result:Borders[] = []
  if (coordinates.y === 6 || (coordinates.y<6 && cave[coordinates.y+1][coordinates.x] === false)) {result.push(Borders.Bottom)}
  if (coordinates.y === 0 || coordinates.y>0 && cave[coordinates.y-1][coordinates.x] === false) {result.push(Borders.Top)}
  if (coordinates.x === 6 || coordinates.x<6 && cave[coordinates.y][coordinates.x+1] === false) {result.push(Borders.Right)}
  if (coordinates.x === 0 || coordinates.x>0 && cave[coordinates.y][coordinates.x-1] === false) {result.push(Borders.Left)}
  return result
}

const Cave: FC<Props> = ({player}) => {
  const playerId = usePlayerId()
  return (
    <div css={[style, background(caveBackground[player.color])]}>
      {playerId === player.color && <TilesDropArea player={player}/>}
      {player.cave.map((paint, index) =>
        <AnimalTile key={index} tile={paint.tile} side={paint.side} css={tilePosition(paint.x, paint.y)}/>
      )}
      {caveExample !== undefined && 
        <div css={innerCave}>
          {caveExample.map((line, y) => 
            line.map((column, x) => 
              column === true && <div key={x+"_"+y} css={[toAbsolute, squarePosition(x,y),setPercentDimension(14.2857, 14.2857),drawBorder(getBorders({x,y}, caveExample!))]}></div>
            )
          )}
        </div>}
    </div>
  )
}

const squarePosition = (x:number, y:number) => css`
top:${14.2857*y}%;
left:${14.2857*x}%;
`

const drawBorder = (borders:Borders[]) => css`
${borders.includes(Borders.Top) && `border-top:0.5em dashed white;`}
${borders.includes(Borders.Bottom) && `border-bottom:0.5em dashed white;`}
${borders.includes(Borders.Left) && `border-left:0.5em dashed white;`}
${borders.includes(Borders.Right) && `border-right:0.5em dashed white;`}
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