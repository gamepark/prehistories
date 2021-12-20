/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Failure, Tutorial, useActions, useAnimation, useFailures, usePlay, usePlayerId} from "@gamepark/react-client";
import {Picture} from '@gamepark/react-components'
import {TFunction} from "i18next";
import {FC, useEffect, useRef, useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import Arrow from "../images/tutorial-arrow-black.png"
import Button from "../utils/Button";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import GameView from "@gamepark/prehistories/GameView";
import Move from "@gamepark/prehistories/moves/Move";
import {getHuntingPlayer} from "@gamepark/prehistories/types/HuntingPlayer";
import {isWinner} from "@gamepark/prehistories/Prehistories";
import {useClickAway} from "react-use";
import SetCaveDisplayed, { setCaveDisplayedMove } from "../localMoves/setCaveDisplayed";
import Images from "../utils/Images";


const TutorialPopup: FC<{ game: GameView, tutorial: Tutorial }> = ({game, tutorial}) => {

    const {t} = useTranslation()
    const playerId = usePlayerId<PlayerColor>()
    const actions = useActions<Move, PlayerColor>()
    const actionsNumber = actions !== undefined ? actions.filter(action => action.playerId === playerId).length : 0
    const previousActionNumber = useRef(actionsNumber)
    const [tutorialIndex, setTutorialIndex] = useState(0)
    const [tutorialDisplay, setTutorialDisplay] = useState(tutorialDescription.length > actionsNumber)
    const [failures] = useFailures()
    const [hideEndInfo, setHideEndInfo] = useState(false)
    const winner = game.players.find(isWinner)

    const platformUri = process.env.REACT_APP_PLATFORM_URI ?? 'https://game-park.com'
    const discordUri = 'https://discord.gg/nMSDRag'

    const animation = useAnimation<Move>()
    const playSetCaveDisplayed = usePlay<SetCaveDisplayed>()

    const ref = useRef(null)
    useClickAway(ref, () => setTutorialDisplay(false))

    const moveTutorial = (deltaMessage: number) => {
        if (tutorialDescription[actionsNumber][tutorialIndex + deltaMessage] !== undefined) {
            setTutorialIndex(tutorialIndex + deltaMessage)
            setTutorialDisplay(true)
        } else {
            setTutorialDisplay(false)
        }

    }

    const resetTutorialDisplay = () => {
        if (!winner) {
            setTutorialIndex(0)
            setTutorialDisplay(true)
        } else {
            setHideEndInfo(true)
        }
    }

    const tutorialMessage = (index: number) => {
        let currentStep = actionsNumber
        while (!tutorialDescription[currentStep]) {
            currentStep--
        }
        return tutorialDescription[currentStep][index]
    }

    useEffect(() => {
        if (previousActionNumber.current > actionsNumber) {
            setTutorialDisplay(false)
        } else if (tutorialDescription[actionsNumber]) {
            resetTutorialDisplay()
        }
        previousActionNumber.current = actionsNumber
    }, [actionsNumber])

    const [unexpectedMove, setUnexpectedMove] = useState(false)
    useEffect(() => {
        if (failures.some(failure => failure === Failure.TUTORIAL_MOVE_EXPECTED)) {
            setUnexpectedMove(true)
        } else if (unexpectedMove) {
            setTutorialIndex(tutorialDescription[actionsNumber].length - 1)
            setTutorialDisplay(true)
            setUnexpectedMove(false)
        }
    }, [actionsNumber, failures, unexpectedMove])

    useEffect(() => {
        tutorial.setOpponentsPlayAutomatically(true)
    }, [])

    useEffect(() => {
        if(actionsNumber === 2 && tutorialIndex === 5){
            playSetCaveDisplayed(setCaveDisplayedMove(PlayerColor.Blue), {local:true})
        }
    },[actionsNumber,tutorialIndex])

    const currentMessage = tutorialMessage(tutorialIndex)

    const isPlayerActive = (game: GameView) => {
        const huntingPlayer = getHuntingPlayer(game)
        if (!huntingPlayer) {
            return game.players.find(p => p.color === playerId)!.isReady !== true
        } else {
            return playerId === huntingPlayer.color && game.players.find(p => p.color === playerId)!.isReady !== true
        }
    }

    const displayPopup = tutorialDisplay && !animation && currentMessage !== undefined && !failures.length && isPlayerActive(game)

    return (
        <>

            {!winner && actionsNumber <25 && <div ref={ref} css={[popupStyle, currentMessage && popupWidth(currentMessage.boxWidth), displayPopup ? popupPosition(currentMessage) : hidePopupStyle]}
                 onClick={event => event.stopPropagation()}>

                <div css={closePopupStyle} onClick={() => setTutorialDisplay(false)}><FontAwesomeIcon icon={faTimes}/></div>

                {currentMessage && <h2>{currentMessage.title(t)} {currentMessage && currentMessage.image &&
                <Picture css={[imageStyle]} src={currentMessage.image} alt={t("help image")}/>}</h2>}
                {currentMessage && <p><Trans defaults={currentMessage.text} components={[<strong/>]}/></p>}
                {tutorialIndex > 0 && <Button css={buttonTutoStyle} colorButton={PlayerColor.Yellow} onClick={() => moveTutorial(-1)}>{'<<'}</Button>}
                <Button css={buttonTutoStyle} colorButton={PlayerColor.Yellow} onClick={() => moveTutorial(1)}>{t('OK')}</Button>

            </div>}

            {
                !displayPopup && !winner && actionsNumber < 25 &&
                <Button css={[buttonTutoStyle, resetStyle]} colorButton={PlayerColor.Yellow}
                        onClick={() => setTutorialDisplay(true)}>{t('Display tutorial')}</Button>
            }

            {
                currentMessage && currentMessage.arrow &&
                <Picture alt='Arrow pointing toward current tutorial interest' src={Arrow} draggable="false"
                         css={[arrowStyle(currentMessage.arrow.angle), displayPopup ? showArrowStyle(currentMessage.arrow.top, currentMessage.arrow.left) : hideArrowStyle]}/>
            }

            {
                winner && !hideEndInfo &&
                <div css={[popupStyle, popupWidth(tutorialEndGame.boxWidth), popupPosition(tutorialEndGame)]}>
                    <div css={closePopupStyle} onClick={() => setHideEndInfo(true)}><FontAwesomeIcon icon={faTimes}/></div>
                    <h2 css={textEndStyle}>{tutorialEndGame.title(t)}</h2>
                    <p css={textEndStyle}>{t(tutorialEndGame.text)}</p>
                    <Button css={[buttonTutoStyle, endSize]} colorButton={PlayerColor.Yellow}
                            onClick={() => resetTutorial()}>{t('Restart the tutorial')}</Button>
                    <Button css={[buttonTutoStyle, endSize]} colorButton={PlayerColor.Yellow}
                            onClick={() => window.location.href = platformUri}>{t('Play with friends')}</Button>
                    <Button css={[buttonTutoStyle, endSize]} colorButton={PlayerColor.Yellow}
                            onClick={() => window.location.href = discordUri}>{t('Find players')}</Button>
                </div>
            }

        </>
    )

}

export function resetTutorial() {
    localStorage.removeItem('prehistories')
    window.location.reload()
}

export const hidePopupStyle = css`
    transform: translate(157em, 72.5em) translate(-50%, -50%) scale(0.1);
`

const buttonTutoStyle = css`
    width: 5em;
    height: 1.5em;
    margin-right: 1em;
    font-family: 'Reggae One', sans-serif;
    z-index: 103;
`

const endSize = css`
    width: auto;
`

const textEndStyle = css`
    color: black;
`

const popupStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    z-index: 102;
    border-radius: 1em;
    box-sizing: border-box;
    align-self: center;
    padding: 2%;
    margin: 0 2%;
    outline: none;
    box-shadow: 1em 2em 2.5em -1.5em hsla(0, 0%, 0%, 0.95);
    border: 1em black solid;
    background-color: rgba(254, 165, 0, 0.95);
    border-radius: 40em 3em 40em 3em/3em 40em 3em 40em;
    color: black;
    font-family: 'Mulish', sans-serif;
    transition-property: transform, opacity;
    transition-duration: 0.7s;
    transition-timing-function: ease-in-out;

    &:before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 40em 1.5em 40em 1.5em/1.5em 40em 1.5em 40em;
        background-color: rgba(255, 255, 255, 0.1);
    }

    &:hover {
        box-shadow: 2em 4em 5em -3em hsla(0, 0%, 0%, 0.5);
    }

    & > h2 {
        position: relative;
        font-size: 5em;
        margin: 0 1em;
    }

    & > p {
        position: relative;
        text-align: center;
        font-size: 3.5em;
        white-space: break-spaces;

        strong {
            font-weight: bold;
        }

    }

    & > button {
        font-size: 3.5em;
    }
`

const closePopupStyle = css`
    position: relative;
    float: right;
    text-align: center;
    margin-top: -2%;
    margin-right: -0%;
    font-size: 4em;
    color: white;
    z-index: 1;

    &:hover {
        cursor: pointer;
        color: black;
    }
`

export const popupWidth = (boxWidth: number) => css`
    width: ${boxWidth}%;
`

export const popupPosition = ({boxTop, boxLeft, arrow}: TutorialStepDescription) => css`
    transform: translate(${boxLeft * 16 / 9}em, ${boxTop}em) translate(-50%, ${!arrow || arrow.angle % 180 !== 0 ? -50 : arrow.angle % 360 === 0 ? 0 : -100}%) translateZ(30em);
`

const arrowStyle = (angle: number) => css`
    position: absolute;
    transform: rotate(${angle}deg) translateZ(30em);
    will-change: transform;
    z-index: 102;
    transition-property: top, left, transform;
    transition-duration: 0.7s;
    transition-timing-function: ease-in-out;
`

const showArrowStyle = (top: number, left: number) => css`
    top: ${top}%;
    left: ${left}%;
    width: 20%;
`

const hideArrowStyle = css`
    top: 90%;
    left: 90%;
    width: 0;
`

const imageStyle = css`
    height:2.5em;
    filter:drop-shadow(0 0 0.1em black);
    vertical-align: middle;
`

const resetStyle = css`
    position: absolute;
    text-align: center;
    top: 70%;
    right: -1%;
    font-size: 3em;
    width: 11em;
    height: fit-content;
    font-family: 'Reggae One', sans-serif;
`

type TutorialStepDescription = {
    title: (t: TFunction) => string
    text: string
    boxTop: number
    boxLeft: number
    boxWidth: number
    arrow?: {
        angle: number
        top: number
        left: number
    }
    image?: string
}

const tutorialDescription: TutorialStepDescription[][] = [
    [
        {
            title: (t: TFunction) => t('title.welcome'),
            text: 'tuto.welcome',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 70
        },
        {
            title: (t: TFunction) => t('title.your.tribe'),
            text: 'tuto.your.tribe',
            boxTop: 33,
            boxLeft: 48,
            boxWidth: 50,
            arrow: {
                angle: 90,
                top: 25,
                left: 68
            }
        },
        {
            title: (t: TFunction) => t('title.their.tribes'),
            text: 'tuto.their.tribes',
            boxTop: 54,
            boxLeft: 48,
            boxWidth: 50,
            arrow: {
                angle: 90,
                top: 47,
                left: 68
            }
        },
        {
            title: (t: TFunction) => t('title.how.to.win'),
            text: 'tuto.how.to.win',
            boxTop: 42,
            boxLeft: 72,
            boxWidth: 50,
            arrow: {
                angle: 0,
                top: 29,
                left: 78
            }
        },
        {
            title: (t: TFunction) => t('title.how.to.win'),
            text: 'tuto.how.to.place.tokens',
            boxTop: 32,
            boxLeft: 52,
            boxWidth: 50,
            arrow: {
                angle: 0,
                top: 20,
                left: 42
            }
        },
        {
            title: (t: TFunction) => t('title.your.hand'),
            text: 'tuto.your.hand',
            boxTop: 67,
            boxLeft: 49,
            boxWidth: 60,
            arrow: {
                angle: 180,
                top: 66,
                left: 41
            }
        },
        {
            title: (t: TFunction) => t('title.phases'),
            text: 'tuto.phases',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
        },
        {
            title: (t: TFunction) => t('title.initiative.phase'),
            text: 'tuto.initiative.phase',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
        },
        {
            title: (t: TFunction) => t('title.play.card'),
            text: 'tuto.play.card',
            boxTop: 54,
            boxLeft: 26,
            boxWidth: 45,
            arrow: {
                angle: 90,
                top: 47,
                left: 44
            }
        }
    ], [
        {
            title: (t: TFunction) => t('title.playing.zone'),
            text: 'tuto.playing.zone',
            boxTop: 45,
            boxLeft: 25,
            boxWidth: 40,
            arrow: {
                angle: 90,
                top: 38,
                left: 40
            }
        },
        {
            title: (t: TFunction) => t('title.turn1.validate'),
            text: 'tuto.turn1.validate',
            boxTop: 33,
            boxLeft: 31,
            boxWidth: 45,
            arrow: {
                angle: 90,
                top: 22,
                left: 48
            }
        }
    ], [
        {
            title: (t: TFunction) => t('title.reveal'),
            text: 'tuto.reveal',
            boxTop: 50,
            boxLeft: 48,
            boxWidth: 50,
            arrow: {
                angle: 90,
                top: 40,
                left: 68
            }
        },
        {
            title: (t: TFunction) => t('title.turn.order'),
            text: 'tuto.turn.order',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
        },
        {
            title: (t: TFunction) => t('title.your.order'),
            text: 'tuto.your.order',
            boxTop: 35,
            boxLeft: 49,
            boxWidth: 50,
            arrow: {
                angle: 90,
                top: 28,
                left: 69
            }
        },
        {
            title: (t: TFunction) => t('title.hunt.phase'),
            text: 'tuto.hunt.phase',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 60,
        },
        {
            title: (t: TFunction) => t('title.huntBoard'),
            text: 'tuto.huntBoard',
            boxTop: 45,
            boxLeft: 49,
            boxWidth: 45,
            arrow: {
                angle: 270,
                top: 40,
                left: 15
            }
        },
        {
            title: (t: TFunction) => t('title.your.cave'),
            text: 'tuto.your.cave',
            boxTop: 50,
            boxLeft: 71,
            boxWidth: 40,
            arrow: {
                angle: 270,
                top: 48,
                left: 40
            }
        },
        {
            title: (t: TFunction) => t('title.placement.rules'),
            text: 'tuto.placement.rules',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 65,
        },
        {
            title: (t: TFunction) => t('title.place.1x1.tile'),
            text: 'tuto.place.1x1.tile.1',
            boxTop: 60,
            boxLeft: 53,
            boxWidth: 40,
            arrow: {
                angle: 270,
                top: 58,
                left: 22
            }
        },
        {
            title: (t: TFunction) => t('title.place.1x1.tile'),
            text: 'tuto.place.1x1.tile.2',
            boxTop: 26,
            boxLeft: 31,
            boxWidth: 40,
            arrow: {
                angle: 270,
                top: 13,
                left: 0
            }
        }
    ], [
        {
            title: (t: TFunction) => t('title.spend.mecanics'),
            text: 'tuto.spend.mecanics',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
        },
        {
            title: (t: TFunction) => t('title.spend.costs'),
            text: 'tuto.spend.costs',
            boxTop: 25,
            boxLeft: 30,
            boxWidth: 60,
            arrow: {
                angle: 0,
                top: 13,
                left: -3
            }
        },
        {
            title: (t: TFunction) => t('title.spend.cost.zone'),
            text: 'tuto.spend.cost.zone',
            boxTop: 25,
            boxLeft: 30,
            boxWidth: 60,
            arrow: {
                angle: 0,
                top: 13,
                left: -3
            },  
            image:Images.tutoSignHelp
        },
        {
            title: (t: TFunction) => t('title.spend.hunter'),
            text: 'tuto.spend.hunter',
            boxTop: 50,
            boxLeft: 25,
            boxWidth: 40,
            arrow: {
                angle: 90,
                top: 40,
                left: 40
            }
        }
    ], [
        {
            title: (t: TFunction) => t('title.no.injury.hunting'),
            text: 'tuto.no.injury.hunting',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
        },
        {
            title: (t: TFunction) => t('title.end.your.turn'),
            text: 'tuto.end.your.turn',
            boxTop: 43,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 0,
                top: 30,
                left: 55
            }
        }
    ], [
        {
            title: (t: TFunction) => t('title.draw.cards'),
            text: 'tuto.draw.cards',
            boxTop: 70,
            boxLeft: 50,
            boxWidth: 60,
            arrow: {
                angle: 180,
                top: 70,
                left: 42
            }
        },
        {
            title: (t: TFunction) => t('title.play.hunters'),
            text: 'tuto.play.hunters',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
        }
    ], [], [], [], [
        {
            title: (t: TFunction) => t('title.turn2.validate'),
            text: 'tuto.turn2.validate',
            boxTop: 30,
            boxLeft: 30.5,
            boxWidth: 45,
            arrow: {
                angle: 90,
                top: 22,
                left: 48
            }
        }
    ], [
        {
            title: (t: TFunction) => t('title.placement.rules.2'),
            text: 'tuto.placement.rules.2',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
        },
        {
            title: (t: TFunction) => t('title.turn.tiles'),
            text: 'tuto.turn.tiles',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 60,
        },
        {
            title: (t: TFunction) => t('title.place.2x1.tile'),
            text: 'tuto.place.2x1.tile.1',
            boxTop: 55,
            boxLeft: 58,
            boxWidth: 40,
            arrow: {
                angle: 270,
                top: 55,
                left: 27
            }
        },
        {
            title: (t: TFunction) => t('title.place.2x1.tile'),
            text: 'tuto.place.2x1.tile.2',
            boxTop: 27,
            boxLeft: 44,
            boxWidth: 40,
            arrow: {
                angle: 270,
                top: 21,
                left: 13
            }
        }

    ], [
        {
            title: (t: TFunction) => t('title.spend.hunters'),
            text: 'tuto.spend.hunters',
            boxTop: 55,
            boxLeft: 25,
            boxWidth: 45,
        },
        {
            title: (t: TFunction) => t('title.spend.two.hunters'),
            text: 'tuto.spend.two.hunters',
            boxTop: 55,
            boxLeft: 25,
            boxWidth: 45,
        }
    ], [], [], [
        {
            title: (t: TFunction) => t('title.injury.hunt'),
            text: 'tuto.injury.hunt',
            boxTop: 35,
            boxLeft: 61,
            boxWidth: 55,
            arrow: {
                angle: 90,
                top: 28,
                left: 84
            }
        },
        {
            title: (t: TFunction) => t('title.drawing.rules'),
            text: 'tuto.drawing.rules',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 75,
        },
        {
            title: (t: TFunction) => t('title.end.turn'),
            text: 'tuto.end.turn',
            boxTop: 50,
            boxLeft: 25,
            boxWidth: 45,
        }

    ], [
        {
            title: (t: TFunction) => t('title.play.big.hunters'),
            text: 'tuto.play.big.hunters',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
        }
    ], [], [], [
        {
            title: (t: TFunction) => t('title.turn3.validate'),
            text: 'tuto.turn3.validate',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
        }
    ], [
        {
            title: (t: TFunction) => t('title.how.to.discard.tokens'),
            text: 'tuto.how.to.discard.tokens',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
        },
        {
            title: (t: TFunction) => t('title.how.to.discard.tokens'),
            text: 'tuto.your.tokens',
            boxTop: 41,
            boxLeft: 73,
            boxWidth: 50,
            arrow: {
                angle: 0,
                top: 28,
                left: 80
            }
        },
        {
            title: (t: TFunction) => t('title.how.to.discard.tokens'),
            text: 'tuto.permanent.objectives.intro',
            boxTop: 29,
            boxLeft: 73,
            boxWidth: 50,
            arrow: {
                angle: 0,
                top: 16,
                left: 80
            }
        },
        {
            title: (t: TFunction) => t('title.how.to.discard.tokens'),
            text: 'tuto.variable.objectives.intro',
            boxTop: 37,
            boxLeft: 51,
            boxWidth: 60,
            arrow: {
                angle: 0,
                top: 24,
                left: 42
            }
        },
        {
            title: (t: TFunction) => t('title.permanent.objectives'),
            text: 'tuto.permanent.objectives.1',
            boxTop: 27,
            boxLeft: 68,
            boxWidth: 60,
            arrow: {
                angle: 0,
                top: 14,
                left: 80
            }
        },
        {
            title: (t: TFunction) => t('title.permanent.objectives'),
            text: 'tuto.permanent.objectives.2',
            boxTop: 32,
            boxLeft: 68,
            boxWidth: 60,
            arrow: {
                angle: 0,
                top: 19,
                left: 80
            }
        },
        {
            title: (t: TFunction) => t('title.variable.objectives'),
            text: 'tuto.variable.objectives',
            boxTop: 29,
            boxLeft: 58,
            boxWidth: 60,
            arrow: {
                angle: 0,
                top: 16,
                left: 42
            }
        },
        {
            title: (t: TFunction) => t('title.variable.objectives.how.many.tokens'),
            text: 'tuto.variable.objectives.how.many.tokens.1',
            boxTop: 41,
            boxLeft: 48,
            boxWidth: 60,
            arrow: {
                angle: 0,
                top: 29,
                left: 23
            }
        },
        {
            title: (t: TFunction) => t('title.variable.objectives.how.many.tokens'),
            text: 'tuto.variable.objectives.how.many.tokens.2',
            boxTop: 41,
            boxLeft: 48,
            boxWidth: 60,
            arrow: {
                angle: 0,
                top: 29,
                left: 29.4
            }
        },
        {
            title: (t: TFunction) => t('title.link.totems.objective'),
            text: 'tuto.link.totems.objective',
            boxTop: 37,
            boxLeft: 34,
            boxWidth: 60,
            arrow: {
                angle: 0,
                top: 24,
                left: 37
            }
        },
        {
            title: (t: TFunction) => t('title.play.legendary.tile'),
            text: 'tuto.play.legendary.tile.1',
            boxTop: 55,
            boxLeft: 68,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 45,
                left: 32
            }
        },
        {
            title: (t: TFunction) => t('title.play.legendary.tile'),
            text: 'tuto.play.legendary.tile.2',
            boxTop: 73,
            boxLeft: 29,
            boxWidth: 60,
            arrow: {
                angle: 180,
                top: 73,
                left: 8
            }
        }
    ], [
        {
            title: (t: TFunction) => t('title.spend.all.hunters'),
            text: 'tuto.spend.all.hunters',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50
        }
    ], [], [], [], [
        {
            title: (t: TFunction) => t('title.objectives.validate'),
            text: 'tuto.objectives.validate.1',
            boxTop: 24,
            boxLeft: 67,
            boxWidth: 60,
            arrow: {
                angle: 0,
                top: 10,
                left: 85
            }
        },
        {
            title: (t: TFunction) => t('title.objectives.validate'),
            text: 'tuto.objectives.validate.2',
            boxTop: 22,
            boxLeft: 50,
            boxWidth: 60,
            arrow: {
                angle: 0,
                top: 10,
                left: 34
            }
        },
        {
            title: (t: TFunction) => t('title.handprints'),
            text: 'tuto.handprints.1',
            boxTop: 55,
            boxLeft: 68,
            boxWidth: 45,
            arrow: {
                angle: 270,
                top: 47,
                left: 34
            }
        },
        {
            title: (t: TFunction) => t('title.handprints'),
            text: 'tuto.handprints.2',
            boxTop: 45,
            boxLeft: 65,
            boxWidth: 51,
            arrow: {
                angle: 270,
                top: 37,
                left: 28
            }
        },
        {
            title: (t: TFunction) => t('title.review.objectives'),
            text: 'tuto.review.objectives',
            boxTop: 29,
            boxLeft: 58,
            boxWidth: 60,
            arrow: {
                angle: 0,
                top: 16,
                left: 42
            }
        },
        {
            title: (t: TFunction) => t('title.end.tuto'),
            text: 'tuto.end.tuto',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 60,
        },
    ]
]

const tutorialEndGame = {
    title: (t: TFunction) => t('Congratulations'),
    text: 'tuto.complete',
    boxTop: 80,
    boxLeft: 50,
    boxWidth: 90
}


export default TutorialPopup