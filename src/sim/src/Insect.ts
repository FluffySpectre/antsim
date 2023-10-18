/// <reference path="Coordinate.ts"/>

class Insect extends Coordinate {
    colony: Colony;
    casteIndex: number;
    remainingDistance: number;
    remainingRotation: number;
    reached: boolean;
    traveledDistance: number;
    currentSpeed: number;
    carriedFruit: Fruit;
    debugMessage: string;
    smelledMarker: Marker[];
    colour: string;
    colonyCount: number;
    casteCount: number;
    bugCount: number;

    constructor() {
        super(0, 0, 0);
    }

    init(colony: Colony, availableInsects: {[key: string]: number}) {
        this.colony = colony;
        this.colour = '#222';

        this.casteIndex = 0;
        this.remainingDistance = 0;
        this.remainingRotation = 0;
        this.target = null;
        this.reached = false;
        this.traveledDistance = 0;
        this.vitality = this.maxVitality;
        this.currentSpeed = this.colony.castesSpeed[this.casteIndex];
        this.carriedFruit = null;
        this.currentLoad = 0;
        this.debugMessage = null;
        this.smelledMarker = [];
        this.colonyCount = 0;
        this.casteCount = 0;

        // if we got an anthill spawn there, otherwise at a random position on the map
        if (this.colony.antHill) {
            this.position = createVector(this.colony.antHill.position.x, this.colony.antHill.position.y);
            this.radius = 5;
        } else {
            this.position = createVector(random(0, width), random(0, height));
            this.radius = 5;
        }

        this.direction = random(0, 359);
    }

    // getter/setter
    get target() {
        return this.targetVal;
    }
    set target(value) {
        if (this.target === value && value !== null)
            return;
        this.targetVal = value;

        // TODO: find out why these two lines break the target movement
        // this.remainingRotation = 0;
        // this.remainingDistance = 0;
    }
    private targetVal: any;

    get currentLoad() {
        return this.currentLoadVal;
    }
    set currentLoad(value) {
        value = Math.floor(value);
        this.currentLoadVal = value >= 0 ? value : 0;
        this.currentSpeed = this.colony.castesSpeed[this.casteIndex];
        this.currentSpeed -= Math.floor(this.currentSpeed * this.currentLoad / this.colony.castesLoad[this.casteIndex] / 2);
    }
    private currentLoadVal: number;

    get maxLoad() {
        return this.colony.castesLoad[this.casteIndex];
    }

    get vitality() {
        return this.vitalityVal;
    }
    set vitality(value) {
        value = Math.floor(value);
        this.vitalityVal = value >= 0 ? value : 0;
    }
    private vitalityVal: number;

    get maxSpeed() {
        return this.colony.castesSpeed[this.casteIndex];
    }

    get rotationSpeed() {
        return this.colony.castesRotationSpeed[this.casteIndex];
    }

    get range() {
        return this.colony.castesRange[this.casteIndex];
    }

    get viewRange()  {
        return this.colony.castesViewRange[this.casteIndex];
    }

    get maxVitality() {
        return this.colony.castesVitality[this.casteIndex];
    }

    get attack() {
        if (this.currentLoad !== 0) return 0;
        return this.attackVal;
    }
    set attack(value) {
        value = Math.floor(value);
        this.attackVal = value >= 0 ? value : 0;
    }
    private attackVal: number;

    get caste() {
        return this.colony.castes[this.casteIndex].name;
    }

    get distanceToAntHill() {
        let d = Number.MAX_SAFE_INTEGER;
        if (this.colony.antHill) {
            let d2 = Coordinate.distanceMidPoints(this, this.colony.antHill);
            if (d2 < d) {
                d = d2;
            }
        }
        return d;
    }

    get antsInViewRange() {
        return this.colonyCount;
    }

    get antsFromSameCasteInViewRange() {
        return this.casteCount;
    }

    get bugsInViewRange() {
        return this.bugCount;
    }

    // sim functions
    move() {
        if (this.remainingRotation !== 0) {
            if (Math.abs(this.remainingRotation) < this.rotationSpeed) {
                this.direction += this.remainingRotation;
                this.remainingRotation = 0;
            }
            else if (this.remainingRotation >= this.rotationSpeed) {
                this.direction += this.rotationSpeed;
                this.remainingRotation = Coordinate.clampAngle(this.remainingRotation - this.rotationSpeed);
            }
            else if (this.remainingRotation <= -this.rotationSpeed) {
                this.direction -= this.rotationSpeed;
                this.remainingRotation = Coordinate.clampAngle(this.remainingRotation + this.rotationSpeed);
            }
        }
        else if (this.remainingDistance > 0) {
            if (!this.carriedFruit) {
                let steps = Math.min(this.remainingDistance, this.currentSpeed);
                this.remainingDistance -= steps;
                this.traveledDistance += steps;

                this.position.x += steps * Math.cos(this.direction * Math.PI / 180.0);
                this.position.y += steps * Math.sin(this.direction * Math.PI / 180.0);
            }
        }
        else if (this.target !== null) {
            let d = Coordinate.distanceMidPoints(this, this.target);
            this.reached = d <= 5;
            if (!this.reached) {
                let dir = Coordinate.directionAngle(this, this.target);
                if (d < this.viewRange || this.carriedFruit) {
                    this.remainingDistance = d;
                }
                else {
                    dir += random(-10, 10);
                    this.remainingDistance = this.viewRange;
                }
                this.turnToDirection(dir);
            }
        }

        if (this.position.x < 0) {
            this.position.x = -this.position.x;
            if (this.direction > 90 && this.direction <= 180)
                this.direction = 180 - this.direction;
            else if (this.direction > 180 && this.direction < 270)
                this.direction = 540 - this.direction;
        }
        else if (this.position.x > width) {
            this.position.x = width;
            if (this.direction >= 0 && this.direction < 90)
                this.direction = 180 - this.direction;
            else if (this.direction > 270 && this.direction < 360)
                this.direction = 540 - this.direction;
        }
        if (this.position.y < 0) {
            this.position.y = -this.position.y;
            this.direction = 360 - this.direction;
        }
        else {
            if (this.position.y <= height)
                return;
            this.position.y = height;
            if (this.direction <= 0 || this.direction >= 180)
                return;
            this.direction = 360 - this.direction;
        }
    }

    // player commands
    // moving
    goForward(distance: number) {
        if (!distance || Number(distance) === NaN) distance = Number.MAX_SAFE_INTEGER;
        this.remainingDistance = distance;
    }
    goToTarget(target: any) {
        this.target = target;
    }
    goAwayFromTarget(target: any, distance: number) {
        this.turnToDirection(Coordinate.directionAngle(this, target) + 180);
        this.goForward(distance);
    }
    goHome() {
        this.goToTarget(this.colony.antHill);
    }
    stop() {
        this.target = null;
        this.remainingDistance = 0;
        this.remainingRotation = 0;
    }
    // turning
    turnByDegrees(angle: number) {
        this.remainingRotation = Coordinate.clampAngle(angle);
    }
    turnToTarget(target: any) {
        if (!target || !target) return;
        this.remainingRotation = Coordinate.clampAngle(Coordinate.directionAngle(this, target) - this.direction);
    }
    turnToDirection(direction: number) {
        this.remainingRotation = Coordinate.clampAngle(direction - this.direction);
    }
    turnAround() {
        if (this.remainingRotation > 0) this.remainingRotation = 180;
        else this.remainingRotation = -180;
    }
    // food
    take(food: Food) {
        if (food instanceof Sugar) {
            if (Coordinate.distanceMidPoints(this, food) <= 5) {
                let num = Math.min(this.maxLoad - this.currentLoad, food.amount);
                this.currentLoad += num;
                food.amount -= num;
            }
        } else if (food instanceof Fruit) {
            if (this.carriedFruit === food)
                return;
            if (this.carriedFruit)
                this.drop();
            if (Coordinate.distanceMidPoints(this, food) > 5)
                return;
            this.stop();
            this.carriedFruit = food;
            food.carriers.push(this);
            this.currentLoad = this.maxLoad;
        }
    }
    drop() {
        this.currentLoad = 0;
        this.target = null;
        if (!this.carriedFruit)
            return;
        let ci = this.carriedFruit.carriers.indexOf(this);
        if (ci > -1)
            this.carriedFruit.carriers.splice(ci, 1);
        this.carriedFruit = null;
    }
    needsCarriers(fruit: Fruit) {
        return fruit.needsCarriers(this.colony);
    }
    // fighting
    attackTarget(insect: Insect) {
        this.target = insect;
    }
    // marker
    setMarker(information: number, spread: number) {
        if (!spread || Number(spread) === NaN || spread < 0)
            spread = 0;
        let coord = this.copy();
        let m = new Marker(coord.position.x, coord.position.y, spread);
        m.information = information;
        this.colony.newMarker.push(m);
        this.smelledMarker.push(m);
    }
    //debug
    think(message: string) {
        if (message)
            this.debugMessage = message.length > 100 ? message.substr(0, 100) : message;
        else 
            this.debugMessage = null;
    }
}