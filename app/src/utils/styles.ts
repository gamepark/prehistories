import {css, keyframes} from "@emotion/react";
import GameView from "@gamepark/prehistories/GameView";
import PlayerColor from "@gamepark/prehistories/PlayerColor";

export const margin = 1
export const headerHeight = 7
export const boardHeight = 100 - headerHeight
export const squareSize = 5.3
export const caveLeft = 45
export const caveTop = 33
export const caveBorder = 2.7

export const toAbsolute = css`
  position: absolute;
`

export const toFullSize = css`
  width: 100%;
  height: 100%;
`
export const placingBackground = (image: string, size: string) => css`
  background-image: url(${image});
  background-size: ${size};
  background-repeat: no-repeat;
  background-position: top;
`

export const centerContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const centerContainer = css`
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
`

export const setPercentDimension = (height: number, width: number) => css`
  height: ${height}%;
  width: ${width}%;
`

const glowingKeyframes = keyframes`
  from {
    filter: drop-shadow(0 0 0.2em lime);
  }
  to {
    filter: drop-shadow(0 0 0.8em lime) drop-shadow(0 0 0.8em lime);
  }
`

export const glowingTileAnimation = css`
  animation: ${glowingKeyframes} 1s alternate infinite linear;
`

const opacityKeyframes = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const glowingCardAnimation = css`
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    box-shadow: 0 0 0.8em lime, 0 0 0.8em lime, 0 0 0.8em lime;
    animation: ${opacityKeyframes} 1s alternate infinite linear;
  }
`

export function getPanelIndex(game: GameView, panelId: PlayerColor, playerId?: PlayerColor) {
  const panelIndex = game.players.findIndex(player => player.color === panelId)
  const playerIndex = playerId ? game.players.findIndex(player => player.color === playerId) : 0
  return (game.players.length + panelIndex - playerIndex) % game.players.length
}
