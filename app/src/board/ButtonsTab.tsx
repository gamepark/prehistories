/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { getColoredDeck } from "@gamepark/prehistories/material/Hunters";
import Move from "@gamepark/prehistories/moves/Move";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import SpendHunter, { isSpendHunter } from "@gamepark/prehistories/moves/SpendHunter";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import Hunting from "@gamepark/prehistories/types/Hunting";
import { useAnimations, usePlay, useSound } from "@gamepark/react-client";
import { FC } from "react";
import { useTranslation } from "react-i18next/";
import { ResetSelectedHunters, resetSelectedHuntersMove } from "../localMoves/setSelectedHunters";
import Button from "../utils/Button";
import { getPlayerColor } from "../utils/getterFunctions";
import Images from "../utils/Images";
import { centerContent, placingBackground, setPercentDimension, toAbsolute } from "../utils/styles";
import ButtonClickSound from "../sounds/buttonClick.mp3"
import MoveCardSound from "../sounds/cardMove.mp3"

type Props = {
    color:PlayerColor
    hunting?:Hunting
    isDisplayHuntingButtons:boolean
    isDisplayValidationButton:boolean
    isDisplayEndTurnButton:boolean
    selectedHunters:number[]|undefined
}

const ButtonsTab : FC<Props> = ({color, hunting, isDisplayHuntingButtons, isDisplayValidationButton, isDisplayEndTurnButton, selectedHunters,  ...props}) => {

    const heightOfHuntingButtonsPanel:number = (isDisplayValidationButton || isDisplayEndTurnButton) ? 20 : 30
    const spendCardAnimations = useAnimations<SpendHunter>(animation => isSpendHunter(animation.move))
    const clickSound = useSound(ButtonClickSound)
    clickSound.volume = 0.5
    const moveCardSound = useSound(MoveCardSound)
    moveCardSound.volume = 0.5

    const powerOfSelectedHunters:number = selectedHunters !== undefined ? selectedHunters.reduce((acc, cv) => acc + getColoredDeck(color)[cv].power,0) : 0

    const play = usePlay<Move>()
    const playResetHunters = usePlay<ResetSelectedHunters>()
    const {t} = useTranslation()

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

    return(

        <div css={[toAbsolute,
            setPercentDimension(heightOfHuntingButtonsPanel,80),
            huntingButtonsPosition(color),
            panelAppearAnimation(heightOfHuntingButtonsPanel), 
            spendCardAnimations.length !== 0 && disapperingAnim]}>
     
            {isDisplayValidationButton && <Button css={[toAbsolute, validationButtonPosition]} 
                                                onClick={() => {clickSound.play() ; play({type:MoveType.TellYouAreReady, playerId:color})}} 
                                                colorButton={color} >{t('Validate')}</Button> }
            {isDisplayEndTurnButton && <Button css={[validationButtonPosition]} onClick={() => {clickSound.play() ; play({type:MoveType.EndTurn})}} colorButton={color} >{t('End your Turn')}</Button>}

            {isDisplayHuntingButtons && <div css={[toAbsolute,
                                                    placingBackground(Images.arrowBrokenIcon,"cover"),
                                                    setPercentDimension(95,35),
                                                    injuryButtonStyle("left"),
                                                    centerContent,
                                                    (powerOfSelectedHunters < hunting!.huntSpotTakenLevels![0] || powerOfSelectedHunters >= hunting!.huntSpotTakenLevels![1]) && desactivateStyle
                                                ]}
                                            onClick={() => powerOfSelectedHunters >= hunting!.huntSpotTakenLevels![0] && powerOfSelectedHunters < hunting!.huntSpotTakenLevels![1] && validateHunters(selectedHunters, true)}>
                <span>{Math.max(hunting!.huntSpotTakenLevels![0] - powerOfSelectedHunters,0)}</span>
            </div>}

            {isDisplayHuntingButtons && <div css={[toAbsolute,
                                                    placingBackground(Images.arrowCleanIcon,"cover"), 
                                                    setPercentDimension(95,35),
                                                    injuryButtonStyle("right"),
                                                    centerContent,
                                                    powerOfSelectedHunters < hunting!.huntSpotTakenLevels![1] && desactivateStyle
                                                ]}
                                            onClick={() => powerOfSelectedHunters >= hunting!.huntSpotTakenLevels![1] && validateHunters(selectedHunters, false)}>
                <span>{Math.max(hunting!.huntSpotTakenLevels![1] - powerOfSelectedHunters,0)}</span>
            </div>}
     
        </div>

    )
    
}

const desactivateStyle = css`
    filter: grayscale(80%);
    transition:filter 0.2s linear;
    cursor:not-allowed;
    &:active{
        box-shadow:0 0.2em 0.5em black;
        top:2.5%;
    }
`

const injuryButtonStyle = (positionFromSide:string) => css`
    cursor:pointer;
    top:2.5%;
    ${positionFromSide === "left" ? `left:10%;` : `right:10%;`};
    border:0.5em solid orange;
    border-radius:15%;
    box-shadow:0 0.2em 0.5em black;
    transition:filter 0.2s linear;
    &:active{
        box-shadow:0 0.2em 0.2em black;
        top:4%;
    }
    span{
        font-size:6em;
        font-family:'Reggae One', sans-serif;
        color:black;
    }
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
    z-index:1;
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
    font-size:3em;
    font-family:'Reggae One', sans-serif;
    z-index:1;
    animation:${appearContentPanel} 0.8s linear;
`

export default ButtonsTab