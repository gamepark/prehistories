import { DrawXCardsView } from './DrawXCards'
import Move from './Move'
import { PlayHuntCardView } from './PlayHuntCard'
import RefillHuntingBoard, { RefillHuntingBoardView } from './RefillHuntingBoard'
import RevealHuntCards, { RevealHuntCardsView } from './RevealHuntCards'
import ShuffleDiscardPile, { ShuffleDiscardPileView } from './ShuffleDiscardPile'
import { TakeBackPlayedCardsView } from './TakeBackPlayedCards'

type MoveView = Exclude<Move,
                            RevealHuntCards |
                            RefillHuntingBoard |
                            ShuffleDiscardPile> |
                    PlayHuntCardView |
                    RevealHuntCardsView |
                    RefillHuntingBoardView |
                    TakeBackPlayedCardsView |
                    DrawXCardsView |
                    ShuffleDiscardPileView

export default MoveView