/** @jsxImportSource @emotion/react */
import PolyominoToHunt from "@gamepark/prehistories/types/appTypes/PolyominoToHunt"
import Coordinates from "@gamepark/prehistories/types/Coordinates"
import getSquaresStartLeft, {
  getFreeSquaresFromPath,
  getOccupiedSquares,
  isCoordFree,
  isCoordOutOfBorders
} from "@gamepark/prehistories/utils/getSquaresStartLeft"
import {HTMLAttributes, useCallback, useRef} from "react"
import {DropTargetMonitor, useDrop, XYCoord} from "react-dnd"
import {PlayerHuntView, PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView";
import {allPolyominos} from "@gamepark/prehistories/material/Polyominos"
import {css} from "@emotion/react"
import useEfficientDragLayer from '@gamepark/react-components/dist/Draggable/useEfficientDragLayer'
import {useSound} from "@gamepark/react-client"
import MoveTileSound from "../sounds/moveTile.mp3"
import {placeTileMove} from "@gamepark/prehistories/moves/PlaceTile";


type Props = {
    player:PlayerView|PlayerViewSelf|PlayerHuntView
  } & HTMLAttributes<HTMLDivElement>
  
  export default function PolyominoDropArea({player, ...props}: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const moveTileSound = useSound(MoveTileSound)
    moveTileSound.volume = 0.5
  
    const getAreaPosition = useCallback((sourceClientOffset: XYCoord) => {
      const dropArea = ref.current!.getBoundingClientRect()
      const y = Math.round(((sourceClientOffset.x - dropArea.x) * 7 )/ dropArea.width)
      const x = Math.round(((sourceClientOffset.y - dropArea.y) * 7) / dropArea.height)
      return {x, y}
    },[])
  
    const [{draggedPolyo, over}, dropRef] = useDrop({
      accept: "PolyominoToHunt",
      canDrop: (item: PolyominoToHunt, monitor) => { 
        const sourceClientOffset = monitor.getSourceClientOffset()
        if (!sourceClientOffset) return false
        const position = getAreaPosition(sourceClientOffset)
        const accessibleSquares:Coordinates[] = getFreeSquaresFromPath(getSquaresStartLeft(player.cave),player.cave)
        return allPolyominos[item.polyomino][item.side].coordinates.some(itemCoord => accessibleSquares.find(square => square.x === position.x + itemCoord.x && square.y === position.y + itemCoord.y) !== undefined) 
        && getCoveredCoordinates(item, position).every(coord => !isCoordOutOfBorders({x:coord.x,y:coord.y}) && isCoordFree({x:coord.x,y:coord.y}, getOccupiedSquares(player.cave)))
      },
      drop: (item: PolyominoToHunt, monitor) => {
        moveTileSound.play()
        const position = getAreaPosition(monitor.getSourceClientOffset()!)
        return placeTileMove(item.huntSpot, item.side, position)
      },
      collect: (monitor: DropTargetMonitor<PolyominoToHunt>) => {
        return ({
          draggedPolyo: monitor.getItemType() === "PolyominoToHunt" ? {type:monitor.getItem().type, polyomino:monitor.getItem().polyomino, side:monitor.getItem().side, huntSpot:monitor.getItem().huntSpot } : undefined,
          over: monitor.isOver()
        })
      }
    })
  
    dropRef(ref)
  
    return (
      <div ref={ref} css={style} {...props}>
        { draggedPolyo && <ValidDropAreaHighlight player={player}/>}
        { draggedPolyo && over && <DropShadow player={player} item={draggedPolyo} getAreaPosition={getAreaPosition}/> }
      </div>
    )
  }
  
  type ValidDropAreaHighlightProps = {
    player:PlayerView|PlayerViewSelf|PlayerHuntView
  }
  
  function ValidDropAreaHighlight({player}: ValidDropAreaHighlightProps) {
    return <>
      {getFreeSquaresFromPath(getSquaresStartLeft(player.cave),player.cave).map((square, index) =>

         <div key={index} css={[squareCss(squareSize), position(square, squareSize), highlight]}/>
        
      )}
    </>
  }

  const squareSize = 14.2857
  
   type DropShadowProps = {
     player:PlayerView|PlayerViewSelf|PlayerHuntView
     item:PolyominoToHunt
     getAreaPosition: (differenceFromInitialOffset: XYCoord) => Coordinates
   }
  
   function DropShadow({player, item, getAreaPosition}: DropShadowProps) {
    const accessibleSquares:Coordinates[] = getFreeSquaresFromPath(getSquaresStartLeft(player.cave),player.cave)
     const sourceClientOffset = useEfficientDragLayer(monitor => monitor.getSourceClientOffset())
     if (!sourceClientOffset) return null
     const coordinates = getAreaPosition(sourceClientOffset)

     if (!(allPolyominos[item.polyomino][item.side].coordinates.some(itemCoord => accessibleSquares.find(square => square.x === coordinates.x + itemCoord.x && square.y === coordinates.y + itemCoord.y) !== undefined))
     || getCoveredCoordinates(item, coordinates).some(coord => isCoordOutOfBorders({x:coord.x,y:coord.y}) || !isCoordFree({x:coord.x,y:coord.y}, getOccupiedSquares(player.cave)))) return null
     return <>{getCoveredCoordinates(item, coordinates).map(({x, y}) => <div key={`${x}_${y}`} css={[squareCss(squareSize), position({x, y}, squareSize), strongHighlight]}/>)}</>
   }

  function getCoveredCoordinates(item:PolyominoToHunt, coordinates:Coordinates):Coordinates[]{
    const result = []
    for(const coord of allPolyominos[item.polyomino][item.side].coordinates){
      result.push({x:coord.x+coordinates.x, y:coord.y+coordinates.y})
    }
    return result
  }
  
  const style = css`
    position: absolute;
    width: 100%;
    height: 100%;
  `
  
  const squareCss = (square: number) => css`
    position: absolute;
    width: ${square}%;
    height: ${square}%;
  `
  
  const highlight = css`
    background-color: rgba(0, 128, 0, 0.3);
  `
  
  const strongHighlight = css`
    background-color: rgba(255, 255, 255, 0.5);
  `
  
  const position = ({x, y}: Coordinates, square: number) => css`
    top: ${x * square}%;
    left: ${y * square}%;
  `