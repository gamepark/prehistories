import PlayerState from "../PlayerState";
import GameState from "../GameState";
import GameView from "../GameView";
import {getPlayers} from "../types/PlayerView";
import {getColoredDeck} from "../material/Hunters";
import PlayerColor from "../PlayerColor";
import teamPower from "./teamPower";

export function compareInitiative(playerA: Pick<PlayerState, 'played' | 'color'>, playerB: Pick<PlayerState, 'played' | 'color'>) {
  const powerComparison = teamPower(playerA.played) - teamPower(playerB.played);
  if (powerComparison !== 0) return powerComparison
  else {
    return teamSpeed(playerB.played, playerB.color) - teamSpeed(playerA.played, playerA.color)}
}

export function getNextPlayer(state: GameState | GameView) {
  const playerWithPlayedCards = getPlayers(state).filter(player => player.played.length)
  if (!playerWithPlayedCards.length) return
  return playerWithPlayedCards.reduce((fastestPlayer, currentPlayer) => compareInitiative(fastestPlayer, currentPlayer) > 0 ? currentPlayer : fastestPlayer)
}

function teamSpeed(hunters: number[], color:PlayerColor): number {
  const deck = []
  for (const elem of hunters) {
    deck.push(getColoredDeck(color)[elem].speed)
  }
  return hunters.length === 0 ? 0 : Math.max(...deck)
}