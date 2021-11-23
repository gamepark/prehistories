import GameState from "@gamepark/prehistories/GameState";
import Objective from "@gamepark/prehistories/material/Objective";
import Tile from "@gamepark/prehistories/material/Tile";
import Move from "@gamepark/prehistories/moves/Move";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import PlayerState from "@gamepark/prehistories/PlayerState";
import { setupPlayers } from "@gamepark/prehistories/Prehistories";
import Phase from "@gamepark/prehistories/types/Phase";
import { TutorialDescription } from "@gamepark/react-client";

const playersTab:PlayerState[] = setupPlayers([{id:PlayerColor.Yellow}, {id:PlayerColor.Green}, {id:PlayerColor.White}], true)
const objectivesTab:Objective[] = [Objective.Column5Same,Objective.PaintMiddle9,Objective.SurroundLegendary,Objective.ConnectTotemAnimals]
const huntingBoardTab:Tile[] = [19,2,28,29,33]
const tilesDeckTab:Tile[][] = [
                              [13,13,1,25,25,7,13,25,1,19,7,25,13,19,7,25,7,19,1,13,1,1,7,19],
                              [26,26,20,8,26,14,20,20,26,14,14,14,26,8,8,8,20,2,14,20,2,2,2,8],
                              [16,3,27,9,21,10,15,22,4],
                              [17,30,6,12,18,23,5,11,24],
                              [34,31,32,35]]

const PrehistoriesTutorial: TutorialDescription<GameState, Move, PlayerColor> = {
    setupTutorial:() => [{
        players:playersTab,
        objectives:objectivesTab,
        huntingBoard:huntingBoardTab,
        tilesDeck:tilesDeckTab,
        phase:Phase.Initiative,
        tutorial:true
    }, [PlayerColor.Yellow, PlayerColor.Green, PlayerColor.White]],
    
    expectedMoves:()=> [
        // Turn 1
            // Initiative
        {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:6},
        {type:MoveType.EndTurn,player:PlayerColor.Yellow},
        {type:MoveType.PlayHuntCard,player:PlayerColor.Green,card:7},
        {type:MoveType.PlayHuntCard,player:PlayerColor.Green,card:6},
        {type:MoveType.PlayHuntCard,player:PlayerColor.Green,card:0},
        {type:MoveType.EndTurn,player:PlayerColor.Green},
        {type:MoveType.PlayHuntCard,player:PlayerColor.White,card:2},
        {type:MoveType.PlayHuntCard,player:PlayerColor.White,card:4},
        {type:MoveType.EndTurn,player:PlayerColor.White},
            // Hunt
        {type:MoveType.PlaceTile,coordinates:{x:0,y:1},side:0,huntZone:0},
        {type:MoveType.SpendHunter,card:6},
        {type:MoveType.EndTurn,player:PlayerColor.Yellow},
        {type:MoveType.PlaceTile,coordinates:{x:0,y:6},side:0,huntZone:1},
        {type:MoveType.SpendHunter,card:6},
        {type:MoveType.SpendHunter,card:7},
        {type:MoveType.EndTurn,player:PlayerColor.Green},

        // Turn 2
            // Initiative
        [{type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:2},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:3},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:4},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:8}],
        [{type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:2},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:3},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:4},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:8}],
        [{type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:2},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:3},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:4},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:8}],
        [{type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:2},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:3},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:4},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:8}],
         {type:MoveType.EndTurn,player:PlayerColor.Yellow},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Green,card:11},
         {type:MoveType.PlayHuntCard,player:PlayerColor.Green,card:0},
         {type:MoveType.EndTurn,player:PlayerColor.Green},
         {type:MoveType.PlayHuntCard,player:PlayerColor.White,card:0},
         {type:MoveType.PlayHuntCard,player:PlayerColor.White,card:2},
         {type:MoveType.PlayHuntCard,player:PlayerColor.White,card:4},
         {type:MoveType.EndTurn,player:PlayerColor.White},
             // Hunt
         {type:MoveType.PlaceTile,coordinates:{x:0,y:5},side:0,huntZone:0},
         {type:MoveType.SpendHunter,card:4},
         {type:MoveType.SpendHunter,card:2},
         {type:MoveType.EndTurn,player:PlayerColor.White},
         {type:MoveType.PlaceTile,coordinates:{x:2,y:5},side:0,huntZone:2},
         {type:MoveType.SpendHunter,card:0},
         {type:MoveType.SpendHunter,card:11},
         {type:MoveType.ValidateSpentHunters},
         {type:MoveType.EndTurn,player:PlayerColor.Green},
         {type:MoveType.PlaceTile,coordinates:{x:2,y:1},side:1,huntZone:1},
         [{type:MoveType.SpendHunter,card:2},
         {type:MoveType.SpendHunter,card:3}],
         [{type:MoveType.SpendHunter,card:2},
         {type:MoveType.SpendHunter,card:3}],
         {type:MoveType.ValidateSpentHunters},
         {type:MoveType.EndTurn,player:PlayerColor.Yellow},

        // Turn 3
            // Initiative
        [{type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:8},
        {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:4},
        {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:10}],
        [{type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:8},
        {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:4},
        {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:10}],
        [{type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:8},
        {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:4},
        {type:MoveType.PlayHuntCard,player:PlayerColor.Yellow,card:10}],
        {type:MoveType.EndTurn,player:PlayerColor.Yellow},
        {type:MoveType.PlayHuntCard,player:PlayerColor.Green,card:4},
        {type:MoveType.PlayHuntCard,player:PlayerColor.Green,card:1},
        {type:MoveType.EndTurn,player:PlayerColor.Green},
        {type:MoveType.PlayHuntCard,player:PlayerColor.White,card:0},
        {type:MoveType.PlayHuntCard,player:PlayerColor.White,card:3},
        {type:MoveType.PlayHuntCard,player:PlayerColor.White,card:5},
        {type:MoveType.PlayHuntCard,player:PlayerColor.White,card:6},
        {type:MoveType.PlayHuntCard,player:PlayerColor.White,card:10},
        {type:MoveType.PlayHuntCard,player:PlayerColor.White,card:11},
        {type:MoveType.EndTurn,player:PlayerColor.White},
            // Hunt
            {type:MoveType.PlaceTile,coordinates:{x:4,y:6},side:0,huntZone:0},
            {type:MoveType.SpendHunter,card:1},
            {type:MoveType.SpendHunter,card:4},
            {type:MoveType.EndTurn,player:PlayerColor.Green},
            {type:MoveType.PlaceTile,coordinates:{x:3,y:3},side:0,huntZone:4},
            [{type:MoveType.SpendHunter,card:4},
            {type:MoveType.SpendHunter,card:8},
            {type:MoveType.SpendHunter,card:10}],
            [{type:MoveType.SpendHunter,card:4},
            {type:MoveType.SpendHunter,card:8},
            {type:MoveType.SpendHunter,card:10}],
            [{type:MoveType.SpendHunter,card:4},
            {type:MoveType.SpendHunter,card:8},
            {type:MoveType.SpendHunter,card:10}],
            {type:MoveType.ValidateSpentHunters},
            {type:MoveType.EndTurn,player:PlayerColor.Yellow},
            {type:MoveType.PlaceTile,coordinates:{x:1,y:4},side:0,huntZone:2},
            {type:MoveType.SpendHunter,card:10},
            {type:MoveType.SpendHunter,card:6},
            {type:MoveType.EndTurn,player:PlayerColor.White},

    ]

}

export default PrehistoriesTutorial
    
