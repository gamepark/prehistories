import {Game, GameSpeed, SecretInformation, SimultaneousGame} from '@gamepark/rules-api'
import { shuffle } from 'lodash'
import GameState from './GameState'
import GameView, { getPlayers } from './GameView'
import { getGoalsArray } from './material/Goals'
import { allPolyominos} from './material/Polyominos'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import PlayHuntCard, { playHuntCard } from './moves/PlayHuntCard'
import { revealHuntCards } from './moves/RevealHuntCards'
import TellYouAreReady, { tellYouAreReady } from './moves/TellYouAreReady'
import PlayerColor from './PlayerColor'
import PlayerState, { setupCave, setupDeck } from './PlayerState'
import {isGameOptions, PrehistoriesOptions, PrehistoriesPlayerOptions} from './PrehistoriesOptions'
import Phase from './types/Phase'

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
        activePlayer:undefined
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
    return false
  }

  isActive(playerId:PlayerColor): boolean {
    switch (this.state.phase){
      case Phase.Initiative:
        return this.state.players.find(p => p.color === playerId)!.isReady !== true
      
      default: return false
    }
  }

  getLegalMoves(color:PlayerColor): Move[] {
    if (this.state.phase === Phase.Initiative){
      const player = this.state.players.find(p => p.color === color)!
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
      default: return

    }
  }

  getAutomaticMove(): void | Move {

    switch(this.state.phase){
      case Phase.Initiative:
        if (this.state.players.every(p => p.isReady === true)){
          return {type:MoveType.RevealHuntCards}
        }
    }

    return
  }

  getView(playerId?:PlayerColor): GameView {
    return {
      ...this.state,
      caveDisplayed:playerId === undefined ? PlayerColor.Yellow : playerId,
      players:this.state.players.map(p => {
        if (this.state.phase === undefined || playerId === p.color){
          return {...p, deck:p.deck.length}
        } else {
          return this.state.phase === Phase.Initiative ? {...p, deck:p.deck.length, hand:p.hand.length, played:p.played.length} : {...p, deck:p.deck.length, hand:p.hand.length}
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