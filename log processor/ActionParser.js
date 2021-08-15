var action = require('./ActionTypes');

const LEFT_MOUSE_DOWN = 'Left Mouse Down';
const RIGHT_MOUSE_DOWN = 'Right Mouse Down';
const MIDDLE_MOUSE_DOWN = 'Middle Mouse Down';
const LEFT_MOUSE_UP = 'Left Mouse Up';
const RIGHT_MOUSE_UP = 'Right Mouse Up';
const MIDDLE_MOUSE_UP = 'Middle Mouse Up';
const DEFAULT_MOUSE_DOWN = 'Mouse Down';
const DEFAULT_MOUSE_UP = 'Mouse Up';
const MOUSE_MOVE = 'Mouse Move';

var checkMouseButton = (mousedown, mouseup) => {
    if (mousedown.type === LEFT_MOUSE_DOWN && mouseup.type === LEFT_MOUSE_UP) return true;
    else if (mousedown.type === RIGHT_MOUSE_DOWN && mouseup.type === RIGHT_MOUSE_UP) return true;
    else if (mousedown.type === MIDDLE_MOUSE_DOWN && mouseup.type === MIDDLE_MOUSE_UP) return true;
    else if (mousedown.type === DEFAULT_MOUSE_DOWN && mouseup.type === DEFAULT_MOUSE_UP) return true;
    else return false;
}

module.exports.cursorEventParser = (logs) => {

    var newLogs = [];

    logs = logs.filter((log) => {
        if (!log.hasOwnProperty('events') || log.events.length === 0) return false;
        else return true;
    });

    logs.forEach((log) => {
        var parsedLog = {
            user_id: log.user_id,
            keystroke: [],
            point: [],
            click: [],
            pointAndClick: [],
            dragAndDrop: []
        };

        for (let i = 0; i < log.events.length; i++) {
            if (log.events[i].type === MOUSE_MOVE) 
                parsedLog.point.push(log.events[i]);
            
            else if (log.events[i].type.includes('Down')) {
                if (log.events[i+1] !== undefined && log.events[i+1].type.includes('Up') 
                    && checkMouseButton(log.events[i], log.events[i+1])) {

                    parsedLog.click.push([log.events[i], log.events[i+1]]);

                    if (log.events[i-1].type === MOUSE_MOVE && log.events[i].timestamp - log.events[i-1].timestamp <= 4) 
                        parsedLog.pointAndClick.push([log.events[i-1], log.events[i], log.events[i+1]]);
                }

                else if (log.events[i+1] !== undefined) {
                    let newAction = [log.events[i]];
                    for (let j = i+1; j < log.events.length; j++) {
                        if (log.events[j].type === MOUSE_MOVE) newAction.push(log.events[j]);
                        else if (log.events[j].type.includes('Up') && checkMouseButton(log.events[i], log.events[j])) {
                            newAction.push(log.events[j]);
                            break;
                        }
                    }
                    parsedLog.dragAndDrop.push(newAction);
                }
            }
        }

        newLogs.push(parsedLog);
    });
    return newLogs;
}

module.exports.actionProcessor = (log, eventThreshold) => {
    var processedLog = {
        processedKeystroke: [],
        processedPoint: [],
        processedClick: [],
        processedPointAndClick: [],
        processedDragAndDrop: []
    }

    for (let i = 0; i < log.point.length; i += eventThreshold - 1) {
        if (i + eventThreshold >= log.point.length) {
            processedLog.processedPoint.push(action.Point(log.point.slice(i)));
            break;
        }
        processedLog.processedPoint.push(action.Point(log.point.slice(i, i + eventThreshold)));
    }

    log.click.forEach((log) => {
        processedLog.processedClick.push(action.Click(log[0], log[1]));
    });

    log.pointAndClick.forEach((log) => {
        processedLog.processedPointAndClick.push(action.PointAndClick(log));
    });

    log.dragAndDrop.forEach((log) => {
        processedLog.processedDragAndDrop.push(action.DragAndDrop(log));
    });

    return processedLog;
}