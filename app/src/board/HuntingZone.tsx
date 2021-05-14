/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import GameView from "@gamepark/prehistories/GameView";
import { FC } from "react";
import Images from "../utils/Images";

type Props = {
    game:GameView
    numberOfPlayers:number
}

const HuntingZone : FC<Props> = ({game, numberOfPlayers}) => {

    return(

        <div css={[huntingZonePosition, huntingZoneStyle, numberOfPlayers < 4 ? bG23Players : bG45Players]}>

        </div>

    )

}

const huntingZonePosition = css`
    position:absolute;
    top:7%;
    left:0;
    width:24%;
    height:93%;
`

const huntingZoneStyle = css`
    background-color:green;
`

const bG23Players = css`
background-image: url(${Images.huntingBoard23Players});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
`

const bG45Players = css`
background-image: url(${Images.huntingBoard45Players});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
`

export default HuntingZone