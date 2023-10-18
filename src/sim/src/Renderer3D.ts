class Renderer3D implements Renderer {
    private models: Array<p5.Geometry>;
    private cam: p5.Camera;

    private textGraphics: p5.Graphics;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.loadModels();

        const cnv = createCanvas(canvasWidth, canvasHeight, WEBGL);
        // (cnv as any).drawingContext.disable((cnv as any).drawingContext.DEPTH_TEST);
        cnv.style('display', 'block');

        this.cam = createCamera();
        this.cam.setPosition(0, 0, 0);
        this.cam.move(0, -canvasWidth * 0.865, 0.001);
        this.cam.lookAt(0, 0, 0);

        // this.textGraphics = createGraphics(100, 60);
        // this.textGraphics.fill(0);
        // this.textGraphics.textAlign(CENTER);
        // this.textGraphics.textSize(16);
        // this.textGraphics.text('p5.js is cool!', 50, 30);
    }

    private loadModels() {
        // load model with normalise parameter set to true
        this.models = [];
        this.models.push(loadModel('assets/ant.obj', true));
        this.models.push(loadModel('assets/bug.obj', true));
        this.models.push(loadModel('assets/apple.obj', true));
        this.models.push(loadModel('assets/anthill.obj', true));
    }

    render(state: SimState) {
        background(50, 140, 193);

        blendMode(BLEND);

        // @ts-ignore
        orbitControl(2, 2, -0.05);

        rotateX(90);
        translate(-width/2, -height/2);

        ambientLight(100);
        directionalLight(200, 200, 200, createVector(-45, 90, 0));

        noStroke();
        push();
        translate(width/2, height/2, -0.1);
        fill(245, 222, 179);
        plane(width, height);
        pop();

        // render ants
        for (const antState of state.colonyState.antStates) {
            push();
            translate(antState.positionX, antState.positionY, 2.3);
    
            if (antState.debugMessage) {
                fill(20);
                textSize(12);
                let tw = textWidth(antState.debugMessage);
                text(antState.debugMessage, -tw / 2, -14);
            }
    
            if (SimSettings.displayDebugLabels) {
                push();
                translate(0, 0, 0.1);
                noStroke();
                fill(20, 15);
                ellipse(0, 0, antState.viewRange*2);
                pop();
            }
    
            rotateZ(antState.direction);
            noStroke();
            push();
            scale(0.04);
            rotateX(90);
            rotateY(180);
            fill(antState.colour);
            model(this.models[0]);
            pop();
    
            if (antState.loadType === LoadType.Sugar) {
                translate(0, 0, 3);
                fill(250);
                box(3, 3, 3);
            }
    
            pop();
        }

        // render bugs
        for (const bugState of state.bugStates) {
            push();
            translate(bugState.positionX, bugState.positionY, 3);

            rotateZ(bugState.direction);
            noStroke();

            scale(0.05);
            rotateX(90);
            rotateY(90);
            fill(bugState.colour);
            model(this.models[1]);

            pop();
        }

        // render sugar
        for (const sugarState of state.sugarStates) {
            push();
            translate(sugarState.positionX, sugarState.positionY, sugarState.radius / 2);

            noStroke();
            fill(250);
            rotateX(90);
            cone(sugarState.radius, sugarState.radius);

            pop();
        }

        // render apples
        for (const fruitState of state.fruitStates) {
            push();
            translate(fruitState.positionX, fruitState.positionY, fruitState.radius);

            noStroke()
            fill(10, 230, 10);

            push();
            scale(fruitState.radius * 0.01);
            rotateX(90);
            model(this.models[2]);
            pop();

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
        
        translate(state.colonyState.antHillState.positionX, state.colonyState.antHillState.positionY, state.colonyState.antHillState.radius / 2);

        noStroke();
        fill(222, 184, 135);

        scale(state.colonyState.antHillState.radius * 0.01);
        rotateX(90);
        model(this.models[3]);

        pop();

        // render marker
        for (const markerState of state.colonyState.markerStates) {
            push();
            translate(markerState.positionX, markerState.positionY);

            noStroke();
            fill(240, 240, 10, map(markerState.age, 0, markerState.maxAge, 128, 0));
            sphere(markerState.radius);
            pop();
        }

        // translate(width/2, height/2+50, 0.1);
        // texture(this.textGraphics);
        // plane(50, 30, 1, 1);
    }
}
