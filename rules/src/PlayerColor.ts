enum PlayerColor {
  Yellow = 1, Blue, Red, Green, White
}

export default PlayerColor

export const playerColors = Object.values(PlayerColor).filter(isPlayerColor)

function isPlayerColor(arg: string | PlayerColor): arg is PlayerColor {
  return typeof arg === 'number'
}