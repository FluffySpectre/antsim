class Marker extends Coordinate {
    information: number;
    private age: number = 0;
    private maxAge: number;
    private spread: number;

    constructor(x: number, y: number, spread: number) {
        super(x, y, 0);

        this.maxAge = SimSettings.markerMaximumAge;
        if (spread < 0) {
            spread = 0;
        }
        else {
            if (spread > SimSettings.markerRangeMaximum)
                spread = SimSettings.markerRangeMaximum;
            this.maxAge = this.maxAge * SimSettings.markerSizeMinimum / (SimSettings.markerSizeMinimum + spread);
        }
        this.spread = spread;
        this.update();
    }

    get isActive() {
        return this.age < this.maxAge;
    }

    update() {
        this.age++;
        this.radius = SimSettings.markerSizeMinimum;
        this.radius += this.spread * this.age / this.maxAge;
    }

    getState(): MarkerState {
        return { 
            positionX: this.position.x,
            positionY: this.position.y,
            radius: this.radius,
            direction: this.direction,
            age: this.age,
            maxAge: this.maxAge
        };
    }
}