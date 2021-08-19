import Move from './Move'
import { PlayHuntCardView } from './PlayHuntCard'
import RevealHuntCards, { RevealHuntCardsView } from './RevealHuntCards'

type MoveView = Exclude<Move, RevealHuntCards> | PlayHuntCardView | RevealHuntCardsView

export default MoveView