import {HuntPhase} from "./Phase"

type Hunting = {
  hunt?: Hunt
  huntPhase: HuntPhase
  injuries: number
  tilesHunted: number
}

type Hunt = {
  zone: number
  huntersValue: number
}

export default Hunting