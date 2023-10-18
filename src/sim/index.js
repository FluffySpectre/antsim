var simState = 'playing';

function pauseSim() {
    window.postMessage({ type: 'pause' }, '*');

    simState = 'paused';
    updatePlayPauseButtons();
}

function playSim() {
    window.postMessage({ type: 'play' }, '*');

    simState = 'playing';
    updatePlayPauseButtons();
}

function stepSim() {
    window.postMessage({ type: 'step' }, '*');

    simState = 'paused';
    updatePlayPauseButtons();
}

function restartSim() {
    window.postMessage({ type: 'restart' }, '*');

    simState = 'playing';
    updatePlayPauseButtons();
}

function updatePlayPauseButtons() {
    document.getElementById('pauseButton').style.display = simState === 'playing' ? 'block' : 'none';
    document.getElementById('playButton').style.display = simState === 'paused' ? 'block' : 'none';
    document.getElementById('restartButton').style.display = simState === 'ended' ? 'block' : 'none';
    document.getElementById('stepButton').style.display = simState === 'ended' ? 'none' : 'block';
}

function simSpeedChanged(simSpeed) {
    window.postMessage({ type: 'simSpeedChanged', param: simSpeed }, '*');
}

function rendererChanged(renderer) {
    window.postMessage({ type: 'rendererChanged', param: renderer }, '*');
}

function receiveMessage(event) {
    if (event.data.type === 'simEnded') {
        simState = 'ended';
        updatePlayPauseButtons();
    }
}

var geval = eval;

window.load = function (js) {
    var compileFailed = false;
    var compileErr = null;
    if (js) {
        try {
            geval(js);
        } catch (err) {
            console.error('[JS-ANTS_COMPILER]', err);
            compileFailed = true;
            compileErr = err;
        }
    }

    setTimeout(function () {
        if (!compileFailed) {
            window.postMessage({ type: 'playerCodeLoaded', param: PLAYER_INFO }, '*');
            
            // display the sim speed controls
            document.getElementById('simSpeedPanel').style.visibility = 'visible';
        } else {
            window.postMessage({ type: 'playerCodeError', param: compileErr }, '*');
        }
    }, 1000);
};

window.addEventListener('message', receiveMessage, false);

if (receivedJS) {
    window.load(receivedJS);
}
