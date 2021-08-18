/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import PlayerColor from '@gamepark/prehistories/PlayerColor'
import {ButtonHTMLAttributes, FC} from 'react'
import { getPlayerColor } from './getterFunctions'

type Props = {
  colorButton:PlayerColor
}

const Button : FC<ButtonHTMLAttributes<HTMLButtonElement> & Props> = ({children, colorButton, ...props}) => {
    
    return <button css={[style(getPlayerColor(colorButton))]} {...props}> <span css={spanBorder(colorButton)}> {children}</span> </button>

}




const style = (color:string) => css`
--color: #000000;
--background-color: ${color};
--border-color: darken(${color}, 7.5%);
padding: 0.6rem 0.9rem;
border-radius: 0.5rem;
color: var(--color);
font-family: inherit;
background-color: var(--background-color);
border: solid 1px var(--border-color);
outline: none;
position: relative;
user-select: none;
box-shadow:
  0 0.2rem 0.4rem rgba(0, 0, 0, 0.4),
  0 -0.3rem 0.6rem rgba(0, 0, 0, 0.2) inset;
transition: box-shadow 65ms ease-out;
&:after {
  content: "";
  background-color: #ffffff;
  width: 75%;
  height: 12.5%;
  position: absolute;
  top: 0.15rem;
  left: 12.5%;
  border-radius: 50%;
  filter: blur(0.15rem);
  transition: opacity 65ms ease-out;
}
&:active {
  box-shadow:
    0 0 0 rgba(0, 0, 0, 0.4),
    0 0.4rem 1rem rgba(0, 0, 0, 0.3) inset;
  &:after {
    opacity: 0;
  }
}

`

const spanBorder = (color:PlayerColor) => css`
    ${isDarkColor(color) ? `color:white;` : `color:black;` };
    margin: 0 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`

function isDarkColor(color:PlayerColor):boolean{
  if (color === PlayerColor.Blue || color === PlayerColor.Red){
    return true
  } else {
    return false
  }
}

export default Button