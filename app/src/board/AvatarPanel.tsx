/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { Player } from "@gamepark/react-client";
import Avatar from "awesome-react-avataaars";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import Images from "../utils/Images";
import { getTotem } from "./PlayerPanel";

type Props = {
    playerInfo : Player<PlayerColor> | undefined
    color:PlayerColor
}

const AvatarPanel : FC<Props> = ({playerInfo, color}) => {

    const {t} = useTranslation()

    return(

        <div css={avatarStyle}>
            {playerInfo?.avatar 
                ? <Avatar style={{width:'100%', height:'100%'}} avatarStyle="Circle" {...playerInfo.avatar}/> 
                : <img alt={t('Player avatar')} src={getTotem(color)} css={alternativeAvatarStyle} draggable={false}/>
            }
        </div>

    )

}

const avatarStyle = css`
border-radius:100%;
float:left;
margin:1em 1em;
height:8em;
width:8em;
`

const alternativeAvatarStyle = css`
width:100%;
height:100%;
border-radius:100%;
`

export default AvatarPanel