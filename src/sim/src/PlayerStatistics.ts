class PlayerStatistics {
    starvedAnts: number;
    eatenAnts: number;
    collectedFood: number;
    killedBugs: number;

    constructor() {
        this.starvedAnts = 0;
        this.eatenAnts = 0;
        this.collectedFood = 0;
        this.killedBugs = 0;
    }

    get points() {
        return Math.max(Math.floor((SimSettings.pointsForFood * this.collectedFood + SimSettings.pointsForStarvedAnts * this.starvedAnts + SimSettings.pointsForEatenAnts * this.eatenAnts + SimSettings.pointsForKilledBugs * this.killedBugs)), 0);
    }

    get totalDeadAnts() {
        return this.starvedAnts + this.eatenAnts;
    }
}