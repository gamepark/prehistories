/** @jsxImportSource @emotion/react */
import {css, keyframes} from "@emotion/react";
import {getColoredDeck} from "@gamepark/prehistories/material/Hunters";
import Move from "@gamepark/prehistories/moves/Move";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import SpendHunter, {isSpendHunter} from "@gamepark/prehistories/moves/SpendHunter";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import Hunting from "@gamepark/prehistories/types/Hunting";
import {menuButtonCss, useAnimations, useNumberOfPlayers, usePlay, useSound} from "@gamepark/react-client";
import {FC, useState} from "react";
import {useTranslation} from "react-i18next/";
import {ResetSelectedHunters, resetSelectedHuntersMove} from "../localMoves/setSelectedHunters";
import Button from "../utils/Button";
import {getPlayerColor} from "../utils/getterFunctions";
import {centerContent, setPercentDimension, toAbsolute} from "../utils/styles";
import ButtonClickSound from "../sounds/buttonClick.mp3"
import MoveCardSound from "../sounds/cardMove.mp3"
import {endTurnMove} from "@gamepark/prehistories/moves/EndTurn";
import getBoardZones from "@gamepark/prehistories/material/BoardZones";
import { Dialog } from "@gamepark/react-components";
import Tile from "@gamepark/prehistories/material/Tile";

type Props = {
    color:PlayerColor
    hunting?:Hunting
    isDisplayValidationButton:boolean
    isDisplayEndTurnButton:boolean
    selectedHunters?:number[]
    playedPower:number
    huntBoard:(Tile|null)[]
}

const ButtonsTab : FC<Props> = ({color, hunting, isDisplayValidationButton, isDisplayEndTurnButton, selectedHunters = [], playedPower, huntBoard}) => {

    const heightOfHuntingButtonsPanel:number = (isDisplayValidationButton || isDisplayEndTurnButton) ? 20 : 25
    const spendCardAnimations = useAnimations<SpendHunter>(animation => isSpendHunter(animation.move))
    const clickSound = useSound(ButtonClickSound)
    const numberOfPlayers = useNumberOfPlayers()
    const huntZone = hunting && hunting.hunt ? getBoardZones(numberOfPlayers)[hunting.hunt.zone] : undefined
    clickSound.volume = 0.8
    const moveCardSound = useSound(MoveCardSound)
    moveCardSound.volume = 0.8

    const powerOfSelectedHunters:number = hunting?.hunt ? selectedHunters.reduce((acc, cv) => acc + getColoredDeck(color)[cv].power, hunting.hunt.huntersValue) : 0

    const play = usePlay<Move>()
    const playResetHunters = usePlay<ResetSelectedHunters>()
    const {t} = useTranslation()
    const [warningNoCardPlayedClosed, setWarningNoCardPlayedClosed] = useState(true)
    const [warningNoTilePickedClosed, setWarningNoTilePickedClosed] = useState(true)

    function validateHunters(hunters:number[]|undefined, injury:boolean){
        clickSound.play()
        if (hunters !== undefined){
            hunters.forEach(card => {
                play({type:MoveType.SpendHunter, card})
            })
            if (injury){
                play({type:MoveType.ValidateSpentHunters}, {delayed:true})
            }
            moveCardSound.play()
            playResetHunters(resetSelectedHuntersMove(), {local:true})
        }
    }

    function playValidateMove(){
        clickSound.play()
        play(endTurnMove(color))
    }

    const huntingButtonText:string = huntZone === undefined ? "" : powerOfSelectedHunters < huntZone.injury
        ? "button.not.enough.hunters"
        : powerOfSelectedHunters < huntZone!.safe
            ? "button.hunt.with.injury"
            : "button.hunt.safe"

    

    return(

        <div css={[toAbsolute,
            setPercentDimension(heightOfHuntingButtonsPanel,90),
            huntingButtonsPosition(color),
            panelAppearAnimation(heightOfHuntingButtonsPanel),
            spendCardAnimations.length !== 0 && disapperingAnim]}>

            {isDisplayValidationButton && <Button css={[toAbsolute, validationButtonPosition]}
                                                onClick={() => {playedPower === 0 ? setWarningNoCardPlayedClosed(false) : playValidateMove()}}
                                                colorButton={color} >{t('Validate')}</Button> }
            {isDisplayEndTurnButton && <Button css={[validationButtonPosition]} onClick={() => {huntBoard.some((tile, index) => tile !== null && getBoardZones(numberOfPlayers)[index].injury <= playedPower) && hunting?.tilesHunted === 0 ? setWarningNoTilePickedClosed(false) :  playValidateMove()}} colorButton={color} >{t('End your Turn')}</Button>}

            {huntZone && <Button css={[ toAbsolute,
                                        centerContent,
                                        validationButtonPosition,
                                        powerOfSelectedHunters < huntZone.injury && desactivateStyle
                                      ]}
                                 onClick={() => powerOfSelectedHunters >= huntZone.injury && validateHunters(selectedHunters, powerOfSelectedHunters < huntZone.safe)}
                                 colorButton={color}>

                                <span css={css`margin-right:0.2em`}>{t(huntingButtonText)}</span>
                                {powerOfSelectedHunters}/{powerOfSelectedHunters<huntZone.injury ? huntZone.injury : huntZone.safe}

                        </Button>
                
            }

            {warningNoCardPlayedClosed === false && 
                <Dialog open={!warningNoCardPlayedClosed} css={css`width:50%;`}> 
                    <h1 css={css`margin:0.2em;text-align:center;`}>{t("warning.no.hunter")}</h1>
                    <p css={css`text-align:center;`}>{t("warning.no.hunter.text")}</p>
                    <div css={buttonLineCss}>
                        <button css={[menuButtonCss]} onClick={() => playValidateMove()} >{t("warning.no.hunter.continue")}</button>
                        <button css={[menuButtonCss]} onClick={() => setWarningNoCardPlayedClosed(true)} >{t("Cancel")}</button>
                    </div>
                </Dialog>
            }

            {warningNoTilePickedClosed === false && 
                <Dialog open={!warningNoTilePickedClosed} css={css`width:50%;`}> 
                    <h1 css={css`margin:0.2em;text-align:center;`}>{t("warning.no.tile")}</h1>
                    <p css={css`text-align:center;`}>{t("warning.no.tile.text")}</p>
                    <div css={buttonLineCss}>
                        <button css={[menuButtonCss]} onClick={() => playValidateMove()} >{t("warning.no.tile.continue")}</button>
                        <button css={[menuButtonCss]} onClick={() => setWarningNoTilePickedClosed(true)} >{t("Cancel")}</button>
                    </div>
                </Dialog>
            }

        </div>

    )

}

const buttonLineCss = css`
  margin-top: 1em;
  display: flex;
  justify-content: space-evenly;
`

const desactivateStyle = css`
    filter: grayscale(80%);
    transition:filter 0.2s linear;
    cursor:not-allowed;
`

const panelAppear = (height:number) => keyframes`
    from{height:0%;}
    to{height:${height}%;}
`

const panelDisappear = keyframes`
    from{opacity:1;}
    to{opacity:0;}
`

const disapperingAnim = css`
    animation:${panelDisappear} 1s linear forwards;
`

const panelAppearAnimation = (height:number) => css`
    animation:${panelAppear(height)} 1s linear forwards;
`

const huntingButtonsPosition = (color:PlayerColor) => css`
    left:50%;
    bottom:101.5%;
    transform:translateX(-50%);
    z-index:0;
    border-top:0.6em solid ${getPlayerColor(color)};
    border-left:0.6em solid ${getPlayerColor(color)};
    border-right:0.6em solid ${getPlayerColor(color)};
    background-color:rgba(0,0,0,0.5);
    border-top-left-radius:2em;
    border-top-right-radius:2em;
`

const appearContentPanel = keyframes`
    from{opacity:0;}
    50%{opacity:0;}
    to{opacity:1;}
`

const validationButtonPosition = css`
    left:50%;
    top:10%;
    transform:translateX(-50%);
    width:fit-content;
    height:80%;
    font-size:2.9em;
    font-family:'Reggae One', sans-serif;
    z-index:1;
    animation:${appearContentPanel} 0.8s linear;
`

export default ButtonsTab