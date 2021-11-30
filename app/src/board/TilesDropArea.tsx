/** @jsxImportSource @emotion/react */
import Coordinates from "@gamepark/prehistories/types/Coordinates"
import {HTMLAttributes, useCallback, useMemo, useRef} from "react"
import {DropTargetMonitor, useDrop, XYCoord} from "react-dnd"
import {PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView";
import {css, keyframes} from "@emotion/react"
import useEfficientDragLayer from '@gamepark/react-components/dist/Draggable/useEfficientDragLayer'
import {useSound} from "@gamepark/react-client"
import MoveTileSound from "../sounds/moveTile.mp3"
import {placeTileMove} from "@gamepark/prehistories/moves/PlaceTile";
import {canPlaceTile, getCavePlacementSpaces, PlacementSpace} from "@gamepark/prehistories/utils/PlacementRules";
import {getPolyomino, Side} from "@gamepark/prehistories/material/Tile";
import {getPlacedTileCoordinates} from "@gamepark/prehistories/types/PlacedTile";
import {caveBorder, centerContent, squareSize, toFullSize} from "../utils/styles";
import {DraggedTile, HuntTile} from "./DraggableTile";
import {cavesSize} from "@gamepark/prehistories/material/Caves";
import { useTranslation } from "react-i18next";


type Props = {
  player: PlayerView | PlayerViewSelf
  isTutorialPhase1:boolean
  isTutorialPhase2:boolean
  isTutorialPhase3:boolean
} & HTMLAttributes<HTMLDivElement>

export default function TilesDropArea({player, isTutorialPhase1, isTutorialPhase2, isTutorialPhase3, ...props}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const moveTileSound = useSound(MoveTileSound)
  moveTileSound.volume = 0.8

  const getAreaPosition = useCallback((sourceClientOffset: XYCoord, item: DraggedTile) => {
    const dropArea = ref.current!.getBoundingClientRect()
    const rotationAdjustment = item.side === 1 && getPolyomino(item.tile, 0).length !== getPolyomino(item.tile, 1).length ? 0.5 : 0
    const x = Math.round((sourceClientOffset.x - dropArea.x) * cavesSize / dropArea.width + rotationAdjustment)
    const y = Math.round((sourceClientOffset.y - dropArea.y) * cavesSize / dropArea.height - rotationAdjustment)
    return {x, y}
  }, [])

  const cave = useMemo(() => getCavePlacementSpaces(player), [player])
  const {t} = useTranslation()

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
      return placeTileMove(item.huntZone, item.side, position)
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
      {isTutorialPhase1 && draggedTile && draggedTile.tile !== 19 && <div css={[toFullSize, centerContent, wrongWayStyle]}> {t("wrong.tile")} </div>}
      {isTutorialPhase2 && draggedTile && (draggedTile.tile !== 8 || draggedTile.side !== 1) && <div css={[toFullSize, centerContent, wrongWayStyle]}> {t( draggedTile.tile !== 8 ? "wrong.tile" : "wrong.orientation")} </div>}
      {draggedTile && ((isTutorialPhase2 === false && isTutorialPhase1 === false) || (isTutorialPhase1 && draggedTile.tile === 19) || (isTutorialPhase2 && draggedTile.tile === 8 && draggedTile.side === 1)) && <ValidDropAreaHighlight cave={cave} item={draggedTile} isTutorialPhase1={isTutorialPhase1 && draggedTile && draggedTile.tile === 19} isTutorialPhase2={isTutorialPhase2 && draggedTile && (draggedTile.tile === 8 && draggedTile.side === 1)} isTutorialPhase3={isTutorialPhase3 && draggedTile && (draggedTile.tile === 33)} />}
      {draggedTile && over && ((isTutorialPhase2 === false && isTutorialPhase1 === false) || (isTutorialPhase1 && draggedTile.tile === 19) || (isTutorialPhase2 && draggedTile.tile === 8 && draggedTile.side === 1)) &&<DropShadow cave={cave} item={draggedTile} getAreaPosition={getAreaPosition}/>}
    </div>
  )
}

const wrongWayStyle = css`
  background-color:rgba(222,0,0,1);
  z-index:20;
  font-size:4em;
  font-family:'Reggae One', sans-serif;
  text-align:center;
`

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
  isTutorialPhase1:boolean
  isTutorialPhase2:boolean
  isTutorialPhase3:boolean
}

function ValidDropAreaHighlight({cave, item, isTutorialPhase1, isTutorialPhase2, isTutorialPhase3}: ValidDropAreaHighlightProps) {
  const area = useMemo(() => getValidDropArea(cave, item.tile, item.side), [cave, item])
  return <>{
    area.map((row, y) =>
      row.map((space, x) => space && <div key={`${x}_${y}`} css={[squareCss, squarePosition(x, y), highlight, isTutorialPhase1 && item.tile === 19 && x === 0 && y === 5 && highlightTutorial, isTutorialPhase2 && ((x === 2 && y === 4) || (x === 2 && y === 5)) && highlightTutorial, isTutorialPhase3 && ((x===3 && y===2)||(x===3 && y===3)||(x===4 && y===2)||(x===4 && y===3)) && highlightTutorial]}/>)
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

const highlightTutorial = css`
  background-color: rgba(0, 255, 0, 0.8)
`

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
  z-index:11;
`

export const squarePosition = (x: number, y: number) => css`
  left: ${x * squareSize}em;
  top: ${y * squareSize}em;
`