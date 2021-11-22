import {DrawCardsView} from './DrawCards'
import Move from './Move'
import {PlayHuntCardView} from './PlayHuntCard'
import RefillHuntingBoard, {RefillHuntingBoardView} from './RefillHuntingBoard'
import RevealHuntCards, {RevealHuntCardsView} from './RevealHuntCards'
import ShuffleDiscardPile, {ShuffleDiscardPileView} from './ShuffleDiscardPile'

type MoveView = Exclude<Move,
                            RevealHuntCards |
                            RefillHuntingBoard |
                            ShuffleDiscardPile> |
                    PlayHuntCardView |
                    RevealHuntCardsView |
                    RefillHuntingBoardView |
                    DrawCardsView |
                    ShuffleDiscardPileView

export default MoveView