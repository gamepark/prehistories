/**
 * @return an array of two numbers : first is the smallest limit to hunt, second is the power to hunt without a injury
 */
function powerLevels(nbPlayers:number, spot:number):number[]{
    switch (spot){
        case 0:
            return nbPlayers < 4 ? [1,4] : [2,3]
        case 1:
            return nbPlayers < 4 ? [4,7] : [1,4]
        case 2:
            return nbPlayers < 4 ? [7,10] : [4,7]
        case 3:
            return nbPlayers < 4 ? [10,13] : [5,8]
        case 4:
            return nbPlayers < 4 ? [13,15] : [7,10]
        case 5:
            return nbPlayers < 4 ? [] : [10,13]
        case 6:
            return nbPlayers < 4 ? [] : [13,16]
        default: return []
    }
}

export default powerLevels