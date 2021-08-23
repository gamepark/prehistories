import PlayHuntCard from './PlayHuntCard'
import RevealHuntCards from './RevealHuntCards'
import TakePolyomino from './TakePolyomino'
import TellYouAreReady from './TellYouAreReady'

type Move = PlayHuntCard | TellYouAreReady | RevealHuntCards |TakePolyomino

export default Move