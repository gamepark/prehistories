import { Painting } from "../material/PaintedCave";
import Coordinates from "../types/Coordinates";

export function shortestPathBinaryMatrix(grid:Painting[][], start:Coordinates, finish:Coordinates):Coordinates[] {
    if(grid[start.y][start.x] === Painting.Empty) return []; // modify return type
    const queue:{coordinates:Coordinates|null, distance:number}[] = [{coordinates:start, distance:1}];             // Start
    const visited:{nextCoord:Coordinates, previousCoord:Coordinates|null}[] = [];
    visited.push({nextCoord:start, previousCoord:null}); // Mark source as visited
  
    const getNextSteps = ({x,y}:Coordinates) => {
        const dirs:Coordinates[] = [{x:1, y:0}, {x:-1, y:0}, {x:0,y:1}, {x:0,y:-1}];
        const nextSteps:Coordinates[] = [];
        for(const {x:nx, y:ny} of dirs) {
            if(x+nx >= 0 && x+nx <=6 && y+ny >= 0 && y+ny <=6 && grid[y + ny][x + nx] !== Painting.Empty){
              nextSteps.push({x:x + nx, y:y + ny});
            } 
        }
        return nextSteps;
    }
    
    for (let currentPainting of queue) {
        // Move the visited check to the loop
        if (currentPainting.coordinates!.x === finish.x && currentPainting.coordinates!.y === finish.y && grid[finish.y][finish.x] !== Painting.Empty) {
            // Derive the path from the linked list we now have in the visited structure:
            let path = [];
            while (currentPainting.coordinates) {
                path.push(currentPainting.coordinates);
                currentPainting.coordinates = visited.find(node => node.nextCoord.x === currentPainting.coordinates!.x && node.nextCoord.y === currentPainting.coordinates!.y)!.previousCoord;
            }
            return path.reverse(); // Need to reverse to get from source to destination
        }
        for (let adjacent of getNextSteps(currentPainting.coordinates!)) {
            // Visited-check moved here:
            if (visited.some(node => node.previousCoord?.x === adjacent.x && node.previousCoord?.y === adjacent.y)){
                 continue
                }; 
            // Mark with the coordinates of the previous node on the path:
            visited.push({nextCoord:adjacent, previousCoord:currentPainting.coordinates});
            queue.push({coordinates:adjacent,distance:currentPainting.distance});
        }
    }
    
    return []; // must modify this as well
  };
