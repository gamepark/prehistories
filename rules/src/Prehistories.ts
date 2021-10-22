import {SecretInformation, SimultaneousGame} from '@gamepark/rules-api'
import { shuffle } from 'lodash'
import GameState from './GameState'
import GameView from './GameView'
import { getGoalsArray } from './material/Goals'
import getHandPrintsCoords from './material/HandPrints'
import { allPolyominos} from './material/Polyominos'
import { changeActivePlayer } from './moves/ChangeActivePlayer'
import { checkPermanentObjectives, resolvePermanentObjectives } from './moves/CheckPermanentObjectives'
import { checkVariableObjectives, resolveVariableObjectives } from './moves/CheckVariableObjectives'
import { drawXCards } from './moves/DrawXCards'
import { endGame } from './moves/EndGame'
import EndTurn, { endTurn } from './moves/EndTurn'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import PlayHuntCard, { playHuntCard } from './moves/PlayHuntCard'
import PlayPolyomino, { playPolyomino } from './moves/PlayPolyomino'
import { getNewTile, refillHuntingBoard } from './moves/RefillHuntingBoard'
import { revealHuntCards } from './moves/RevealHuntCards'
import { setHuntPhase } from './moves/SetHuntPhase'
import { shuffleDiscardPile } from './moves/ShuffleDiscardPile'
import SpendHunter, { spendHunter } from './moves/SpendHunter'
import { takeBackPlayedCards } from './moves/TakeBackPlayedCards'
import TellYouAreReady, { tellYouAreReady } from './moves/TellYouAreReady'
import ValidateSpendedHunters, { validateSpendedHunters } from './moves/ValidateSpendedHunters'
import PlayerColor from './PlayerColor'
import PlayerState, { setupCave, setupDeck } from './PlayerState'
import {isGameOptions, PrehistoriesOptions, PrehistoriesPlayerOptions} from './PrehistoriesOptions'
import Coordinates from './types/Coordinates'
import Phase, { HuntPhase } from './types/Phase'
import { isPlayerState, PlayerHuntView, PlayerView, PlayerViewSelf } from './types/PlayerView'
import getSquaresStartLeft, { getFreeSquaresFromPath, getOccupiedSquares, isCoordFree, isCoordOutOfBorders } from './utils/getSquaresStartLeft'
import powerLevels from './utils/powerLevels'
import teamPower from './utils/teamPower'

export default class Prehistories extends SimultaneousGame<GameState, Move, PlayerColor>
  implements SecretInformation<GameState, GameView, Move, MoveView, PlayerColor> {

  constructor(state: GameState)
  constructor(options: PrehistoriesOptions)
  constructor(arg: GameState | PrehistoriesOptions) {
    if (isGameOptions(arg)) {

      const game:GameState = {
        players: setupPlayers(arg.players),
        tilesDeck: setupTilesDeck(),
        huntingBoard: [],
        goals: [],
        phase: Phase.Initiative ,
        sortedPlayers:undefined
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

  isActive(playerId:PlayerColor): boolean {
    switch (this.state.phase){
      case Phase.Initiative:
        return this.state.players.find(p => p.color === playerId)!.isReady !== true
      case Phase.Hunt:
        return this.state.sortedPlayers !== undefined ? this.state.sortedPlayers![0] === playerId : false
      default: return false
    }
  }

  getLegalMoves(color:PlayerColor): Move[] {
    const player = this.state.players.find(p => p.color === color)!
    if (this.state.phase === Phase.Initiative){
      if (player.isReady === true){
        return []
      } else {
        const playHuntCardMoves:(PlayHuntCard|TellYouAreReady)[] = []
        player.hand.forEach(card => {
          playHuntCardMoves.push({type:MoveType.PlayHuntCard, playerId:color, card:card})
        })
        playHuntCardMoves.push({type:MoveType.TellYouAreReady, playerId:color})
        return playHuntCardMoves
      }
    } else {
      switch (player.huntPhase){
        case HuntPhase.Hunt : {
          const playPolyominoMoves:(PlayPolyomino|EndTurn)[] = []
          const accessibleSquares:Coordinates[] = getFreeSquaresFromPath(getSquaresStartLeft(player.cave),player.cave)
          this.state.huntingBoard.forEach((tile, index) => {
            if (tile !== null && teamPower(player.played) >= powerLevels(this.state.players.length, index)[0]){
              ([0,1] as (0|1)[]).forEach(side => {
                for (let x = 0;x<7;x++){
                  for (let y = 0;y<7;y++){
    
                    if(allPolyominos[tile][side].coordinates.some(coord => accessibleSquares.find(square => square.x === x+coord.x && square.y === y+coord.y))
                    && allPolyominos[tile][side].coordinates.every(coord => !isCoordOutOfBorders({x:coord.x+x,y:coord.y+y}) && isCoordFree({x:coord.x+x,y:coord.y+y}, getOccupiedSquares(player.cave)))){
                      playPolyominoMoves.push({type:MoveType.PlayPolyomino, huntSpot:index, playerId:color, polyomino:tile, side, square:{x,y}})
                    }
                  }
                }
              })
            }
          })
          const endTurnMove:EndTurn[] = [{type:MoveType.EndTurn, playerId:color}]
          return playPolyominoMoves.concat(endTurnMove)
        }
        case HuntPhase.Pay : {
          const spendHuntersAndValidateMoves:(SpendHunter|ValidateSpendedHunters)[] = [] 
          player.played.forEach(card => {
            spendHuntersAndValidateMoves.push({type:MoveType.SpendHunter, playerId:this.state.sortedPlayers![0], card})
          })
          if (player.huntSpotTakenLevels![0] <= 0){
            spendHuntersAndValidateMoves.push({type:MoveType.ValidateSpendedHunters, playerId:this.state.sortedPlayers![0]})
          }
          return spendHuntersAndValidateMoves
        }
        default : {
          return []
        }
      }

    }
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
      case MoveType.ValidateSpendedHunters:
        return validateSpendedHunters(this.state, move)
      case MoveType.ResolvePermanentObjectives:
        return resolvePermanentObjectives(this.state, move)
      case MoveType.ResolveVariableObjectives:
        return resolveVariableObjectives(this.state, move)
      case MoveType.SetHuntPhase:
        return setHuntPhase(this.state, move)
      case MoveType.RefillHuntingBoard:
        return refillHuntingBoard(this.state)
      case MoveType.EndTurn:
        return endTurn(this.state, move)
      case MoveType.TakeBackPlayedCards:
        return takeBackPlayedCards(this.state, move)
      case MoveType.DrawXCards:
        return drawXCards(this.state, move)
      case MoveType.ShuffleDiscardPile:
        return shuffleDiscardPile(this.state, move)
      case MoveType.ChangeActivePlayer:
        return changeActivePlayer(this.state, move)
      case MoveType.EndGame:
        return endGame(this.state)
      default: return
    }
  }

  getAutomaticMove(): void | Move {

    switch(this.state.phase){
      case Phase.Initiative:{
        if (this.state.players.every(p => p.isReady === true)){
          return {type:MoveType.RevealHuntCards}
        } else return
      } 
      case Phase.Hunt:{
        if (this.state.sortedPlayers!.length === 0){
          return {type:MoveType.RefillHuntingBoard}
        }

        if (this.state.players.some(p => p.totemTokens === 0)){
          return {type:MoveType.EndGame}
        }

        const player = this.state.players.find(p => p.color === this.state.sortedPlayers![0])!

        switch(player.huntPhase){
          case HuntPhase.Pay:{
            if (player.huntSpotTakenLevels![1] <= 0){
              return {type:MoveType.ValidateSpendedHunters, playerId:player.color}
            } else return
          }
          case HuntPhase.CheckPermanentObjectives:{

            const result = checkPermanentObjectives(this.state, player)
            if (result[0].length !== 0 || result[1].length !== 0 || result[2] === true){
              return {type:MoveType.ResolvePermanentObjectives, playerId:player.color, objectivesCompleted:result}
            } else {
              return {type:MoveType.SetHuntPhase, playerId:player.color}
            }
          }

          case HuntPhase.CheckVariableObjectives:{
            const result = checkVariableObjectives(this.state, player)
            if (result !== false){
              return {type:MoveType.ResolveVariableObjectives, playerId:player.color, goal:result[0],tokens:result[1]}
            } else {
              return {type:MoveType.SetHuntPhase, playerId:player.color}
            }
          }

          case HuntPhase.DrawCards:{
            if (player.played.length !== 0){
              return {type:MoveType.TakeBackPlayedCards, playerId:player.color, cards:player.played}
            } else {
              const cardsToDraw:number = howManyCardToDraw(player)
              if (player.deck.length < cardsToDraw && player.deck.length + player.discard.length >= cardsToDraw){

                const shuffledDiscardPile = shuffle(player.discard)
                return {type:MoveType.ShuffleDiscardPile,playerId:player.color,newDeck:shuffledDiscardPile}
              } else {
                return {type:MoveType.DrawXCards, playerId:player.color, cards:getCardsToDraw(player)}
              }
            }
          }
          case HuntPhase.ChangeActivePlayer:{
            return {type:MoveType.ChangeActivePlayer}
          }
        }
      }

    }

    return
  }

  getView(playerId?:PlayerColor): GameView {
    return {
      ...this.state,
      caveDisplayed:playerId === undefined ? PlayerColor.Yellow : playerId,
      tilesDeck:this.state.tilesDeck.map(pile => pile.length),
      players:this.state.players.map(p => {
        if (this.state.phase === undefined || playerId === p.color){
          return {...p, deck:p.deck.length}
        } else {
          return (this.state.phase === Phase.Initiative || (this.state.sortedPlayers !== undefined && this.state.sortedPlayers.find(sp => sp === p.color) === undefined)) ? {...p, deck:p.deck.length, hand:p.hand.length, played:p.played.length} : {...p, deck:p.deck.length, hand:p.hand.length}
        }
      })}
  }

  getPlayerView(playerId: PlayerColor): GameView {
    return this.getView(playerId)
  }

  getMoveView(move: Move, playerId?: PlayerColor): MoveView {
    switch (move.type){
      case MoveType.PlayHuntCard:
        if (playerId === move.playerId){
          return move
        } else {
          return {type:MoveType.PlayHuntCard, playerId:move.playerId}
        }
      case MoveType.RevealHuntCards:
        const result:{color:PlayerColor, cards:number[]}[] = []
        this.state.players.forEach(p => result.push({color:p.color, cards:p.played}))
        return {type:MoveType.RevealHuntCards, cardsPlayed:result}
      case MoveType.RefillHuntingBoard:

        const newBoard:(number|null)[] = []
        this.state.huntingBoard.forEach((tile, spot) => {
          if (tile === null){
            newBoard.push(getNewTile(this.state.players.length, spot, this.state.tilesDeck, true, this.state.huntingBoard))
          } else {
            newBoard.push(tile)
          }
        })
        return {...move, newBoard}

      case MoveType.TakeBackPlayedCards:
        if (playerId === move.playerId){
          return move
        } else {
          return {type:MoveType.TakeBackPlayedCards, playerId:move.playerId, playedLength:this.state.players.find(p => p.color === move.playerId)!.played.length}
        }
      case MoveType.DrawXCards:
        if (playerId === move.playerId){
          return move
        } else {
          return {type:MoveType.DrawXCards, playerId:move.playerId, cards:howManyCardToDraw(this.state.players.find(p => p.color === move.playerId)!)}
        }
      case MoveType.ShuffleDiscardPile:
        return {type:MoveType.ShuffleDiscardPile, playerId:move.playerId,newDeckLength:move.newDeck.length}
      default : return move
    }
  }

  getPlayerMoveView(move: Move, playerId: PlayerColor): MoveView {
    return this.getMoveView(move, playerId)
  }
}

function setupPlayers(players: PrehistoriesPlayerOptions[]): PlayerState[] {
  return players.map((options) => ({
    color:options.id, cave:setupCave(options.id), totemTokens:8, deck:setupDeck(options.id), discard:[], hand:[], played:[], goalsMade:[]
  }))
}

function setupTilesDeck():number[][]{
  const polyominosArray:number[] = Array.from(allPolyominos.keys())
    
  return [shuffle(polyominosArray.filter(p => p > 1 && p < 27)),
          shuffle(polyominosArray.filter(p => p > 26 && p < 52)),
          shuffle(polyominosArray.filter(p => p > 51 && p < 62)),
          shuffle(polyominosArray.filter(p => p > 61 && p < 72)),
          shuffle(polyominosArray.filter(p => p > 71 && p < 77))]
}

function setupGoals(game:GameState, isExpertGame:boolean):number[]{
  const goalsIds = shuffle(Array.from(getGoalsArray(isExpertGame).keys()))
  const numberOfGoals:number = game.players.length < 4 ? 4 : 5
  if (isExpertGame !== true){
    return numberOfGoals === 4 ? [goalsIds[0],goalsIds[1],goalsIds[2],goalsIds[3]] : [goalsIds[0],goalsIds[1],goalsIds[2],goalsIds[3],goalsIds[4]]
  } else {
    const result : number[] = [goalsIds[0]]
    goalsIds.forEach(elem => {
      result.every( res => getGoalsArray(isExpertGame)[elem].idConflict !== getGoalsArray(isExpertGame)[res].idConflict ) && result.push(elem)
    })
    return numberOfGoals === 4 ? [result[0],result[1],result[2],result[3]] : [result[0],result[1],result[2],result[3],result[4]]
  }
  
}

function setupHuntingBoard(game:GameState):number[]{
  if(game.players.length < 4){
    return([game.tilesDeck[0].pop()!, game.tilesDeck[1].pop()!, game.tilesDeck[2].pop()!, game.tilesDeck[3].pop()!, game.tilesDeck[4].pop()!]) 
  } else {
    return([game.tilesDeck[0].pop()!, game.tilesDeck[0].pop()!, game.tilesDeck[1].pop()!, game.tilesDeck[1].pop()!, game.tilesDeck[2].pop()!, game.tilesDeck[3].pop()!, game.tilesDeck[4].pop()!])
  }
}

function setupHandPlayer(players:PlayerState[]):void{
  players.forEach(p => {
        for(let i=0;i<3;i++){
          p.hand.push(p.deck.pop()!)
        }
    })
}

function getCardsToDraw(player:PlayerState):number[]{
  const result:number[] = []
  for (let i=0;i<howManyCardToDraw(player);i++){
    result.push(player.deck[player.deck.length-1-i])
  }
  return result
}

export function howManyCardToDraw(player:PlayerState|PlayerView|PlayerViewSelf|PlayerHuntView):number{
  return player.tilesHunted === undefined ? 3 : (player.injuries === undefined ? 2 + areHandPrintsRecovered(player) : Math.max(0, 2 - player.injuries) + areHandPrintsRecovered(player))
}

export function areHandPrintsRecovered(player:PlayerState|PlayerView|PlayerViewSelf|PlayerHuntView):number{
  let result:number = 0
  if (player.tilesHunted === undefined) {
    return result
  }
  else {
    for (let i=0;i<player.tilesHunted;i++){
      const tile = player.cave[player.cave.length-1-i]
      allPolyominos[tile.polyomino][tile.side].coordinates.forEach(coord => {
        if (tile.x+coord.x === getHandPrintsCoords(player.color)[0].x && tile.y+coord.y === getHandPrintsCoords(player.color)[0].y){
          result++
        }
        if (tile.x+coord.x === getHandPrintsCoords(player.color)[1].x && tile.y+coord.y === getHandPrintsCoords(player.color)[1].y){
          result+=2
        }
      })
    }
    return result
  }

}