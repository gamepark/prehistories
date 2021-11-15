import { Painting } from "../material/PaintedCave";
import { shortestPathBinaryMatrix } from "../utils/shortestPath";

describe('PathFinding', () => {

    test('ShortestPath', () => {          // PathFinding between two totems
  
    // demo
    const X = Painting.Buffalo
    const _ = Painting.Empty
    let grid = [[X,X,X],
                [_,_,X],
                [_,_,X]];

      expect(shortestPathBinaryMatrix(grid)).toEqual(expect.arrayContaining([{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:2,y:1},{x:2,y:2}]))
      expect(shortestPathBinaryMatrix(grid).length).toBe([{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:2,y:1},{x:2,y:2}].length)
    })
})