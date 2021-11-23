import {Action, SecretInformation, SimultaneousGame, Undo} from '@gamepark/rules-api'
import {shuffle} from 'lodash'
import canUndo from './canUndo'
import GameState from './GameState'
import GameView from './GameView'
import {changeActivePlayer} from './moves/ChangeActivePlayer'
import {fulfillObjective, fulfillObjectiveMove} from './moves/FulfillObjective'
import {drawCards, drawCardsMove} from './moves/DrawCards'
import EndTurn, {endTurn, endTurnMove} from './moves/EndTurn'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import {playHuntCard, playHuntCardMove} from './moves/PlayHuntCard'
import PlaceTile, {placeTile, placeTileMove} from './moves/PlaceTile'
import {canRefillBoard, refillHuntingBoard} from './moves/RefillHuntingBoard'
import {revealHuntCards} from './moves/RevealHuntCards'
import {shuffleDiscardPile, shuffleDiscardPileMove} from './moves/ShuffleDiscardPile'
import SpendHunter, {spendHunter} from './moves/SpendHunter'
import {takeBackPlayedCards} from './moves/TakeBackPlayedCards'
import ValidateSpentHunters, {validateSpentHunters} from './moves/ValidateSpentHunters'
import PlayerColor from './PlayerColor'
import PlayerState, {setupDeck} from './PlayerState'
import {isGameOptions, PrehistoriesOptions, PrehistoriesPlayerOptions} from './PrehistoriesOptions'
import {isPlayerState, PlayerView, PlayerViewSelf} from './types/PlayerView'
import teamPower from './utils/teamPower'
import {canPlaceTile, getCavePlacementSpaces} from "./utils/PlacementRules";
import caves, {cavesSize, Space} from "./material/Caves";
import {setupTilesDeck, sides} from "./material/Tile";
import {getPlacedTileCoordinates} from "./types/PlacedTile";
import {setupObjectives} from "./material/Objective";
import {getFulfilledObjectives} from "./material/ObjectiveRules";
import {getHuntingPlayer} from "./types/HuntingPlayer";
import getBoardZones from "./material/BoardZones";

export default class Prehistories extends SimultaneousGame<GameState, Move, PlayerColor>
  implements SecretInformation<GameState, GameView, Move, MoveView, PlayerColor>, Undo<GameState, Move, PlayerColor> {

  constructor(state: GameState)
  constructor(options: PrehistoriesOptions)
  constructor(arg: GameState | PrehistoriesOptions) {
    if (isGameOptions(arg)) {

      const game: GameState = {
        players: setupPlayers(arg.players, false),
        tilesDecks: setupTilesDeck(),
        huntingBoard: getBoardZones(arg.players.length).map(() => null),
        objectives: []
      }

      game.objectives = setupObjectives(game.players.length, arg.isExpertGame)
      super(game)
    } else {
      super(arg)
    }
  }

  isOver(): boolean {
    return this.state.players.some(isWinner)
  }

  isActive(playerId: PlayerColor): boolean {
    const huntingPlayer = getHuntingPlayer(this.state)
    if (!huntingPlayer) {
      return !this.state.players.find(p => p.color === playerId)?.isReady
    } else {
      return huntingPlayer.color === playerId
    }
  }

  getLegalMoves(color: PlayerColor): Move[] {
    const huntingPlayer = getHuntingPlayer(this.state)
    if (!huntingPlayer) {
      const player = this.state.players.find(p => p.color === color)!
      if (!player.isReady) {
        return [...player.hand.map(card => playHuntCardMove(color, card)), endTurnMove(color)]
      } else {
        return []
      }
    } else if (huntingPlayer.color === color) {
      if (!huntingPlayer.hunting.hunt) {
        const moves: (PlaceTile | EndTurn)[] = []
        const cave = getCavePlacementSpaces(huntingPlayer)
        for (let huntZone = 0; huntZone < this.state.huntingBoard.length; huntZone++) {
          const tile = this.state.huntingBoard[huntZone]
          if (tile === null || teamPower(huntingPlayer.played) < getBoardZones(this.state.players.length)[huntZone].injury) {
            continue
          }
          for (let x = 0; x < cavesSize; x++) {
            for (let y = 0; y < cavesSize; y++) {
              for (const side of sides) {
                if (canPlaceTile(cave, {tile, side, x, y})) {
                  moves.push(placeTileMove(huntZone, side, {x, y}))
                }
              }
            }
          }
        }
        moves.push(endTurnMove(huntingPlayer.color))
        return moves
      } else {
        const spendHuntersAndValidateMoves: (SpendHunter | ValidateSpentHunters)[] = []
        huntingPlayer.played.forEach(card => {
          spendHuntersAndValidateMoves.push({type: MoveType.SpendHunter, card})
        })
        if (getBoardZones(this.state.players.length)[huntingPlayer.hunting.hunt!.zone].injury <= huntingPlayer.hunting.hunt!.huntersValue) {
          spendHuntersAndValidateMoves.push({type: MoveType.ValidateSpentHunters})
        }
        return spendHuntersAndValidateMoves
      }

    } else return []
  }

  play(move: Move): void {
    switch (move.type) {
      case MoveType.PlayHuntCard:
        return playHuntCard(this.state, move)
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
      case MoveType.RefillHuntingBoard:
        return refillHuntingBoard(this.state)
      case MoveType.EndTurn:
        return endTurn(this.state, move)
      case MoveType.TakeBackPlayedCards:
        return takeBackPlayedCards(this.state)
      case MoveType.DrawCards:
        return drawCards(this.state, move)
      case MoveType.ShuffleDiscardPile:
        return shuffleDiscardPile(this.state, move)
      case MoveType.ChangeActivePlayer:
        return changeActivePlayer(this.state)
      default:
        return
    }
  }

  getAutomaticMove(): void | Move | Move[] {
    const huntingPlayer = getHuntingPlayer(this.state)
    if (!huntingPlayer) {
      if (canRefillBoard(this.state)) {
        return {type: MoveType.RefillHuntingBoard}
      }
      if (this.state.players.every(p => p.isReady)) {
        const playersNotHunting = this.state.players.filter(p => !p.played.length)
        return [{type: MoveType.RevealHuntCards}, ...playersNotHunting.flatMap(p => {
          if (p.deck.length < 3 && p.discard.length > 0) {
            return [shuffleDiscardPileMove(p.color, shuffle(p.discard)), drawCardsMove(p.color)]
          }
          return [drawCardsMove(p.color)]
        })]
      }
    } else if (huntingPlayer.isReady) {
      const moves: Move[] = []
      if (huntingPlayer.played.length !== 0) {
        moves.push({type: MoveType.TakeBackPlayedCards})
      }
      const cardsToDraw: number = playerCouldDraw(huntingPlayer)
      if (huntingPlayer.deck.length < cardsToDraw && huntingPlayer.discard.length > 0) {
        moves.push(shuffleDiscardPileMove(huntingPlayer.color, shuffle(huntingPlayer.discard)))
      }
      moves.push(drawCardsMove(huntingPlayer.color), {type: MoveType.ChangeActivePlayer})
      return moves
    } else if (huntingPlayer.hunting.hunt) {
      if (getBoardZones(this.state.players.length)[huntingPlayer.hunting.hunt.zone].safe <= huntingPlayer.hunting.hunt.huntersValue) {
        return {type: MoveType.ValidateSpentHunters}
      }
    } else if (huntingPlayer.hunting.tilesHunted > 0) {
      return [...getFulfilledObjectives(this.state).map(fulfillObjectiveMove)]
    }
    return
  }

  getView(playerId?: PlayerColor): GameView {
    return {
      ...this.state,
      tilesDecks: this.state.tilesDecks.map(pile => pile.length),
      players: this.state.players.map(p => {
        if (playerId === p.color) {
          return {...p, deck: p.deck.length}
        } else {
          return getHuntingPlayer(this.state)
            ? {...p, deck: p.deck.length, hand: p.hand.length}
            : {...p, deck: p.deck.length, hand: p.hand.length + p.played.length, played: []}
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
        if (playerId === move.player) {
          return move
        } else {
          return {type: MoveType.PlayHuntCard, player: move.player}
        }
      case MoveType.RevealHuntCards:
        const result: { color: PlayerColor, cards: number[] }[] = []
        this.state.players.forEach(p => result.push({color: p.color, cards: p.played}))
        return {type: MoveType.RevealHuntCards, cardsPlayed: result}
      case MoveType.RefillHuntingBoard:
        const zones = getBoardZones(this.state.players.length)
        return {...move, newBoard: this.state.huntingBoard.map((tile, zone) => tile !== null ? tile : this.state.tilesDecks[zones[zone].type][0] ?? null)}
      case MoveType.DrawCards: {
        if (playerId === move.player) {
          const player = this.state.players.find(p => p.color === playerId)!
          return {...move, cards: player.deck.slice(0, playerWillDraw(player))}
        } else {
          return move
        }
      }
      case MoveType.ShuffleDiscardPile:
        return {type: MoveType.ShuffleDiscardPile, player: move.player}
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

export function setupPlayers(players: PrehistoriesPlayerOptions[], isTutorial: boolean): PlayerState[] {
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

export function playerCouldDraw(player: PlayerState | PlayerView | PlayerViewSelf): number {
  if (!player.hunting?.tilesHunted) {
    return 3
  }
  return Math.max(0, 2 - player.hunting.injuries) + handPrintsJustRecovered(player)
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

export function isWinner(player: PlayerState | PlayerView | PlayerViewSelf) {
  return player.totemTokens.length >= 8
}