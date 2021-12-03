/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { Player } from "@gamepark/react-client";
import { Picture } from "@gamepark/react-components";
import Avatar from "awesome-react-avataaars";
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
                ? <Avatar style={{width:'100%', height:'100%'}} avatarStyle="Circle" {...playerInfo.avatar}/> 
                : <Picture alt={t('Player avatar')} src={getTotem(color)} css={[toFullSize, roundBorders]} draggable={false}/>
            }
        </div>

    )

}

const avatarStyle = css`
    float:left;
    margin:1em 1em;
    height:6em;
    width:6em;
`

const roundBorders = css`
    border-radius:100%;
`

export default AvatarPanel