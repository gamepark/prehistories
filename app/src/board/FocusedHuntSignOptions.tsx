/** @jsxImportSource @emotion/react */
import { useTranslation } from "react-i18next"
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { css } from "@emotion/react"

type Props = {
    onClose:() => void
}

export default function FocusedHuntSignOptions({onClose}:Props){
    
    const {t} = useTranslation()
    
    return(
        <>

            <div css={[helpText, css`top: 20%; right: 06%`]}>
                <p>{t('help.injury.hunt.title')}</p>
                <p css={css`font-size:0.8em;`}>{t('help.injury.hunt.text')}</p>
            </div>
            <hr css={[helpLine, css`width: 14%;
            top: 35.5%;
            right: 23%;
            transform: rotate(-18deg);`]}
        />

            <button css={[button, closeButton]} onClick={onClose}>
                <FontAwesomeIcon icon={faTimes}/>
                {t('Close')}
            </button>
            <div css={[helpText, css`top: 58%; right: 6%`]}>
                <p>{t('help.no.injury.hunt.title')}</p>
                <p css={css`font-size:0.8em;`}>{t('help.no.injury.hunt.text')}</p>
            </div>

            <hr css={[helpLine, css`width: 14%;
            top: 65%;
            right: 23%;
            transform: rotate(18deg);`]}
            />

            <div css={[helpText, css`top: 10%; left: 23%`]}>
                <p>{t('help.draw.3.cards')}</p>
            </div>

            <hr css={[helpLine, css`width: 5%;
            top: 29%;
            left: 29%;
            transform: rotate(80deg);`]}
            />

            <div css={[helpText, css`bottom: 10%; left: 23%`]}>
                <p>{t('help.draw.0.card')}</p>
            </div>

            <hr css={[helpLine, css`width: 5%;
            bottom: 29%;
            left: 29%;
            transform: rotate(-80deg);`]}
            />

            <div css={[helpText, css`bottom: 30%; left: 5%`]}>
                <p>{t('help.draw.1.card')}</p>
            </div>

            <hr css={[helpLine, css`width: 10%;
            bottom: 38%;
            left: 20%;
            transform: rotate(-25deg);`]}
            />

            <div css={[helpText, css`top: 30%; left: 5%`]}>
                <p>{t('help.draw.2.cards')}</p>
            </div>

            <hr css={[helpLine, css`width: 10%;
            top: 42%;
            left: 20%;
            transform: rotate(25deg);`]}
            />
            

        </>
    )
}

const button = css`
  position: absolute;
  z-index: 100;
  left: ${60}%;
  font-size: 3.2em;
  font-weight: lighter;
  color: #EEE;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 1em;
  padding: 0.3em 0.6em;
  transform:translateX(-50%);

  & svg {
    margin-right: 0.3em;
  }

  &:hover, &:focus {
    transform: translateX(-50%) translateY(1px) scale(1.05);
    cursor: pointer;
  }

  &:active {
    border-style: inset;
    transform: translateX(-50%) translateY(1px);
  }
`

const closeButton = css`
  top: ${20}%;
  border: 0.1em solid #EEE;
`

const helpText = css`
  position: absolute;
  z-index: 150;
  font-size: 3.2em;
  font-weight: lighter;
  color: #EEE;
  background: black;
  border-radius: 1em;
  padding: 0.3em 0.6em;
  border: 0.1em solid #EEE;
  height:fit-content;
  width:18%;
  text-align:center;
`

const helpLine = css`
  position: absolute;
  z-index: 120;
  background-color: white;
  border-color: #EEE;
  border-width: 0.15em;
  border-style: solid;
`