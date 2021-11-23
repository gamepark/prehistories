import FulfillObjective from './FulfillObjective'
import DrawCards from './DrawCards'
import EndTurn from './EndTurn'
import PlayHuntCard from './PlayHuntCard'
import PlaceTile from './PlaceTile'
import RefillHuntingBoard from './RefillHuntingBoard'
import RevealHuntCards from './RevealHuntCards'
import ShuffleDiscardPile from './ShuffleDiscardPile'
import SpendHunter from './SpendHunter'
import TakeBackPlayedCards from './TakeBackPlayedCards'
import ValidateSpentHunters from './ValidateSpentHunters'

type Move = PlayHuntCard |
            RevealHuntCards |
            PlaceTile |
            SpendHunter |
            ValidateSpentHunters |
            FulfillObjective |
            EndTurn |
            TakeBackPlayedCards |
            RefillHuntingBoard |
            DrawCards |
            ShuffleDiscardPile

export default Move