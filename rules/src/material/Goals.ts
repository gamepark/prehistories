import Face from "../types/Face";
import Goal from "../types/Goal";

const GoalA1: Goal = {
    face:Face.A,
    text:'goalA1',
    hint:'hintA1',
    value:2
}

const GoalA2: Goal = {
    face:Face.A,
    text:'goalA2',
    hint:'hintA2',
    value:2
}

const GoalA3: Goal = {
    face:Face.A,
    text:'goalA3',
    hint:'hintA3',
    value:2
}

const GoalA4: Goal = {
    face:Face.A,
    text:'goalA4',
    hint:'hintA4',
    value:2
}

const GoalA5: Goal = {
    face:Face.A,
    text:'goalA5',
    hint:'hintA5',
    value:2
}

const GoalA6: Goal = {
    face:Face.A,
    text:'goalA6',
    hint:'hintA6',
    value:2
}

const GoalA7: Goal = {
    face:Face.A,
    text:'goalA7',
    hint:'hintA7',
    value:2
}

const GoalA8: Goal = {
    face:Face.A,
    text:'goalA8',
    hint:'hintA8',
    value:2
}

const GoalA9: Goal = {
    face:Face.A,
    text:'goalA9',
    hint:'hintA9',
    value:2
}

const GoalB1: Goal = {
    face:Face.B,
    text:'goalB1',
    hint:'hintB1',
    value:2
}

const GoalB2: Goal = {
    face:Face.B,
    text:'goalB2',
    hint:'hintB2',
    value:2
}

const GoalB3: Goal = {
    face:Face.B,
    text:'goalB3',
    hint:'hintB3',
    value:2
}

const GoalB4: Goal = {
    face:Face.B,
    text:'goalB4',
    hint:'hintB4',
    value:2
}

const GoalB5: Goal = {
    face:Face.B,
    text:'goalB5',
    hint:'hintB5',
    value:2
}

const GoalB6: Goal = {
    face:Face.B,
    text:'goalB6',
    hint:'hintB6',
    value:2
}

const GoalB7: Goal = {
    face:Face.B,
    text:'goalB7',
    hint:'hintB7',
    value:2
}

const GoalB8: Goal = {
    face:Face.B,
    text:'goalB8',
    hint:'hintB8',
    value:2
}

const GoalB9: Goal = {
    face:Face.B,
    text:'goalB9',
    hint:'hintB9',
    value:2
}

const SunGoalsArray: Goal[] = [GoalA1,GoalA2,GoalA3,GoalA4,GoalA5,GoalA6,GoalA7,GoalA8,GoalA9]
const MoonGoalsArray: Goal[] = [GoalB1,GoalB2,GoalB3,GoalB4,GoalB5,GoalB6,GoalB7,GoalB8,GoalB9]

export function getGoalsArray(isExpert:boolean):Goal[]{
    if (isExpert){
        return SunGoalsArray.concat(MoonGoalsArray)
    } else {
        return SunGoalsArray
    }
}