import {Action, SecretInformation, SimultaneousGame, Undo} from '@gamepark/rules-api'
import {shuffle} from 'lodash'
import canUndo from './canUndo'
import GameState from './GameState'
import GameView from './GameView'
import {getAllGoalsArray, getGoalsArray} from './material/Goals'
import getHandPrintsCoords from './material/HandPrints'
import {allPolyominos} from './material/Polyominos'
import {changeActivePlayer} from './moves/ChangeActivePlayer'
import {checkPermanentObjectives, resolvePermanentObjectives} from './moves/CheckPermanentObjectives'
import {checkVariableObjectives, resolveVariableObjectives} from './moves/CheckVariableObjectives'
import {drawXCards} from './moves/DrawXCards'
import {endGame} from './moves/EndGame'
import EndTurn, {endTurn} from './moves/EndTurn'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import PlayHuntCard, {playHuntCard} from './moves/PlayHuntCard'
import PlayPolyomino, {playPolyomino} from './moves/PlayPolyomino'
import {getNewTile, refillHuntingBoard} from './moves/RefillHuntingBoard'
import {revealHuntCards} from './moves/RevealHuntCards'
import {setHuntPhase} from './moves/SetHuntPhase'
import {shuffleDiscardPile} from './moves/ShuffleDiscardPile'
import SpendHunter, {spendHunter} from './moves/SpendHunter'
import {takeBackPlayedCards} from './moves/TakeBackPlayedCards'
import TellYouAreReady, {tellYouAreReady} from './moves/TellYouAreReady'
import ValidateSpendedHunters, {validateSpentHunters} from './moves/ValidateSpentHunters'
import PlayerColor from './PlayerColor'
import PlayerState, {setupCave, setupDeck} from './PlayerState'
import {isGameOptions, PrehistoriesOptions, PrehistoriesPlayerOptions} from './PrehistoriesOptions'
import Coordinates from './types/Coordinates'
import Phase, {HuntPhase} from './types/Phase'
import {PlayerHuntView, PlayerView, PlayerViewSelf} from './types/PlayerView'
import getSquaresStartLeft, {getFreeSquaresFromPath, getOccupiedSquares, isCoordFree, isCoordOutOfBorders} from './utils/getSquaresStartLeft'
import getPowerLevels from './utils/powerLevels'
import teamPower from './utils/teamPower'

export default class Prehistories extends SimultaneousGame<GameState, Move, PlayerColor>
  implements SecretInformation<GameState, GameView, Move, MoveView, PlayerColor>, Undo<GameState, Move, PlayerColor> {

  constructor(state: GameState)
  constructor(options: PrehistoriesOptions)
  constructor(arg: GameState | PrehistoriesOptions) {
    if (isGameOptions(arg)) {

      const game: GameState = {
        players: setupPlayers(arg.players),
        tilesDeck: setupTilesDeck(),
        huntingBoard: [],
        goals: [],
        phase: Phase.Initiative,
        sortedPlayers: undefined
      }

      game.huntingBoard = setupHuntingBoard(game)
      game.goals = setupGoals(game, arg.isExpertGame)
      setupHandPlayer(game.players)
      super(game)
    } else {
      super(arg)
    }
  }

  isOver(): boolean {
    return this.state.phase === undefined
  }

  isActive(playerId: PlayerColor): boolean {
    switch (this.state.phase) {
      case Phase.Initiative:
        return !this.state.players.find(p => p.color === playerId)?.isReady
      case Phase.Hunt:
        return this.state.sortedPlayers !== undefined && this.state.sortedPlayers[0] === playerId
      default:
        return false
    }
  }

  getLegalMoves(color: PlayerColor): Move[] {
    const player = this.state.players.find(p => p.color === color)!
    if (this.state.phase === Phase.Initiative) {
      if (player.isReady) {
        return []
      } else {
        const playHuntCardMoves: (PlayHuntCard | TellYouAreReady)[] = []
        player.hand.forEach(card => {
          playHuntCardMoves.push({type: MoveType.PlayHuntCard, playerId: color, card: card})
        })
        playHuntCardMoves.push({type: MoveType.TellYouAreReady, playerId: color})
        return playHuntCardMoves
      }
    } else if (player.huntingProps) {
      switch (player.huntingProps.huntPhase) {
        case HuntPhase.Hunt : {
          const playPolyominoMoves: (PlayPolyomino | EndTurn)[] = []
          const accessibleSquares: Coordinates[] = getFreeSquaresFromPath(getSquaresStartLeft(player.cave), player.cave)
          this.state.huntingBoard.forEach((tile, index) => {
            if (tile !== null && teamPower(player.played) >= getPowerLevels(this.state.players.length, index)[0]) {
              ([0, 1] as (0 | 1)[]).forEach(side => {
                for (let x = 0; x < 7; x++) {
                  for (let y = 0; y < 7; y++) {

                    if (allPolyominos[tile][side].coordinates.some(coord => accessibleSquares.find(square => square.x === x + coord.x && square.y === y + coord.y))
                      && allPolyominos[tile][side].coordinates.every(coord => !isCoordOutOfBorders({
                        x: coord.x + x, y: coord.y + y
                      }) && isCoordFree({x: coord.x + x, y: coord.y + y}, getOccupiedSquares(player.cave)))) {
                      playPolyominoMoves.push({type: MoveType.PlayPolyomino, huntSpot: index, polyomino: tile, side, square: {x, y}})
                    }
                  }
                }
              })
            }
          })
          const endTurnMove: EndTurn[] = [{type: MoveType.EndTurn}]
          return playPolyominoMoves.concat(endTurnMove)
        }
        case HuntPhase.Pay : {
          const spendHuntersAndValidateMoves: (SpendHunter | ValidateSpendedHunters)[] = []
          player.played.forEach(card => {
            spendHuntersAndValidateMoves.push({type: MoveType.SpendHunter, card})
          })
          if (player.huntingProps.huntSpotTakenLevels![0] <= 0) {
            spendHuntersAndValidateMoves.push({type: MoveType.ValidateSpentHunters})
          }
          return spendHuntersAndValidateMoves
        }
        default : {
          return []
        }
      }

    } else return []
  }

  play(move: Move): void {
    switch (move.type) {
      case MoveType.PlayHuntCard:
        return playHuntCard(this.state, move)
      case MoveType.TellYouAreReady:
        return tellYouAreReady(this.state, move)
      case MoveType.RevealHuntCards:
        return revealHuntCards(this.state)
      case MoveType.PlayPolyomino:
        return playPolyomino(this.state, move)
      case MoveType.SpendHunter:
        return spendHunter(this.state, move)
      case MoveType.ValidateSpentHunters:
        return validateSpentHunters(this.state)
      case MoveType.ResolvePermanentObjectives:
        return resolvePermanentObjectives(this.state, move)
      case MoveType.ResolveVariableObjectives:
        return resolveVariableObjectives(this.state, move)
      case MoveType.SetHuntPhase:
        return setHuntPhase(this.state)
      case MoveType.RefillHuntingBoard:
        return refillHuntingBoard(this.state)
      case MoveType.EndTurn:
        return endTurn(this.state)
      case MoveType.TakeBackPlayedCards:
        return takeBackPlayedCards(this.state)
      case MoveType.DrawXCards:
        return drawXCards(this.state)
      case MoveType.ShuffleDiscardPile:
        return shuffleDiscardPile(this.state, move)
      case MoveType.ChangeActivePlayer:
        return changeActivePlayer(this.state)
      case MoveType.EndGame:
        return endGame(this.state)
      default:
        return
    }
  }

  getAutomaticMove(): void | Move {

    switch (this.state.phase) {
      case Phase.Initiative: {
        if (this.state.players.every(p => p.isReady)) {
          return {type: MoveType.RevealHuntCards}
        } else return
      }
      case Phase.Hunt: {
        if (!this.state.sortedPlayers) return
        if (this.state.sortedPlayers.length === 0) {
          return {type: MoveType.RefillHuntingBoard}
        }

        if (this.state.players.some(p => p.totemTokens === 0)) {
          return {type: MoveType.EndGame}
        }

        const currentPlayer = this.state.sortedPlayers[0]
        const player = this.state.players.find(p => p.color === currentPlayer)!
        if (!player.huntingProps) return
        switch (player.huntingProps.huntPhase) {
          case HuntPhase.Pay: {
            if (player.huntingProps.huntSpotTakenLevels && player.huntingProps.huntSpotTakenLevels[1] <= 0) {
              return {type: MoveType.ValidateSpentHunters}
            } else return
          }
          case HuntPhase.CheckPermanentObjectives: {
            const result = checkPermanentObjectives(player)
            if (result[0].length !== 0 || result[1].length !== 0 || result[2]) {
              return {type: MoveType.ResolvePermanentObjectives, objectivesCompleted: result}
            } else {
              return {type: MoveType.SetHuntPhase}
            }
          }

          case HuntPhase.CheckVariableObjectives: {
            const result = checkVariableObjectives(this.state, player)
            if (result) {
              return {type: MoveType.ResolveVariableObjectives, goal: result[0], tokens: result[1]}
            } else {
              return {type: MoveType.SetHuntPhase}
            }
          }

          case HuntPhase.DrawCards: {
            if (player.played.length !== 0) {
              return {type: MoveType.TakeBackPlayedCards}
            } else {
              const cardsToDraw: number = howManyCardToDraw(player)
              const canAndMustShuffleDiscard = player.deck.length < cardsToDraw && player.deck.length + player.discard.length >= cardsToDraw
              if (canAndMustShuffleDiscard) {
                const shuffledDiscardPile = shuffle(player.discard)
                return {type: MoveType.ShuffleDiscardPile, newDeck: shuffledDiscardPile}
              } else {
                return {type: MoveType.DrawXCards, cards: getCardsToDraw(player)}
              }
            }
          }
          case HuntPhase.ChangeActivePlayer: {
            return {type: MoveType.ChangeActivePlayer}
          }
        }
      }
    }
    return
  }

  getView(playerId?: PlayerColor): GameView {
    return {
      ...this.state,
      caveDisplayed: playerId === undefined ? PlayerColor.Yellow : playerId,
      tilesDeck: this.state.tilesDeck.map(pile => pile.length),
      players: this.state.players.map(p => {
        if (this.state.phase === undefined || playerId === p.color) {
          return {...p, deck: p.deck.length}
        } else {
          return (this.state.phase === Phase.Initiative || (this.state.sortedPlayers !== undefined && this.state.sortedPlayers.find(sp => sp === p.color) === undefined)) ? {
            ...p, deck: p.deck.length, hand: p.hand.length, played: p.played.length
          } : {...p, deck: p.deck.length, hand: p.hand.length}
        }
      })
    }
  }

  getPlayerView(playerId: PlayerColor): GameView {
    return this.getView(playerId)
  }

  getMoveView(move: Move, playerId?: PlayerColor): MoveView {
    switch (move.type) {
      case MoveType.PlayHuntCard:
        if (playerId === move.playerId) {
          return move
        } else {
          return {type: MoveType.PlayHuntCard, playerId: move.playerId}
        }
      case MoveType.RevealHuntCards:
        const result: { color: PlayerColor, cards: number[] }[] = []
        this.state.players.forEach(p => result.push({color: p.color, cards: p.played}))
        return {type: MoveType.RevealHuntCards, cardsPlayed: result}
      case MoveType.RefillHuntingBoard:

        const newBoard: (number | null)[] = []
        this.state.huntingBoard.forEach((tile, spot) => {
          if (tile === null) {
            newBoard.push(getNewTile(this.state.players.length, spot, this.state.tilesDeck, true, this.state.huntingBoard))
          } else {
            newBoard.push(tile)
          }
        })
        return {...move, newBoard}

      case MoveType.TakeBackPlayedCards:
        if (playerId === this.state.sortedPlayers![0]) {
          return move
        } else {
          return {type: MoveType.TakeBackPlayedCards, playedLength: this.state.players.find(p => p.color === this.state.sortedPlayers![0])!.played.length}
        }
      case MoveType.DrawXCards:
        if (playerId === this.state.sortedPlayers![0]) {
          return move
        } else {
          return {
            type: MoveType.DrawXCards, playerId: this.state.sortedPlayers![0],
            cards: howManyCardToDraw(this.state.players.find(p => p.color === this.state.sortedPlayers![0])!)
          }
        }
      case MoveType.ShuffleDiscardPile:
        return {type: MoveType.ShuffleDiscardPile, newDeckLength: move.newDeck.length}
      default :
        return move
    }
  }

  canUndo(action: Action<Move, PlayerColor>, consecutiveActions: Action<Move, PlayerColor>[]): boolean {
    return canUndo(action, consecutiveActions)
  }

  getPlayerMoveView(move: Move, playerId: PlayerColor): MoveView {
    return this.getMoveView(move, playerId)
  }
}

function setupPlayers(players: PrehistoriesPlayerOptions[]): PlayerState[] {
  return players.map((options) => ({
    color: options.id,
    cave: setupCave(options.id),
    totemTokens: 8,
    deck: setupDeck(options.id),
    discard: [],
    hand: [],
    played: [],
    variableGoalsMade: []
  }))
}

function setupTilesDeck(): number[][] {
  const polyominosArray: number[] = Array.from(allPolyominos.keys())

  return [shuffle(polyominosArray.filter(p => p > 1 && p < 27)),
    shuffle(polyominosArray.filter(p => p > 26 && p < 52)),
    shuffle(polyominosArray.filter(p => p > 51 && p < 62)),
    shuffle(polyominosArray.filter(p => p > 61 && p < 72)),
    shuffle(polyominosArray.filter(p => p > 71 && p < 77))]
}

function setupGoals(game: GameState, isExpertGame: boolean): number[] {
  const goalsIds = shuffle(Array.from(getGoalsArray(isExpertGame).keys()))
  const numberOfGoals: number = game.players.length < 4 ? 4 : 5
  if (!isExpertGame) {
    return numberOfGoals === 4 ? [goalsIds[0], goalsIds[1], goalsIds[2], goalsIds[3]] : [goalsIds[0], goalsIds[1], goalsIds[2], goalsIds[3], goalsIds[4]]
  } else {
    const result: number[] = [goalsIds[0]]
    goalsIds.forEach(elem => {
      result.every(res => getAllGoalsArray()[elem].idConflict !== getAllGoalsArray()[res].idConflict) && result.push(elem)
    })
    return numberOfGoals === 4 ? [result[0], result[1], result[2], result[3]] : [result[0], result[1], result[2], result[3], result[4]]
  }

}

function setupHuntingBoard(game: GameState): number[] {
  if (game.players.length < 4) {
    return ([game.tilesDeck[0].pop()!, game.tilesDeck[1].pop()!, game.tilesDeck[2].pop()!, game.tilesDeck[3].pop()!, game.tilesDeck[4].pop()!])
  } else {
    return ([game.tilesDeck[0].pop()!, game.tilesDeck[0].pop()!, game.tilesDeck[1].pop()!, game.tilesDeck[1].pop()!, game.tilesDeck[2].pop()!, game.tilesDeck[3].pop()!, game.tilesDeck[4].pop()!])
  }
}

function setupHandPlayer(players: PlayerState[]): void {
  players.forEach(p => {
    for (let i = 0; i < 3; i++) {
      p.hand.push(p.deck.pop()!)
    }
  })
}

function getCardsToDraw(player: PlayerState): number[] {
  const result: number[] = []
  for (let i = 0; i < howManyCardToDraw(player); i++) {
    result.push(player.deck[player.deck.length - 1 - i])
  }
  return result
}

export function howManyCardToDraw(player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView): number {
  return player.huntingProps!.tilesHunted === undefined ? 3 : (player.huntingProps!.injuries === undefined ? 2 + areHandPrintsRecovered(player) : Math.max(0, 2 - player.huntingProps!.injuries) + areHandPrintsRecovered(player))
}

export function areHandPrintsRecovered(player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView): number {
  let result: number = 0
  if (player.huntingProps!.tilesHunted === undefined) {
    return result
  } else {
    for (let i = 0; i < player.huntingProps!.tilesHunted; i++) {
      const tile = player.cave[player.cave.length - 1 - i]
      allPolyominos[tile.polyomino][tile.side].coordinates.forEach(coord => {
        if (tile.x + coord.x === getHandPrintsCoords(player.color)[0].x && tile.y + coord.y === getHandPrintsCoords(player.color)[0].y) {
          result++
        }
        if (tile.x + coord.x === getHandPrintsCoords(player.color)[1].x && tile.y + coord.y === getHandPrintsCoords(player.color)[1].y) {
          result += 2
        }
      })
    }
    return result
  }

}