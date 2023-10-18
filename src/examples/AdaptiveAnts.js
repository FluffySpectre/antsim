var PLAYER_INFO = {
    name: 'Björn Bosse',
    colonyName: 'Adaptive Ants',
    castes: [
        { name: 'collector1', color: 'black', speed: 2, rotationSpeed: -1, load: 2, range: -1, viewRange: 0, vitality: -1, attack: -1 },
        { name: 'collector2', color: 'black', speed: 1, rotationSpeed: -1, load: 2, range: -1, viewRange: 0, vitality: 0, attack: -1 },
        { name: 'collector3', color: 'black', speed: 0, rotationSpeed: -1, load: 2, range: -1, viewRange: 0, vitality: 1, attack: -1 },
        { name: 'collector4', color: 'black', speed: 0, rotationSpeed: -1, load: 2, range: -1, viewRange: -1, vitality: 2, attack: -1 },
        { name: 'soldier1', color: 'red', speed: -1, rotationSpeed: -1, load: -1, range: 0, viewRange: -1, vitality: 2, attack: 2 },
        { name: 'soldier2', color: 'red', speed: 0, rotationSpeed: 0, load: -1, range: 0, viewRange: -1, vitality: 1, attack: 1 },
        { name: 'soldier3', color: 'red', speed: 1, rotationSpeed: 0, load: -1, range: -1, viewRange: -1, vitality: 1, attack: 1 },
    ]
};

class PlayerAnt extends BaseAnt {
    constructor() {
        super();

        this.savedSugar = null;
        this.lastLoad = 0;
        this.targetWasInsect = false;
    }

    determineCaste(availableInsects) {
        PlayerAnt.createCollector = !PlayerAnt.createCollector;
        if (PlayerAnt.createCollector)
            return 'collector' + PlayerAnt.collectorType;
        return 'soldier' + PlayerAnt.soldierType;
    }

    waits() {
        if (!this.target && this.savedSugar)
            this.goToTarget(this.savedSugar);
        else
            this.goForward();
    }

    spotsSugar(sugar) {
        if (!this.savedSugar)
            this.savedSugar = sugar;
        //   this.setMarker(0, 60);

        console.log(this.caste);
        if (this.caste.indexOf('collector') === -1 || this.target)
            return;
        this.goToTarget(sugar);
    }

    spotsFruit(fruit) {
        if (!this.needsCarriers(fruit))
            return;
        // this.setMarker(Coordinate.directionAngle(this.coordinate, fruit.coordinate), Coordinate.distance(this.coordinate, fruit.coordinate));
        if (this.caste.indexOf('collector') === -1 || this.target)
            return;
        this.goToTarget(fruit);
    }

    sugarReached(sugar) {
        this.take(sugar);
        this.goHome();
    }

    fruitReached(fruit) {
        if (!this.needsCarriers(fruit))
            return;
        this.take(fruit);
        this.goHome();
    }

    spotsBug(bug) {
        // this.setMarker(0, 60);
        if (this.caste.indexOf('soldier') === -1 || this.target)
            return;
        this.attackTarget(bug);
    }

    hasDied(death) {
        if (death === 'starved')
            return;
        if (this.caste.indexOf('collector') > -1) {
            if (this.lastLoad <= 0)
                return;
            PlayerAnt.unsuccessfulCollectors++;
            PlayerAnt.updateCollectors();
        }
        else {
            PlayerAnt.unsuccessfulSoldiers++;
            PlayerAnt.updateSoldiers();
        }
    }

    tick() {
        if (this.caste.indexOf('collector') > -1) {
            if (this.lastLoad > 0 && this.currentLoad === 0) {
                PlayerAnt.successfulCollectors++;
                PlayerAnt.updateCollectors();
            }
            this.lastLoad = this.currentLoad;
        }
        else {
            if (this.targetWasInsect && !this.target) {
                PlayerAnt.successfulSoldiers++;
                PlayerAnt.updateSoldiers();
            }
            this.targetWasInsect = this.target instanceof Insect;
        }
    }
}
PlayerAnt.createCollector = false;
PlayerAnt.soldierType = 1;
PlayerAnt.collectorType = 1;
PlayerAnt.successfulSoldiers = 0;
PlayerAnt.successfulCollectors = 0;
PlayerAnt.unsuccessfulSoldiers = 0;
PlayerAnt.unsuccessfulCollectors = 0;
PlayerAnt.updateCollectors = () => {
    PlayerAnt.collectorType = 1 + Math.floor(Math.round(2.0 * PlayerAnt.unsuccessfulCollectors / (PlayerAnt.unsuccessfulCollectors + PlayerAnt.successfulCollectors)));
};
PlayerAnt.updateSoldiers = () => {
    PlayerAnt.soldierType = 1 + Math.floor(Math.round(2.0 * PlayerAnt.unsuccessfulSoldiers / (PlayerAnt.unsuccessfulSoldiers + PlayerAnt.successfulSoldiers)));
};
