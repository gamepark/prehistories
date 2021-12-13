/** @jsxImportSource @emotion/react */
import { useTranslation } from "react-i18next"
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { css } from "@emotion/react"
import { centerContent } from "../utils/styles"

type Props = {
    onClose:() => void
}

export default function FocusedObjectiveOptions({onClose}:Props){
    
    const {t} = useTranslation()
    
    return(
        <>

            <button css={[button, closeButton]} onClick={onClose}>
                <FontAwesomeIcon icon={faTimes}/>
                {t('Close')}
            </button>

            <div css={[helpText, centerContent, css`top: 14.5%; left: 22%; width:56%; flex-direction:column;`]}>
                <p>{t('help.permanent.objectives.title')}</p>
                <p css={css`font-size:0.8em;`}>{t('help.permanent.objectives.text')}</p>
            </div>

            <div css={[helpText, centerContent, css`top: 62%; left: 22%`]}>
                <p>{t('help.make.column')}</p>
            </div>

            <div css={[helpText, centerContent, css`top: 62%; right: 22%`]}>
                <p>{t('help.make.line')}</p>
            </div>

            <div css={[helpText, centerContent, css`top: 62%; left: 41%`]}>
                <p>{t('help.paint.legendary')}</p>
            </div>

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
  top: ${84}%;
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
  height:12.5%;
  width:18%;
  text-align:center;
  & p{
      margin:0 0;
  }
`

const helpLine = css`
  position: absolute;
  z-index: 120;
  background-color: white;
  border-color: #EEE;
  border-width: 0.15em;
  border-style: solid;
`