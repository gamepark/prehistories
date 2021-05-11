enum Animal {
    Mammoth = 1, Boar, Fish, Yak, Ibex,
    Totem, Hunter, HandPrints, 
    Legendary1, Legendary2, Legendary3, Legendary4, Legendary5
}

export default Animal

export function isHunter(animal:Animal):boolean{
    return (animal === 7)
}
export function isLegendary(animal:Animal):boolean{
    return (animal >= 9)
}

export function isHandPrints(animal:Animal):boolean{
    return (animal === 8)
}