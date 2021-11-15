import { Painting } from "../material/PaintedCave";
import { shortestPathBinaryMatrix } from "../utils/shortestPath";

describe('PathFinding', () => {

    test('ShortestPath', () => {          // PathFinding between two totems
  
    // demo
    const X = Painting.Buffalo
    const _ = Painting.Empty
    let grid1 = [[X,X,X],
                [_,_,X],
                [_,_,X]];

    let grid2 = [[_,_,_,_,_,_,_],
                 [X,X,_,_,_,_,_],
                 [X,X,_,_,_,_,_],
                 [_,X,X,X,X,_,_],
                 [_,_,_,X,X,_,_],
                 [_,_,_,_,X,_,_],
                 [_,_,_,_,_,_,_]];

      expect(shortestPathBinaryMatrix(grid1,{x:0,y:0},{x:2,y:2})).toEqual(expect.arrayContaining([{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:2,y:1},{x:2,y:2}]))
      expect(shortestPathBinaryMatrix(grid1,{x:0,y:0},{x:2,y:2}).length).toBe([{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:2,y:1},{x:2,y:2}].length)
      expect(shortestPathBinaryMatrix(grid2,{x:1,y:1},{x:4,y:5})).toEqual(expect.arrayContaining([{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3},{x:4,y:4},{x:4,y:5}]))
      expect(shortestPathBinaryMatrix(grid2,{x:1,y:1},{x:4,y:5}).length).toBe([{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3},{x:4,y:4},{x:4,y:5}].length)
  
 
 
    })
})