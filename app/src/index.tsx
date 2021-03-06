import {css, Global} from '@emotion/react'
import Prehistories from '@gamepark/prehistories/Prehistories'
import {PrehistoriesOptionsSpec} from '@gamepark/prehistories/PrehistoriesOptions'
import {GameProvider, setupTranslation} from '@gamepark/react-client'
import normalize from 'emotion-normalize'
import {StrictMode} from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import prehistoriesAnimations from './PrehistoriesAnimations'
import PrehistoriesView from './PrehistoriesView'
import translations from './translations.json'
import PrehistoriesTutorial from './tutorial/Tutorial'
import Images from './utils/Images'

setupTranslation(translations,{debug:false})

const style = css`
  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }

  body {
    margin: 0;
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 1vh;
    @media (max-aspect-ratio: 16/9) {
      font-size: calc(9vw / 16);
    }
  }

  #root {
    position: absolute;
    height: 100vh;
    width: 100vw;
    user-select: none;
    overflow: hidden;
    background-image: url(${Images.caveBGYellow});
    background-size: cover;
    background-position: center;
    color: #eee;

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
`

ReactDOM.render(
  <StrictMode>
    <GameProvider game="prehistories" 
                  Rules={Prehistories} 
                  RulesView={PrehistoriesView} 
                  optionsSpec={PrehistoriesOptionsSpec}
                  animations={prehistoriesAnimations}
                  tutorial={PrehistoriesTutorial}
                  >
      <App/>
    </GameProvider>
    <Global styles={[normalize, style]}/>
  </StrictMode>,
  document.getElementById('root')
)
