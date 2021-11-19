/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Tutorial, useActions, useAnimation, useFailures, usePlay, usePlayerId} from "@gamepark/react-client";
import {Picture} from '@gamepark/react-components'
import {TFunction} from "i18next";
import {FC, useEffect, useRef, useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import Arrow from "../images/tutorial-arrow-white.png"
import Button from "../utils/Button";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import GameView from "@gamepark/prehistories/GameView";
import Move from "@gamepark/prehistories/moves/Move";


const TutorialPopup : FC<{game:GameView, tutorial:Tutorial}> = ({game, tutorial}) => {

    const {t} = useTranslation()
    const playerId = usePlayerId<PlayerColor>()
    const actions = useActions<Move, PlayerColor>()
    const actionsNumber = actions !== undefined ? actions.filter(action => action.playerId === playerId).length : 0
    const previousActionNumber = useRef(actionsNumber)
    const [tutorialIndex, setTutorialIndex] = useState(0)
    const [tutorialDisplay, setTutorialDisplay] = useState(tutorialDescription.length > actionsNumber)
    const [failures] = useFailures()
    const [hideEndInfo, setHideEndInfo] = useState(false)

    const platformUri = process.env.REACT_APP_PLATFORM_URI ?? 'https://game-park.com'
    const discordUri = 'https://discord.gg/nMSDRag'

    const play = usePlay<Move>()
    const animation = useAnimation<Move>()

    const moveTutorial = (deltaMessage: number) => {
      setTutorialIndex(tutorialIndex + deltaMessage)
      setTutorialDisplay(true)
      if (deltaMessage > 0){
        playMoves()
      }
    }

    function playMoves():void{

    }
    
    const resetTutorialDisplay = () => {
      if (game.phase !== undefined){
            setTutorialIndex(0)
            setTutorialDisplay(true)
        } else {
            setHideEndInfo(false)
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

    useEffect(() => {
      if (failures.length) {
        setTutorialIndex(tutorialDescription[actionsNumber].length - 1)  
        setTutorialDisplay(true)
        }
    }, [actionsNumber, failures])

    useEffect(() => {
        tutorial.setOpponentsPlayAutomatically(true)
    }, [])

    const currentMessage = tutorialMessage(tutorialIndex)

    const displayPopup = tutorialDisplay && !animation && currentMessage && !failures.length

    return (
        <>

        <div css={[popupOverlayStyle, displayPopup ? showPopupOverlayStyle : hidePopupOverlayStyle(85, 90), style]}
            onClick={() => setTutorialDisplay(false)}>

            <div css={[popupStyle, displayPopup ? popupPosition(currentMessage) : hidePopupStyle]}
                onClick={event => event.stopPropagation()}>

              <div css={closePopupStyle} onClick={() => setTutorialDisplay(false)}><FontAwesomeIcon icon={faTimes}/></div>

              {currentMessage && <h2>{currentMessage.title(t)} {currentMessage && currentMessage.image && <Picture css={[imageStyle]} src={currentMessage.image} alt={t("steal Token")} />}</h2>}
              {currentMessage && <p> <Trans defaults={currentMessage.text} components={[<strong/>]} /> </p>}
              {tutorialIndex > 0 && <Button css={buttonTutoStyle} colorButton={PlayerColor.Yellow} onClick={() => moveTutorial(-1)}>{'<<'}</Button>}
              <Button css={buttonTutoStyle} colorButton={PlayerColor.Yellow} onClick={() => moveTutorial(1)}>{t('OK')}</Button>

            </div>

        </div>

        {
        !displayPopup && 
        <Button css={[buttonTutoStyle, resetStyle]} colorButton={PlayerColor.Yellow} onClick={() => resetTutorialDisplay()}>{t('Display tutorial')}</Button>
        }

        {
          currentMessage && currentMessage.arrow &&
          <Picture alt='Arrow pointing toward current tutorial interest' src={Arrow} draggable="false"
                   css={[arrowStyle(currentMessage.arrow.angle), displayPopup ? showArrowStyle(currentMessage.arrow.top, currentMessage.arrow.left) : hideArrowStyle]}/>
        }

        {
          game.phase === undefined && !hideEndInfo &&
          <div css={[popupStyle, popupPosition(tutorialEndGame)]}>
            <div css={closePopupStyle} onClick={() => setHideEndInfo(true)}><FontAwesomeIcon icon={faTimes}/></div>
            <h2 css={textEndStyle} >{tutorialEndGame.title(t)}</h2>
            <p css={textEndStyle} >{t(tutorialEndGame.text)}</p>
            <Button css={[buttonTutoStyle, endSize]} colorButton={PlayerColor.Yellow} onClick={() => resetTutorial()}>{t('Restart the tutorial')}</Button>
            <Button css={[buttonTutoStyle, endSize]} colorButton={PlayerColor.Yellow} onClick={() => window.location.href = platformUri}>{t('Play with friends')}</Button>
            <Button css={[buttonTutoStyle, endSize]} colorButton={PlayerColor.Yellow} onClick={() => window.location.href = discordUri}>{t('Find players')}</Button>
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
  top: 85%;
  left: 90%;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: solid 0 #FFF;
  font-size: 0;
`

export const hidePopupOverlayStyle = (boxTop: number, boxLeft: number) => css`
  top: ${boxTop}%;
  left: ${boxLeft}%;
  width: 0;
  height: 0;
  overflow: hidden;
`

const buttonTutoStyle = css`
width:5em;
height:1.5em;
margin-right: 1em;
font-family:'Reggae One', sans-serif;
`

const endSize = css`
width:auto;
`

const textEndStyle = css`
color: black;
`

const popupOverlayStyle = css`
  position: absolute;
  transform: translateZ(30em);
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  transition: all .5s ease;
`
const showPopupOverlayStyle = css`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`

const popupStyle = css`
  position: absolute;
  text-align: center;
  z-index : 102;
  border-radius: 1em;
  box-sizing: border-box;
  align-self: center;
  padding: 2%;
  margin: 0 2%;
  outline: none;
  box-shadow: 1em 2em 2.5em -1.5em hsla(0, 0%, 0%, 0.2);
  border:1em black solid;
  background: url();
  background-color: rgba(254,165,0,0.8);
  border-radius: 40em 3em 40em 3em/3em 40em 3em 40em;
  color:black;
  font-family: 'Mulish', sans-serif;

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
  
  &:hover{
      box-shadow: 2em 4em 5em -3em hsla(0,0%,0%,0.5);
    }
  & > h2 {
    position:relative;
    font-size: 5em;
    margin:0 1em;
  }
  & > p {
    position:relative;
    text-align: center;
    font-size: 3.5em;
    white-space: break-spaces;

    strong {
      font-weight:bold;
    }

  }
  & > button {
    font-size: 3.5em;
  }
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
  color:white;
  &:hover{
    cursor: pointer;
    color: black;
  }
`

export const popupPosition = ({boxWidth, boxTop, boxLeft, arrow}: TutorialStepDescription) => css`
  transition-property: width, top, left, transform;
  transition-duration: 0.7s;
  transition-timing-function: ease-in-out;
  width: ${boxWidth}%;
  top: ${boxTop}%;
  left: ${boxLeft}%;
  transform: translate(-50%, ${!arrow || arrow.angle % 180 !== 0 ? '-50%' : arrow.angle % 360 === 0 ? '0%' : '-100%'}) translateZ(30em);
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
border-radius:100%;
box-shadow:0 0 0.1em 0.02em black;
vertical-align: bottom;
`

const resetStyle = css`
  position: absolute;
  text-align: center;
  top: 70%;
  right: -1%;
  font-size: 3em;
  width:11em;
  height:fit-content;
  font-family:'Reggae One', sans-serif;
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
    image?:string
  }

const tutorialDescription:TutorialStepDescription[][] = [
    [
        {
            title: (t: TFunction) => t('title.welcome'),
            text: 'tuto.welcome',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50
        },
        {
          title: (t: TFunction) => t('title.your.tribe'),
            text: 'tuto.your.tribe',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        },
        {
            title: (t: TFunction) => t('title.their.tribes'),
            text: 'tuto.their.tribes',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        },
        {
            title: (t: TFunction) => t('title.how.to.win'),
            text: 'tuto.how.to.win',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        },
        {
            title: (t: TFunction) => t('title.your.hand'),
            text: 'tuto.your.hand',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        },
        {
          title: (t: TFunction) => t('title.phases'),
          text: 'tuto.phases',
          boxTop: 50,
          boxLeft: 50,
          boxWidth: 50,
          arrow: {
              angle: 180,
              top: 50,
              left: 50
          }
      },
        {
            title: (t: TFunction) => t('title.initiative.phase'),
            text: 'tuto.initiative.phase',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        },
        {
            title: (t: TFunction) => t('title.play.card'),
            text: 'tuto.play.card',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        }
    ],[
        {
            title: (t: TFunction) => t('title.playing.zone'),
            text: 'tuto.playing.zone',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        },
        {
            title: (t: TFunction) => t('title.turn1.validate'),
            text: 'tuto.turn1.validate',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        }
    ],[
        {
            title: (t: TFunction) => t('title.reveal'),
            text: 'tuto.reveal',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        },
        {
            title: (t: TFunction) => t('title.turn.order'),
            text: 'tuto.turn.order',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        },
        {
            title: (t: TFunction) => t('title.your.order'),
            text: 'tuto.your.order',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        },
        {
          title: (t: TFunction) => t('title.hunt.phase'),
          text: 'tuto.hunt.phase',
          boxTop: 50,
          boxLeft: 50,
          boxWidth: 50,
          arrow: {
              angle: 180,
              top: 50,
              left: 50
          }
        }, 
        {
            title: (t: TFunction) => t('title.huntBoard'),
            text: 'tuto.huntBoard',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        }, 
        {
            title: (t: TFunction) => t('title.your.cave'),
            text: 'tuto.your.cave',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        },
        {
            title: (t: TFunction) => t('title.placement.rules'),
            text: 'tuto.placement.rules',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        },
        {
            title: (t: TFunction) => t('title.place.1x1.tile'),
            text: 'tuto.place.1x1.tile',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        }
    ],[
        {
          title: (t: TFunction) => t('title.spend.mecanics'),
          text: 'tuto.spend.mecanics',
          boxTop: 50,
          boxLeft: 50,
          boxWidth: 50,
          arrow: {
              angle: 180,
              top: 50,
              left: 50
            }
        },
        {
          title: (t: TFunction) => t('title.spend.costs'),
          text: 'tuto.spend.costs',
          boxTop: 50,
          boxLeft: 50,
          boxWidth: 50,
          arrow: {
              angle: 180,
              top: 50,
              left: 50
            }
        },
        {
          title: (t: TFunction) => t('title.spend.cost.huntspot'),
          text: 'tuto.spend.cost.huntspot',
          boxTop: 50,
          boxLeft: 50,
          boxWidth: 50,
          arrow: {
              angle: 180,
              top: 50,
              left: 50
            }
        },
        {
            title: (t: TFunction) => t('title.spend.hunter'),
            text: 'tuto.spend.hunter',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        }
    ],[
        {
            title: (t: TFunction) => t('title.no.injury.hunting'),
            text: 'tuto.no.injury.hunting',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        },
        {
            title: (t: TFunction) => t('title.end.your.turn'),
            text: 'tuto.end.your.turn',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        }
    ],[
        {
            title: (t: TFunction) => t('title.draw.cards'),
            text: 'tuto.draw.cards',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        },
        {
            title: (t: TFunction) => t('title.play.hunters'),
            text: 'tuto.play.hunters',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        }
    ],[],[],[],[
        {
            title: (t: TFunction) => t('title.turn2.validate'),
            text: 'tuto.turn2.validate',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 50
            }
        }
    ],[
      {
        title: (t: TFunction) => t('title.placemebt.rules.2'),
        text: 'tuto.placement.rules.2',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
          }
      },
      {
        title: (t: TFunction) => t('title.turn.tiles'),
        text: 'tuto.turn.tiles',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
    },
    {
      title: (t: TFunction) => t('title.place.2x1.tile'),
      text: 'tuto.place.2x1.tile',
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 50,
      arrow: {
          angle: 180,
          top: 50,
          left: 50
      }
    }
        
    ],[
      {
        title: (t: TFunction) => t('title.spend.hunters'),
        text: 'tuto.spend.two.hunters',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      },
      {
        title: (t: TFunction) => t('title.spend.hunters'),
        text: 'tuto.spend.two.hunters',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      }
    ],[],[],[
      {
        title: (t: TFunction) => t('title.injury.hunt'),
        text: 'tuto.injury.hunt',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      },
      {
        title: (t: TFunction) => t('title.drawing.rules'),
        text: 'tuto.drawing.rules',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      },
      {
        title: (t: TFunction) => t('title.end.turn'),
        text: 'tuto.end.turn',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      }
      
    ],[
      {
        title: (t: TFunction) => t('title.play.big.hunters'),
        text: 'tuto.play.big.hunters',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      }
    ],[],[],[
      {
        title: (t: TFunction) => t('title.turn3.validate'),
        text: 'tuto.turn3.validate',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      }
    ],[
      {
        title: (t: TFunction) => t('title.how.to.discard.tokens'),
        text: 'tuto.how.to.discard.tokens',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      },
      {
        title: (t: TFunction) => t('title.permanent.objectives'),
        text: 'tuto.permanent.objectives',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      },
      {
        title: (t: TFunction) => t('title.variable.objectives'),
        text: 'tuto.variable.objectives',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      },
      {
        title: (t: TFunction) => t('title.link.totems.objective'),
        text: 'tuto.link.totems.objective',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      },
      {
        title: (t: TFunction) => t('title.play.legendary.tile'),
        text: 'tuto.play.legendary.tile',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      }
    ],[
      {
        title: (t: TFunction) => t('title.spend.all.hunters'),
        text: 'tuto.spend.all.hunters',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      }
    ],[],[],[],[],[
      {
        title: (t: TFunction) => t('title.objectives.validate'),
        text: 'tuto.bbjectives.validate',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      },
      {
        title: (t: TFunction) => t('title.handprints.1'),
        text: 'tuto.handprints.1',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      },
      {
        title: (t: TFunction) => t('title.handprints.2'),
        text: 'tuto.handprints.2',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      },
      {
        title: (t: TFunction) => t('title.review.objectives'),
        text: 'tuto.review.objectives',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      },
      {
        title: (t: TFunction) => t('title.end.tuto'),
        text: 'tuto.end.tuto',
        boxTop: 50,
        boxLeft: 50,
        boxWidth: 50,
        arrow: {
            angle: 180,
            top: 50,
            left: 50
        }
      },
    ]
]

const tutorialEndGame = {
  title: (t: TFunction) => t('Congratulations'),
  text: 'You have finished your first game! You can now play with your friends, or meet other players via our chat room on Discord.',
  boxTop: 29,
  boxLeft: 50,
  boxWidth: 80
}


export default TutorialPopup