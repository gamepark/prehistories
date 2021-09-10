import ChangeActivePlayer from './ChangeActivePlayer'
import CheckPermanentObjectives from './CheckPermanentObjectives'
import CheckVariableObjectives from './CheckVariableObjectives'
import DrawXCards from './DrawXCards'
import EndTurn from './EndTurn'
import PlayHuntCard from './PlayHuntCard'
import PlayPolyomino from './PlayPolyomino'
import RefillHuntingBoard from './RefillHuntingBoard'
import RevealHuntCards from './RevealHuntCards'
import ShuffleDiscardPile from './ShuffleDiscardPile'
import SpendHunter from './SpendHunter'
import TakeBackPlayedCards from './TakeBackPlayedCards'
import TellYouAreReady from './TellYouAreReady'
import ValidateSpendedHunters from './ValidateSpendedHunters'

type Move = PlayHuntCard | TellYouAreReady | RevealHuntCards | PlayPolyomino | SpendHunter | ValidateSpendedHunters |
CheckPermanentObjectives | CheckVariableObjectives | EndTurn | TakeBackPlayedCards | RefillHuntingBoard | DrawXCards | ShuffleDiscardPile | ChangeActivePlayer

export default Move