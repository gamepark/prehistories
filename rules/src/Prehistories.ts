import {Action, SecretInformation, SimultaneousGame, Undo} from '@gamepark/rules-api'
import {shuffle} from 'lodash'
import canUndo from './canUndo'
import GameState from './GameState'
import GameView from './GameView'
import {changeActivePlayer} from './moves/ChangeActivePlayer'
import {fulfillObjective, fulfillObjectiveMove} from './moves/FulfillObjective'
import {drawCards} from './moves/DrawCards'
import {endGame} from './moves/EndGame'
import EndTurn, {endTurn} from './moves/EndTurn'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import PlayHuntCard, {playHuntCard} from './moves/PlayHuntCard'
import PlaceTile, {placeTile, placeTileMove} from './moves/PlaceTile'
import {getNewTile, refillHuntingBoard} from './moves/RefillHuntingBoard'
import {revealHuntCards} from './moves/RevealHuntCards'
import {setHuntPhase} from './moves/SetHuntPhase'
import {shuffleDiscardPile} from './moves/ShuffleDiscardPile'
import SpendHunter, {spendHunter} from './moves/SpendHunter'
import {takeBackPlayedCards} from './moves/TakeBackPlayedCards'
import TellYouAreReady, {tellYouAreReady} from './moves/TellYouAreReady'
import ValidateSpendedHunters, {validateSpentHunters} from './moves/ValidateSpentHunters'
import PlayerColor from './PlayerColor'
import PlayerState, {setupDeck} from './PlayerState'
import {isGameOptions, PrehistoriesOptions, PrehistoriesPlayerOptions} from './PrehistoriesOptions'
import Phase, {HuntPhase} from './types/Phase'
import {isPlayerState, PlayerView, PlayerViewSelf} from './types/PlayerView'
import getPowerLevels from './utils/powerLevels'
import teamPower from './utils/teamPower'
import {canPlaceTile, getCavePlacementSpaces} from "./utils/PlacementRules";
import caves, {cavesSize, Space} from "./material/Caves";
import {setupTilesDeck, sides} from "./material/Tile";
import {getPlacedTileCoordinates} from "./types/PlacedTile";
import {setupObjectives} from "./material/Objective";
import {getFulfilledObjectives} from "./material/ObjectiveRules";

export default class Prehistories extends SimultaneousGame<GameState, Move, PlayerColor>
  implements SecretInformation<GameState, GameView, Move, MoveView, PlayerColor>, Undo<GameState, Move, PlayerColor> {

  constructor(state: GameState)
  constructor(options: PrehistoriesOptions)
  constructor(arg: GameState | PrehistoriesOptions) {
    if (isGameOptions(arg)) {

      const game: GameState = {
        players: setupPlayers(arg.players, false),
        tilesDeck: setupTilesDeck(),
        huntingBoard: [],
        objectives: [],
        phase: Phase.Initiative,
        sortedPlayers: undefined,
        tutorial:false
      }

      game.huntingBoard = setupHuntingBoard(game)
      game.objectives = setupObjectives(game.players.length, arg.isExpertGame)
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
    } else if (player.hunting) {
      switch (player.hunting.huntPhase) {
        case HuntPhase.Hunt : {
          const moves: (PlaceTile | EndTurn)[] = []
          const cave = getCavePlacementSpaces(player)
          for (let huntSpot = 0; huntSpot < this.state.huntingBoard.length; huntSpot++) {
            const tile = this.state.huntingBoard[huntSpot]
            if (tile === null || teamPower(player.played) < getPowerLevels(this.state.players.length, huntSpot)[0]) {
              continue
            }
            for (let x = 0; x < cavesSize; x++) {
              for (let y = 0; y < cavesSize; y++) {
                for (const side of sides) {
                  if (canPlaceTile(cave, {tile, side, x, y})) {
                    moves.push(placeTileMove(huntSpot, side, {x, y}))
                  }
                }
              }
            }
          }
          const endTurnMove: EndTurn[] = [{type: MoveType.EndTurn}]
          return moves.concat(endTurnMove)
        }
        case HuntPhase.Pay : {
          const spendHuntersAndValidateMoves: (SpendHunter | ValidateSpendedHunters)[] = []
          player.played.forEach(card => {
            spendHuntersAndValidateMoves.push({type: MoveType.SpendHunter, card})
          })
          if (player.hunting.huntSpotTakenLevels![0] <= 0) {
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
      case MoveType.PlaceTile:
        return placeTile(this.state, move)
      case MoveType.SpendHunter:
        return spendHunter(this.state, move)
      case MoveType.ValidateSpentHunters:
        return validateSpentHunters(this.state)
      case MoveType.FulfillObjective:
        return fulfillObjective(this.state, move)
      case MoveType.SetHuntPhase:
        return setHuntPhase(this.state)
      case MoveType.RefillHuntingBoard:
        return refillHuntingBoard(this.state)
      case MoveType.EndTurn:
        return endTurn(this.state)
      case MoveType.TakeBackPlayedCards:
        return takeBackPlayedCards(this.state)
      case MoveType.DrawCards:
        return drawCards(this.state)
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

  getAutomaticMove(): void | Move | Move[] {

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

        if (this.state.players.some(p => p.totemTokens.length >= 8)) {
          return {type: MoveType.EndGame}
        }

        const currentPlayer = this.state.sortedPlayers[0]
        const player = this.state.players.find(p => p.color === currentPlayer)!
        if (!player.hunting) return
        switch (player.hunting.huntPhase) {
          case HuntPhase.Pay: {
            if (player.hunting.huntSpotTakenLevels && player.hunting.huntSpotTakenLevels[1] <= 0) {
              return {type: MoveType.ValidateSpentHunters}
            } else return
          }
          case HuntPhase.CheckObjectives: {
            return [...getFulfilledObjectives(this.state).map(fulfillObjectiveMove), {type: MoveType.SetHuntPhase}]
          }
          case HuntPhase.DrawCards: {
            if (player.played.length !== 0) {
              return {type: MoveType.TakeBackPlayedCards}
            } else {
              const cardsToDraw: number = playerCouldDraw(player)
              if (player.deck.length < cardsToDraw && player.discard.length > 0) {
                return {type: MoveType.ShuffleDiscardPile, shuffledCards: shuffle(player.discard)}
              } else {
                return {type: MoveType.DrawCards}
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
      tilesDeck: this.state.tilesDeck.map(pile => pile.length),
      players: this.state.players.map(p => {
        if (this.state.phase === undefined || playerId === p.color) {
          return {...p, deck: p.deck.length}
        } else {
          const newPlayer: PlayerView = {...p, deck: p.deck.length, hand: p.hand.length + p.played.length, played: []}
          return (this.state.phase === Phase.Initiative || (this.state.sortedPlayers !== undefined && this.state.sortedPlayers.find(sp => sp === p.color) === undefined))
            ? newPlayer
            : {...p, deck: p.deck.length, hand: p.hand.length}
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
          return {
            type: MoveType.TakeBackPlayedCards,
            playedLength: this.state.players.find(p => p.color === this.state.sortedPlayers![0])!.played.length
          }
        }
      case MoveType.DrawCards:
        if (playerId === this.state.sortedPlayers![0]) {
          const player = this.state.players.find(p => p.color === this.state.sortedPlayers![0])!
          return {...move, cards: player.deck.slice(0, playerWillDraw(player))}
        } else {
          return move
        }
      case MoveType.ShuffleDiscardPile:
        return {type: MoveType.ShuffleDiscardPile}
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

export function setupPlayers(players: PrehistoriesPlayerOptions[], isTutorial:boolean): PlayerState[] {
  return players.map((options) => {
    const deck = setupDeck(options.id, isTutorial)
    return ({
      color: options.id,
      cave: [],
      totemTokens: [],
      deck,
      discard: [],
      hand: deck.splice(0, 3),
      played: [],
      tokensOnObjective: []
    })
  })
}

function setupHuntingBoard(game: GameState): number[] {
  if (game.players.length < 4) {
    return ([game.tilesDeck[0].pop()!, game.tilesDeck[1].pop()!, game.tilesDeck[2].pop()!, game.tilesDeck[3].pop()!, game.tilesDeck[4].pop()!])
  } else {
    return ([game.tilesDeck[0].pop()!, game.tilesDeck[0].pop()!, game.tilesDeck[1].pop()!, game.tilesDeck[1].pop()!, game.tilesDeck[2].pop()!, game.tilesDeck[3].pop()!, game.tilesDeck[4].pop()!])
  }
}

export function playerCouldDraw(player: PlayerState | PlayerView | PlayerViewSelf): number {
  if (player.hunting!.tilesHunted === 0) {
    return 3
  }
  return Math.max(0, 2 - player.hunting!.injuries) + handPrintsJustRecovered(player)
}

export function playerWillDraw(player: PlayerState | PlayerView | PlayerViewSelf) {
  const deckSize = isPlayerState(player) ? player.deck.length : player.deck
  return Math.min(playerCouldDraw(player), deckSize)
}

export function handPrintsJustRecovered(player: PlayerState | PlayerView | PlayerViewSelf): number {
  if (!player.hunting?.tilesHunted) return 0
  return player.cave.slice(-player.hunting.tilesHunted).reduce((sum, placedTile) =>
      sum + getPlacedTileCoordinates(placedTile).reduce((sum, {x, y}) =>
          caves[player.color][y][x] === Space.Hand ? sum + 1 : caves[player.color][y][x] === Space.Hand2 ? sum + 2 : sum
        , 0)
    , 0)
}