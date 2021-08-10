const LEFT_MOUSE = 'Left mouse';
const RIGHT_MOUSE = 'Right mouse';
const MIDDLE_MOUSE = 'Middle mouse';
const KEY = 'Key';

var distance = (pointA, pointB) => {
    return Math.sqrt(Math.pow(pointA.cor_X - pointB.cor_X, 2) + Math.pow(pointA.cor_Y - pointB.cor_Y, 2));
}

var total_distance = (events) => {
    let result = 0;
    for(let i = 0; i < events.length - 1; i++) {
        result += distance(events[i], events[i+1]);
    }
    return result;
}

module.exports.Keystroke = (keyHold, keyRelease) => {
    return {
        duration: keyRelease.timestamp - keyHold.timestamp,
        distance: 0,
        displacement: 0,
        displacement_angle: 0,
        average_speed: 0,
        move_efficiency: 0,
        virtual_key: KEY,
        timing_entropy: 0
    }
}

module.exports.Point = (events) => {
    var action = {
        duration: events[events.length - 1].timestamp - events[0].timestamp,
        distance: Math.round(total_distance(events), 1),
        displacement: Math.round(distance(events[0], events[events.length - 1]), 1),
        displacement_angle: 0,
        virtual_key: KEY,
        timing_entropy: 0
    }
    action.average_speed = action.distance/action.duration;
    action.move_efficiency = action.displacement/action.duration;
    return action;
}

module.exports.Click = (mouseDown, mouseUp) => {

}

module.exports.PointAndClick = (events) => {

}

module.exports.DragAndDrop = (events) => {

}