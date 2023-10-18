class Coordinate {
    radius: number;
    position: p5.Vector;
    private directionVal: number;

    constructor(x: number, y: number, radius: number) {
        this.radius = radius;
        this.direction = 0;
        this.position = createVector(x, y);
    }

    static withDeltas(c: Coordinate, deltaX: number, deltaY: number) {
        let result = new Coordinate(0, 0, c.radius);
        result.position.x = c.position.x + deltaX;
        result.position.y = c.position.y + deltaY;
        result.direction = c.direction;
        return result;
    }

    copy() {
        let copiedCoord = new Coordinate(this.position.x, this.position.y, this.radius);
        copiedCoord.direction = this.direction;
        return copiedCoord;
    }

    get direction() {
        return this.directionVal;
    }
    set direction(value) {
        this.directionVal = value;
        while (this.directionVal < 0)
            this.directionVal += 360;
        while (this.directionVal > 359)
            this.directionVal -= 360;
        this.directionVal = Math.floor(this.directionVal);
    }

    static distance(c1: Coordinate, c2: Coordinate) {
        let dist = c1.position.dist(c2.position) - c1.radius - c2.radius;
        dist = Math.floor(dist);
        if (dist < 0)
            return 0;
        return dist;
    }

    static distanceSqr(c1: Coordinate, c2: Coordinate) {
        let distSqr = c1.position.copy().sub(c2.position).magSq();
        if (distSqr < 0)
            return 0;
        return distSqr;
    }

    static distanceMidPoints(c1: Coordinate, c2: Coordinate) {
        let dist = c1.position.dist(c2.position);
        dist = Math.floor(dist);
        return dist;
    }

    static distanceMidPointsSqr(c1: Coordinate, c2: Coordinate) {
        let distSqr = c1.position.copy().sub(c2.position).magSq();
        if (distSqr < 0)
            return 0;
        return distSqr;
    }

    static directionAngle(c1: Coordinate, c2: Coordinate) {
        let num = p5.Vector.sub(c2.position, c1.position).heading();
        if (num < 0)
            num += 360;
        return Math.floor(num);
    }

    static clampAngle(angle: number) {
        while (angle > 180)
            angle -= 360;
        while (angle < -180)
            angle += 360;
        return angle;
    }
}