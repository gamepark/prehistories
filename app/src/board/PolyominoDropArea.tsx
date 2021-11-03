/** @jsxImportSource @emotion/react */
import PolyominoToHunt from "@gamepark/prehistories/types/appTypes/PolyominoToHunt"
import Coordinates from "@gamepark/prehistories/types/Coordinates"
import {HTMLAttributes, useCallback, useMemo, useRef} from "react"
import {DropTargetMonitor, useDrop, XYCoord} from "react-dnd"
import {PlayerHuntView, PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView";
import {css} from "@emotion/react"
import useEfficientDragLayer from '@gamepark/react-components/dist/Draggable/useEfficientDragLayer'
import {useSound} from "@gamepark/react-client"
import MoveTileSound from "../sounds/moveTile.mp3"
import {placeTileMove} from "@gamepark/prehistories/moves/PlaceTile";
import {canPlaceTile, getCavePlacementSpaces, PlacementSpace} from "@gamepark/prehistories/utils/PlacementRules";
import {Side} from "@gamepark/prehistories/material/Tile";
import {getPlacedTileCoordinates} from "@gamepark/prehistories/types/PlacedTile";


type Props = {
  player: PlayerView | PlayerViewSelf | PlayerHuntView
} & HTMLAttributes<HTMLDivElement>

export default function PolyominoDropArea({player, ...props}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const moveTileSound = useSound(MoveTileSound)
  moveTileSound.volume = 0.5

  const getAreaPosition = useCallback((sourceClientOffset: XYCoord) => {
    const dropArea = ref.current!.getBoundingClientRect()
    const y = Math.round(((sourceClientOffset.x - dropArea.x) * 7) / dropArea.width)
    const x = Math.round(((sourceClientOffset.y - dropArea.y) * 7) / dropArea.height)
    return {x, y}
  }, [])

  const cave = useMemo(() => getCavePlacementSpaces(player), [player])

  const [{draggedPolyo, over}, dropRef] = useDrop({
    accept: "PolyominoToHunt",
    canDrop: (item: PolyominoToHunt, monitor) => {
      const sourceClientOffset = monitor.getSourceClientOffset()
      if (!sourceClientOffset) return false
      return canPlaceTile(cave, {tile: item.polyomino, side: item.side, ...getAreaPosition(sourceClientOffset)})
    },
    drop: (item: PolyominoToHunt, monitor) => {
      moveTileSound.play()
      const position = getAreaPosition(monitor.getSourceClientOffset()!)
      return placeTileMove(item.huntSpot, item.side, position)
    },
    collect: (monitor: DropTargetMonitor<PolyominoToHunt>) => {
      return ({
        draggedPolyo: monitor.getItemType() === "PolyominoToHunt" ? {
          type: monitor.getItem().type,
          polyomino: monitor.getItem().polyomino,
          side: monitor.getItem().side,
          huntSpot: monitor.getItem().huntSpot
        } : undefined,
        over: monitor.isOver()
      })
    }
  })

  dropRef(ref)

  return (
    <div ref={ref} css={style} {...props}>
      {draggedPolyo && <ValidDropAreaHighlight cave={cave} tile={draggedPolyo.polyomino} side={draggedPolyo.side}/>}
      {draggedPolyo && over && <DropShadow cave={cave} tile={draggedPolyo.polyomino} side={draggedPolyo.side} getAreaPosition={getAreaPosition}/>}
    </div>
  )
}

type ValidDropAreaHighlightProps = {
  cave: PlacementSpace[][]
  tile: number
  side: Side
}

function ValidDropAreaHighlight({cave, tile, side}: ValidDropAreaHighlightProps) {
  const area = useMemo(() => getValidDropArea(cave, tile, side), [cave, tile, side])
  return <>{
    area.map((row, y) =>
      row.map((space, x) => space && <div key={`${x}_${y}`} css={[squareCss, position({x, y}), highlight]}/>)
    )
  }</>
}

function getValidDropArea(cave: PlacementSpace[][], tile: number, side: Side): boolean[][] {
  const area: boolean[][] = cave.map(row => row.map(() => false))
  for (let y = 0; y < area.length; y++) {
    for (let x = 0; x < area[y].length; x++) {
      const placedTile = {tile, side, x, y}
      if (canPlaceTile(cave, placedTile)) {
        for (const {x, y} of getPlacedTileCoordinates(placedTile)) {
          area[y][x] = true
        }
      }
    }
  }
  return area
}

const squareSize = 14.2857

type DropShadowProps = {
  cave: PlacementSpace[][]
  tile: number
  side: Side
  getAreaPosition: (differenceFromInitialOffset: XYCoord) => Coordinates
}

function DropShadow({cave, tile, side, getAreaPosition}: DropShadowProps) {
  const sourceClientOffset = useEfficientDragLayer(monitor => monitor.getSourceClientOffset())
  if (!sourceClientOffset) return null
  const coordinates = getAreaPosition(sourceClientOffset)
  const placedTile = {tile, side, ...coordinates}
  if (!canPlaceTile(cave, placedTile)) return null
  return <>{
    getPlacedTileCoordinates(placedTile).map(({x, y}) =>
      <div key={`${x}_${y}`} css={[squareCss, position({x, y}), strongHighlight]}/>
    )
  }</>
}

const style = css`
  position: absolute;
  width: 100%;
  height: 100%;
`

const squareCss = css`
  position: absolute;
  width: ${squareSize}%;
  height: ${squareSize}%;
`

const highlight = css`
  background-color: rgba(0, 128, 0, 0.3);
`

const strongHighlight = css`
  background-color: rgba(255, 255, 255, 0.5);
`

const position = ({x, y}: Coordinates) => css`
  left: ${x * squareSize}%;
  top: ${y * squareSize}%;
`