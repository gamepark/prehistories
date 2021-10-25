/** @jsxImportSource @emotion/react */

import GameView from "@gamepark/prehistories/GameView"
import PlayerColor from "@gamepark/prehistories/PlayerColor"
import { usePlayer, usePlayerId } from "@gamepark/react-client"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next/"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import { getPlayerName } from "@gamepark/prehistories/PrehistoriesOptions"
import Button from "./Button"
import { css } from "@emotion/react"
import { getBG } from "../board/PlayerPanel"
import Goal from "../board/Goal"
import {getAllGoalsArray} from "@gamepark/prehistories/material/Goals"

const WelcomePopUp : FC<{player:PlayerColor | undefined, game:GameView, close: () => void}> = ({player, game, close}) => {

    const {t} = useTranslation()
    const playerInfo = usePlayer(player ?? undefined) 
    const playerId = usePlayerId<PlayerColor>()
    const isSpec = playerId === undefined

    const [goalSelected, setGoalSelected] = useState(-1)

    return(

        <div css={[popupOverlayStyle, showPopupOverlayStyle, style]} onClick={close}>

            <div css={[popupStyle(player ?? PlayerColor.White), popupPosition]} onClick={event => event.stopPropagation()}>

                <div css = {closePopupStyle} onClick={close}> <FontAwesomeIcon icon={faTimes} /> </div>
                <h2>{t("Welcome, {playerName}",{playerName: !isSpec 
                  ? playerInfo?.name !== undefined 
                    ? playerInfo?.name 
                    : getPlayerName(player!,t)
                  : t("dear spectator")})}</h2>

                <p>{isSpec ? t("welcome.spec.objectives") : t("welcome.player.objectives")}</p>

                <div css={goalsPosition}>
                    {game.goals.map((goal, index) => 
                        <Goal key={index}
                              goal={goal}
                              players={game.players}
                              css={[goalSize, goalSelected === goal && selectEffect(goal > 8)]}
                              onClick={() => setGoalSelected(goal)}
                        />
                    )}
                </div>

                <p> {goalSelected === -1 ? t("goal.default.text") : t(getAllGoalsArray()[goalSelected].text) } </p>

                <Button css={buttonPosition} colorButton={player ?? PlayerColor.White} onClick={close}>{t("Let's Hunt !")}</Button>

            </div>

        </div>

    )

}

const selectEffect = (isExpert:boolean) => css`
box-shadow:0 0 0.5em 1em ${isExpert ? `#1991d3` : `#f7ab01` };
transition:box-shadow 0.5s linear;
`

const goalSize = css`
width:19.5%;
height:100%;
cursor:pointer;
transition:box-shadow 0.5s linear;
`

const goalsPosition = css`
position:relative;
width:100%;
height:50%;
display:flex;
flex-direction:row;
justify-content:space-evenly;
`

const buttonPosition = css`
position:absolute;
bottom:5%;
left:50%;
transform:translateX(-50%);
`

const popupOverlayStyle = css`
  position: absolute;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  transform: translateZ(30em);
  z-index: 99;
  transition: all .5s ease;
`
const showPopupOverlayStyle = css`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`

const popupStyle = (player:PlayerColor) => css`
  position: absolute;
  text-align: center;
  height: 80%;
  width:80%;
  z-index : 102;
  border-radius: 1em;
  box-sizing: border-box;
  align-self: center;
  padding: 2%;
  margin: 0 2%;
  outline: none;
  box-shadow: 1em 2em 2.5em -1.5em hsla(0, 0%, 0%, 0.2);
  border:1em black solid;
  background: center/cover url(${getBG(player)}) no-repeat;
  background-color: black;
  border-radius: 40em 3em 40em 3em/3em 40em 3em 40em;

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%; 
    border-radius: 40em 1.5em 40em 1.5em/1.5em 40em 1.5em 40em;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  &:hover{
      box-shadow: 2em 4em 5em -3em hsla(0,0%,0%,.5);
    }
  & > h2 {
    position:relative;
    font-size: 5em;
    margin:0;
  }
  & > p {
    position:relative;
    text-align: center;
    font-size: 3em;
    margin:0.5em auto;
    width:80%;

  }
  & > button {
    font-size: 3.5em;
  }
`

const popupPosition = css`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(30em);
`

const style = css`
  background-color: transparent;
`

const closePopupStyle = css`
  position: relative;
  float: right;
  text-align: center;
  margin-top: -2%;
  margin-right: -0%;
  font-size: 4em;
  &:hover{
    cursor: pointer;
    color: black;
  }
`

export default WelcomePopUp