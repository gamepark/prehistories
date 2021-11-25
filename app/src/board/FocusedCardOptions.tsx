/** @jsxImportSource @emotion/react */
import { useTranslation } from "react-i18next"
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { css } from "@emotion/react"

type Props = {
    onClose:() => void
}

export default function FocusedCardOptions({onClose}:Props){
    
    const {t} = useTranslation()
    
    return(
        <>

            <button css={[button, closeButton]} onClick={onClose}>
                <FontAwesomeIcon icon={faTimes}/>
                {t('Close')}
            </button>
            <div css={[helpText, css`top: 8%; left: 16%`]}>
                <p>{t('help.power.title')}</p>
                <p css={css`font-size:0.8em;`}>{t('help.power.text')}</p>
            </div>

            <hr css={[helpLine, css`width: 8%;
            top: 15.5%;
            left: 33%;
            transform: rotate(18deg);`]}
            />

            <div css={[helpText, css`top: 8%; right: 16%`]}>
                <p>{t('help.speed.title')}</p>
                <p css={css`font-size:0.8em;`}>{t('help.speed.text')}</p>
            </div>
            <hr css={[helpLine, css`width: 8%;
            top: 15.5%;
            right: 33%;
            transform: rotate(-18deg);`]}
        />

        </>
    )
}

const button = css`
  position: absolute;
  z-index: 100;
  left: ${50}%;
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
  top: ${10}%;
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