class Food extends Coordinate {
    constructor(x: number, y: number, amount: number) {
        super(x, y, 0);
        this.amount = amount;
    }

    amountVal: number;
    get amount() {
        return this.amountVal;
    }
    set amount(val) {
        this.amountVal = val;
        this.radius = Math.floor(Math.round(Math.sqrt(this.amount / Math.PI) * SimSettings.sugarRadiusMultiplier));
    }
}