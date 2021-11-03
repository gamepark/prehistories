import Coordinates from './Coordinates'

type PlacedTile = {
  tile: number
  side: 0 | 1
} & Coordinates

export default PlacedTile