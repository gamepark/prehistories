/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { Avatar, Player, SpeechBubbleDirection } from "@gamepark/react-client";
import { Picture } from "@gamepark/react-components";
import { FC, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { toFullSize } from "../utils/styles";
import { getTotem } from "./PlayerPanel";

type Props = {
    playerInfo : Player<PlayerColor> | undefined
    color:PlayerColor
} & Omit<HTMLAttributes<HTMLDivElement>, 'color'>

const AvatarPanel : FC<Props> = ({playerInfo, color, ...props}) => {

    const {t} = useTranslation()

    return(

        <div {...props} css={[avatarStyle, roundBorders]}>
            {playerInfo?.avatar
                ? <Avatar playerId={color} css={[toFullSize, roundBorders]} speechBubbleProps={{direction: SpeechBubbleDirection.TOP_LEFT}} /> 
                : <Picture alt={t('Player avatar')} src={getTotem(color)} css={[toFullSize, roundBorders]} draggable={false}/>
            }
        </div>

    )

}

const avatarStyle = css`
    position:relative;
    float:left;
    margin:1em 1em;
    height:6em;
    width:6em;
`

const roundBorders = css`
    border-radius:100%;
    color:black;
`

export default AvatarPanel