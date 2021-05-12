/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import GameView from "@gamepark/prehistories/GameView";
import { FC } from "react";

type Props = {
    game:GameView
}

const HuntingZone : FC<Props> = ({game}) => {

    return(

        <div css={[HuntingZonePosition, HuntingZoneStyle]}>
            Message De Paix : {game.goals[0]}
        </div>

    )

}

const HuntingZonePosition = css`
    position:absolute;
    top:7%;
    left:0;
    width:25%;
    height:93%;
`

const HuntingZoneStyle = css`
    background-color:green;
    border: 0.2em solid black;
`

export default HuntingZone