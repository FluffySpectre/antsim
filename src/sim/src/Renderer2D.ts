class Renderer2D implements Renderer {
    constructor(canvasWidth: number, canvasHeight: number) {
        const cnv = createCanvas(canvasWidth, canvasHeight, P2D);
        cnv.style('display', 'block');
    }

    render(state: SimState) {
        background(245, 222, 179);

        translate(-width/2, -height/2);

        // render ants
        for (const antState of state.colonyState.antStates) {
            push();
            translate(antState.positionX, antState.positionY);
    
            if (antState.debugMessage) {
                fill(20);
                textSize(12);
                let tw = textWidth(antState.debugMessage);
                text(antState.debugMessage, -tw / 2, -14);
            }
    
            if (SimSettings.displayDebugLabels) {
                noStroke();
                fill(20, 15);
                ellipse(0, 0, antState.viewRange*2);
            }
    
            rotate(antState.direction);
            noStroke();
            fill(antState.colour);
            rect(-3, -1.5, 6, 3);
    
            if (antState.loadType === LoadType.Sugar) {
                fill(250);
                rect(-2.5, -2.5, 5, 5);
            }
    
            pop();
        }

        // render bugs
        for (const bugState of state.bugStates) {
            push();
            translate(bugState.positionX, bugState.positionY);
    
            rotate(bugState.direction);
            noStroke();
            fill(bugState.colour);
            rect(-4, -2.5, 8, 5);
    
            pop();
        }

        // render sugar
        for (const sugarState of state.sugarStates) {
            push();
            translate(sugarState.positionX, sugarState.positionY);

            stroke(100);
            fill(250);
            ellipse(0, 0, sugarState.radius * 2);

            pop();
        }

        // render apples
        for (const fruitState of state.fruitStates) {
            push();
            translate(fruitState.positionX, fruitState.positionY);

            stroke(100);
            fill(10, 230, 10);
            ellipse(0, 0, fruitState.radius * 2);
    
            if (SimSettings.displayDebugLabels && fruitState.carriers > 0) {
                fill(20);
                textSize(12);
                let tw = textWidth(fruitState.carriers.toString());
                text(fruitState.carriers.toString(), -(tw / 2), -14);
            }

            pop();
        }

        // render the anthill
        push();

        translate(state.colonyState.antHillState.positionX, state.colonyState.antHillState.positionY);

        stroke(100);
        fill(222, 184, 135, 255);
        ellipse(0, 0, state.colonyState.antHillState.radius*2, state.colonyState.antHillState.radius*2);
        
        pop();

        // render marker
        for (const markerState of state.colonyState.markerStates) {
            push();
            translate(markerState.positionX, markerState.positionY);

            noStroke();
            fill(240, 240, 10, map(markerState.age, 0, markerState.maxAge, 128, 0));
            ellipse(0, 0, markerState.radius*2);

            pop();
        }

        // render ui
        if (SimSettings.displayDebugLabels) {
            fill(20);
            textSize(12);
            text('FPS: ' + Math.floor(frameRate()), 10, 20);
            text('Round: ' + environment.currentRound, 10, 36);
        }
    }
}
