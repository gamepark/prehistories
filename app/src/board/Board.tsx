/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/prehistories/GameView'
import PlayerColor from '@gamepark/prehistories/PlayerColor'
import Images from '../utils/Images'
import HuntingZone from "./HuntingZone";
import {Animation, useAnimation, usePlayerId} from "@gamepark/react-client";
import PlaceTile, {isPlaceTile} from "@gamepark/prehistories/moves/PlaceTile";
import teamPower from "@gamepark/prehistories/utils/teamPower";
import getPowerLevels from "@gamepark/prehistories/utils/powerLevels";
import {isPlayerViewSelf} from "@gamepark/prehistories/types/PlayerView";
import {boardHeight, caveBorder, caveLeft, caveTop, getPanelIndex, headerHeight, margin, squareSize} from "../utils/styles";
import {getPolyomino} from "@gamepark/prehistories/material/Tile";
import GameLocalView from "../GameLocalView";
import {getHuntingPlayer} from "@gamepark/prehistories/types/HuntingPlayer";

type Props = {
  game: GameView
}

export default function Board({game}: Props) {
  const playerId = usePlayerId<PlayerColor>()
  const player = game.players.find(p => p.color === playerId)
  const animation = useAnimation<PlaceTile>(animation => isPlaceTile(animation.move))
  const hunting = player?.hunting && !player.hunting.hunt
  const huntZonePositions = game.players.length < 4 ? huntZonesA : huntZonesB
  return (
    <div css={[style, background(game.players.length)]}>
      {game.huntingBoard.map((tile, huntZone) =>
        tile && <HuntingZone key={huntZone} game={game} position={huntZonePositions[huntZone]} tile={tile}
                             canDrag={hunting && player !== undefined && isPlayerViewSelf(player) && teamPower(player.played) >= getPowerLevels(game.players.length, huntZone)[0]}
                             item={{huntZone, tile, side: 0}} animation={animation?.move.huntZone === huntZone ? animation : undefined}
                             css={animation?.move.huntZone === huntZone && placeTileAnimation(game, animation, huntZonePositions[huntZone], playerId)}/>
      )}
    </div>

  )
}

const style = css`
  position: absolute;
  top: ${headerHeight}em;
  left: ${margin}em;
  width: ${boardHeight * 0.455}em;
  height: ${boardHeight}em;
  border-radius: 1em;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
`

const background = (players: number) => css`
  background-image: url(${players < 4 ? Images.huntingBoard23Players : Images.huntingBoard45Players});
`

export type HuntZonePosition = {
  left: number
  top: number
  rotation: (polyomino: boolean[][]) => number
  flip?: boolean
}

const huntZone1a: HuntZonePosition = {left: 9, top: 12, rotation: () => -40}
const huntZone1b: HuntZonePosition = {left: 5.3, top: 6, rotation: () => -30}
const huntZone1c: HuntZonePosition = {left: 4.8, top: 16, rotation: () => 12}
const huntZone2a: HuntZonePosition = {
  left: 32.1, top: 19.1, flip: true,
  rotation: polyomino => (polyomino.length === 1 ? 0 : -90) + 29
}
const huntZone2b: HuntZonePosition = {
  left: 25.9, top: 11.1, flip: true,
  rotation: polyomino => (polyomino.length === 1 ? 0 : 90) - 74
}
const huntZone2c: HuntZonePosition = {
  left: 35.3, top: 22.6, flip: true,
  rotation: polyomino => (polyomino.length === 1 ? 0 : 90) - 15
}
const huntZone3: HuntZonePosition = {
  left: 22.6, top: 43.1, flip: true,
  rotation: polyomino => (!polyomino[0][1] ? 0 : !polyomino[0][0] ? 90 : !polyomino[1][0] ? 180 : 270) - 6
}
const huntZone4: HuntZonePosition = {
  left: 12, top: 68, flip: true,
  rotation: polyomino => {
    const base = 19
    if (polyomino.length === 2) {
      return !polyomino[0][2] ? base : !polyomino[1][0] ? base - 180 : 75
    } else {
      return !polyomino[0][0] ? 90 + base : !polyomino[2][1] ? base - 90 : -15
    }
  }
}
const huntZone5: HuntZonePosition = {left: 31.7, top: 81.8, rotation: () => -21}

const huntZonesA = [huntZone1a, huntZone2a, huntZone3, huntZone4, huntZone5]
const huntZonesB = [huntZone1b, huntZone1c, huntZone2b, huntZone2c, huntZone3, huntZone4, huntZone5]

function placeTileAnimation(game: GameView, animation: Animation<PlaceTile>, initialPosition: HuntZonePosition, playerId?: PlayerColor) {
  return css`
    z-index: 10 !important;
    animation: ${createTileAnimationKeyframes(game, animation, initialPosition, playerId)} ${animation.duration}s ease-in-out forwards;
  `
}

function createTileAnimationKeyframes(game: GameLocalView, animation: Animation<PlaceTile>, initialPosition: HuntZonePosition, playerId?: PlayerColor) {
  const huntingPlayer = getHuntingPlayer(game)!
  const translation = game.caveDisplayed === huntingPlayer.color ?
    {
      x: caveLeft + caveBorder - margin + animation.move.coordinates.x * squareSize,
      y: caveTop + caveBorder - headerHeight + animation.move.coordinates.y * squareSize
    } :
    {x: 151, y: 25 + getPanelIndex(game, huntingPlayer.color, playerId) * 15.42}
  const polyomino = getPolyomino(game.huntingBoard[animation.move.huntZone]!, animation.move.side)
  translation.x -= initialPosition.left - polyomino[0].length * squareSize / 2
  translation.y -= initialPosition.top - polyomino.length * squareSize / 2
  return keyframes`
    50% {
      transform: translate(${translation.x / 2}em, ${translation.y / 2}em) scale(1.5);
    }
    100% {
      transform: translate(${translation.x}em, ${translation.y}em);
    }
  `
}
