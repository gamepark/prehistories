import Move from './Move'
import ShuffleDiscardPile, {ShuffleDiscardPileRandomized} from './ShuffleDiscardPile'

type MoveRandomized = Exclude<Move, ShuffleDiscardPile> | ShuffleDiscardPileRandomized

export default MoveRandomized