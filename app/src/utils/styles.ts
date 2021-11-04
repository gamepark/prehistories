import { css } from "@emotion/react";

export const toAbsolute = css`
    position:absolute;
`

export const toFullSize = css`
    width:100%;height:100%;
`
export const placingBackground = (image:string, size:string) => css`
    background-image: url(${image});
    background-size: ${size};
    background-repeat: no-repeat;
    background-position: top;
`

export const centerContent = css`
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
`

export const centerContainer = css`
    top:50%;
    left:50%;
    transform:translateY(-50%) translateX(-50%);
`

export const setPercentDimension = (height:number, width:number) => css`
    height:${height}%;
    width:${width}%;
`

export const sizeTileW = 14.2857 // % unit
export const sizeTileH = 14.2857 // % unit