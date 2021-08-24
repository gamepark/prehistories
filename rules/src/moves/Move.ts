import PlayHuntCard from './PlayHuntCard'
import PlayPolyomino from './PlayPolyomino'
import RevealHuntCards from './RevealHuntCards'
import TellYouAreReady from './TellYouAreReady'

type Move = PlayHuntCard | TellYouAreReady | RevealHuntCards | PlayPolyomino

export default Move