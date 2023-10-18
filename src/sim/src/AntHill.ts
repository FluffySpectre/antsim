/// <reference path="Coordinate.ts"/>

class AntHill extends Coordinate {
    constructor(x: number, y: number, radius: number) {
        super(x, y, radius);
    }

    getState(): AntHillState {
        return {
            positionX: this.position.x,
            positionY: this.position.y,
            radius: this.radius
        };
    }
}
