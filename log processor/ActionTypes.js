const MOUSE = 'Mouse';

var roundedResult = (num) => {
    return Math.round((num + Number.EPSILON) * 10)/10;
}

var distance = (pointA, pointB) => {
    return roundedResult(Math.sqrt(Math.pow(pointA.cor_X - pointB.cor_X, 2) + Math.pow(pointA.cor_Y - pointB.cor_Y, 2)));
}

var total_distance = (events) => {
    let result = 0;
    for(let i = 0; i < events.length - 1; i++) {
        result += distance(events[i], events[i+1]);
    }
    return result;
}

var getVirtualKey = (record) => {
    if(record.type.includes('Up')) {
        return record.type.substring(0, record.type.length - 3);
    }
    else if(record.type.includes('Down')) {
        return record.type.substring(0, record.type.length - 5);
    }
    else {
        return MOUSE;
    }
}

var angle_trunc = (angle) => {
    while (angle < 0.0) 
        angle += Math.PI * 2;
    return angle;
}

var getDisplacementAngle = (eventA, eventB) => {
    var deltaX = eventA.cor_X - eventB.cor_X;
    var deltaY = eventA.cor_Y - eventB.cor_Y;
    return roundedResult(angle_trunc(Math.atan(deltaY/deltaX)));
}

module.exports.Keystroke = (keyHold, keyRelease) => {
    return {
        duration: keyRelease.timestamp - keyHold.timestamp,
        distance: 0,
        displacement: 0,
        displacement_angle: 0,
        average_speed: 0,
        move_efficiency: 0,
        virtual_key: MOUSE,
        timing_entropy: 0
    }
}

module.exports.Point = (events) => {
    var action = {
        duration: events[events.length - 1].timestamp - events[0].timestamp,
        distance: total_distance(events),
        displacement: distance(events[0], events[events.length - 1]),
        displacement_angle: getDisplacementAngle(events[0], events[events.length - 1]),
        virtual_key: MOUSE,
        timing_entropy: 0
    }
    action.average_speed = roundedResult(action.distance/action.duration);
    action.move_efficiency = roundedResult(action.displacement/action.duration);
    return action;
}

module.exports.Click = (mouseDown, mouseUp) => {
    return {
        duration: mouseUp.timestamp - mouseDown.timestamp,
        distance: 0,
        displacement: 0,
        displacement_angle: 0,
        average_speed: 0,
        move_efficiency: 0,
        virtual_key: getVirtualKey(mouseDown),
        timing_entropy: 0
    }
}

module.exports.PointAndClick = (events) => {
    var action = {
        duration: events[events.length - 1].timestamp - events[0].timestamp,
        distance: total_distance(events),
        displacement: distance(events[0], events[events.length - 1]),
        displacement_angle: getDisplacementAngle(events[0], events[events.length - 1]),
        virtual_key: getVirtualKey(events[events.length - 1]),
        timing_entropy: 0
    }
    action.average_speed = roundedResult(action.distance/action.duration);
    action.move_efficiency = roundedResult(action.displacement/action.duration);
    return action;
}

module.exports.DragAndDrop = (events) => {
    var action = {
        duration: events[events.length - 1].timestamp - events[0].timestamp,
        distance: total_distance(events),
        displacement: distance(events[0], events[events.length - 1]),
        displacement_angle: getDisplacementAngle(events[0], events[events.length - 1]),
        virtual_key: getVirtualKey(events[events.length - 1]),
        timing_entropy: 0
    }
    action.average_speed = roundedResult(action.distance/action.duration);
    action.move_efficiency = roundedResult(action.displacement/action.duration);
    return action;
}