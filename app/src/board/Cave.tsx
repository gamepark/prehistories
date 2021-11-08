/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import {PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView";
import {FC} from "react";
import {caveBorder, caveLeft, caveTop, squareSize} from "../utils/styles";
import Images from "../utils/Images";
import AnimalTile from "./AnimalTile";
import TilesDropArea from "./TilesDropArea";
import {usePlayerId} from "@gamepark/react-client";

type Props = {
  player: PlayerView | PlayerViewSelf
}

const Cave: FC<Props> = ({player}) => {
  const playerId = usePlayerId()
  return (
    <div css={[style, background(caveBackground[player.color])]}>
      {playerId === player.color && <TilesDropArea player={player}/>}
      {player.cave.map((paint, index) =>
        <AnimalTile key={index} tile={paint.tile} side={paint.side} css={tilePosition(paint.x, paint.y)}/>
      )}
    </div>
  )
}

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