import ChangeActivePlayer from './ChangeActivePlayer'
import ResolvePermanentObjectives from './CheckPermanentObjectives'
import ResolveVariableObjectives from './CheckVariableObjectives'
import CheckVariableObjectives from './CheckVariableObjectives'
import DrawXCards from './DrawXCards'
import EndGame from './EndGame'
import EndTurn from './EndTurn'
import PlayHuntCard from './PlayHuntCard'
import PlayPolyomino from './PlayPolyomino'
import RefillHuntingBoard from './RefillHuntingBoard'
import RevealHuntCards from './RevealHuntCards'
import SetHuntPhase from './SetHuntPhase'
import ShuffleDiscardPile from './ShuffleDiscardPile'
import SpendHunter from './SpendHunter'
import TakeBackPlayedCards from './TakeBackPlayedCards'
import TellYouAreReady from './TellYouAreReady'
import ValidateSpendedHunters from './ValidateSpendedHunters'

type Move = PlayHuntCard | TellYouAreReady | RevealHuntCards | PlayPolyomino | SpendHunter | ValidateSpendedHunters |
ResolvePermanentObjectives | ResolveVariableObjectives | SetHuntPhase | EndTurn | TakeBackPlayedCards | RefillHuntingBoard | DrawXCards | ShuffleDiscardPile | ChangeActivePlayer | EndGame

export default Move