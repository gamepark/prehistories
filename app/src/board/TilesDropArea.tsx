/** @jsxImportSource @emotion/react */
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
import {getPolyomino, Side} from "@gamepark/prehistories/material/Tile";
import {getPlacedTileCoordinates} from "@gamepark/prehistories/types/PlacedTile";
import {caveBorder, squareSize} from "../utils/styles";
import {DraggedTile, HuntTile} from "./DraggableTile";
import {cavesSize} from "@gamepark/prehistories/material/Caves";


type Props = {
  player: PlayerView | PlayerViewSelf | PlayerHuntView
} & HTMLAttributes<HTMLDivElement>

export default function TilesDropArea({player, ...props}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const moveTileSound = useSound(MoveTileSound)
  moveTileSound.volume = 0.5

  const getAreaPosition = useCallback((sourceClientOffset: XYCoord, item: DraggedTile) => {
    const dropArea = ref.current!.getBoundingClientRect()
    const rotationAdjustment = item.side === 1 && getPolyomino(item.tile, 0).length !== getPolyomino(item.tile, 1).length ? 0.5 : 0
    const x = Math.round((sourceClientOffset.x - dropArea.x) * cavesSize / dropArea.width + rotationAdjustment)
    const y = Math.round((sourceClientOffset.y - dropArea.y) * cavesSize / dropArea.height - rotationAdjustment)
    return {x, y}
  }, [])

  const cave = useMemo(() => getCavePlacementSpaces(player), [player])

  const [{draggedTile, over}, dropRef] = useDrop({
    accept: HuntTile,
    canDrop: (item: DraggedTile, monitor) => {
      const sourceClientOffset = monitor.getSourceClientOffset()
      if (!sourceClientOffset) return false
      return canPlaceTile(cave, {tile: item.tile, side: item.side, ...getAreaPosition(sourceClientOffset, item)})
    },
    drop: (item: DraggedTile, monitor) => {
      moveTileSound.play()
      const position = getAreaPosition(monitor.getSourceClientOffset()!, item)
      return placeTileMove(item.huntSpot, item.side, position)
    },
    collect: (monitor: DropTargetMonitor<DraggedTile>) => {
      return ({
        draggedTile: monitor.getItemType() === HuntTile ? monitor.getItem() : undefined,
        over: monitor.isOver()
      })
    }
  })

  dropRef(ref)

  return (
    <div ref={ref} css={style} {...props}>
      {draggedTile && <ValidDropAreaHighlight cave={cave} item={draggedTile}/>}
      {draggedTile && over && <DropShadow cave={cave} item={draggedTile} getAreaPosition={getAreaPosition}/>}
    </div>
  )
}

const style = css`
  position: absolute;
  left: ${caveBorder}em;
  top: ${caveBorder}em;
  width: ${squareSize * cavesSize}em;
  height: ${squareSize * cavesSize}em;
`

type ValidDropAreaHighlightProps = {
  cave: PlacementSpace[][]
  item: DraggedTile
}

function ValidDropAreaHighlight({cave, item}: ValidDropAreaHighlightProps) {
  const area = useMemo(() => getValidDropArea(cave, item.tile, item.side), [cave, item])
  return <>{
    area.map((row, y) =>
      row.map((space, x) => space && <div key={`${x}_${y}`} css={[squareCss, squarePosition(x, y), highlight]}/>)
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

type DropShadowProps = {
  cave: PlacementSpace[][]
  item: DraggedTile
  getAreaPosition: (differenceFromInitialOffset: XYCoord, item: DraggedTile) => Coordinates
}

function DropShadow({cave, item, getAreaPosition}: DropShadowProps) {
  const sourceClientOffset = useEfficientDragLayer(monitor => monitor.getSourceClientOffset())
  if (!sourceClientOffset) return null
  const coordinates = getAreaPosition(sourceClientOffset, item)
  const placedTile = {...item, ...coordinates}
  if (!canPlaceTile(cave, placedTile)) return null

  return <>{
    getPlacedTileCoordinates(placedTile).map(({x, y}) =>
      <div key={`${x}_${y}`} css={[squareCss, squarePosition(x, y), strongHighlight]}/>
    )
  }</>

}

const highlight = css`
  background-color: rgba(0, 128, 0, 0.3);
`

const strongHighlight = css`
  background-color: rgba(255, 255, 255, 0.5);
`

const squareCss = css`
  position: absolute;
  width: ${squareSize}em;
  height: ${squareSize}em;
`

export const squarePosition = (x: number, y: number) => css`
  left: ${x * squareSize}em;
  top: ${y * squareSize}em;
`