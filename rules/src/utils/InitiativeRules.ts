import PlayerState from "../PlayerState";
import GameState from "../GameState";
import GameView from "../GameView";
import {getPlayers} from "../types/PlayerView";
import {getColoredDeck} from "../material/Hunters";
import PlayerColor from "../PlayerColor";
import teamPower from "./teamPower";

export function compareInitiative(playerA: Pick<PlayerState, 'played'>, playerB: Pick<PlayerState, 'played'>) {
  const powerComparison = teamPower(playerA.played) - teamPower(playerB.played);
  if (powerComparison !== 0) return powerComparison
  else return teamSpeed(playerA.played) - teamSpeed(playerB.played)
}

export function getNextPlayer(state: GameState | GameView) {
  const playerWithPlayedCards = getPlayers(state).filter(player => player.played.length)
  if (!playerWithPlayedCards.length) return
  return playerWithPlayedCards.reduce((fastestPlayer, currentPlayer) => compareInitiative(fastestPlayer, currentPlayer) > 0 ? currentPlayer : fastestPlayer)
}

function teamSpeed(hunters: number[]): number {
  const deck = []
  for (const elem of hunters) {
    deck.push(getColoredDeck(PlayerColor.Yellow)[elem].speed)
  }
  return hunters.length === 0 ? 0 : Math.max(...deck)
}