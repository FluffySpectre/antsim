class Sugar extends Food {
    constructor(x: number, y: number, amount: number) {
        super(x, y, amount);
    }

    getState(): SugarState {
        return {
            positionX: this.position.x,
            positionY: this.position.y,
            radius: this.radius,
            amount: this.amount
        };
    }
}