import ChangeActivePlayer from './ChangeActivePlayer'
import ResolvePermanentGoals from './CheckPermanentGoals'
import ResolveVariableGoals from './CheckVariableGoals'
import DrawCards from './DrawCards'
import EndGame from './EndGame'
import EndTurn from './EndTurn'
import PlayHuntCard from './PlayHuntCard'
import PlaceTile from './PlaceTile'
import RefillHuntingBoard from './RefillHuntingBoard'
import RevealHuntCards from './RevealHuntCards'
import SetHuntPhase from './SetHuntPhase'
import ShuffleDiscardPile from './ShuffleDiscardPile'
import SpendHunter from './SpendHunter'
import TakeBackPlayedCards from './TakeBackPlayedCards'
import TellYouAreReady from './TellYouAreReady'
import ValidateSpendedHunters from './ValidateSpentHunters'

type Move = PlayHuntCard |
            TellYouAreReady |
            RevealHuntCards |
            PlaceTile |
            SpendHunter |
            ValidateSpendedHunters |
            ResolvePermanentGoals |
            ResolveVariableGoals |
            SetHuntPhase |
            EndTurn |
            TakeBackPlayedCards |
            RefillHuntingBoard |
            DrawCards |
            ShuffleDiscardPile |
            ChangeActivePlayer |
            EndGame

export default Move