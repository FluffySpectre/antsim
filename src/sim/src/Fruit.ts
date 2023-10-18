class Fruit extends Food {
    carriers: Insect[];

    constructor(x: number, y: number, amount: number) {
        super(x, y, amount);

        this.carriers = [];
    }

    get amount() {
        return this.amountVal;
    }

    set amount(val) {
        this.amountVal = val;
        this.radius = Math.floor((SimSettings.fruitRadiusMultiplier * Math.sqrt(this.amount / Math.PI)));
    }

    needsCarriers(colony: Colony) {
        let num = 0;
        for (let a of this.carriers) {
            if (a.colony === colony)
                num += a.currentLoad;
        }
        return num * SimSettings.fruitLoadMultiplier < this.amount;
    }

    getState(): FruitState {
        return { 
            positionX: this.position.x,
            positionY: this.position.y,
            amount: this.amount,
            radius: this.radius,
            carriers: this.carriers.length
        };
    }
}