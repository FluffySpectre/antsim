var PLAYER_INFO = {
    name: 'Björn Bosse',
    colonyName: 'Collector Ants',
    castes: [
        { name: 'collector', color: '#222', speed: -1, rotationSpeed: 0, load: 2, range: 1, viewRange: 0, vitality: -1, attack: -1 },
        { name: 'scout', color: '#FF851B', speed: 2, rotationSpeed: -1, load: -1, range: 0, viewRange: 2, vitality: -1, attack: -1 }
    ]
};

class PlayerAnt extends BaseAnt {
    determineCaste(availableInsects) {
        if (availableInsects['scout'] < 5)
            return 'scout';
        else 
            return 'collector';
    }

    waits() {
        this.turnByDegrees(RandomNumber.number(-45, 45));
        this.goForward(this.viewRange*2);
    }
    
    spotsSugar(sugar) {
        if (this.currentLoad > 0) return;

        this.setMarker(1000, 80);
        this.goToTarget(sugar);
    }
    
    spotsFruit(fruit) {
        if (this.currentLoad > 0 || !this.needsCarriers(fruit)) return;

        this.setMarker(1000, 80);
        this.goToTarget(fruit);
    }
    
    spotsBug(bug) {
        if (Coordinate.distance(this, bug) < 25) {
            this.drop();
            this.goAwayFromTarget(bug, 50);
        }
    }

    smellsFriend(marker) {
        if (this.caste === 'scout' || this.target) return;
        
        if (marker.information === 1000) {
            this.goToTarget(marker);
        } else {
            this.turnToDirection(marker.information);
            this.goForward(this.viewRange * 2);
        }
    }
    
    sugarReached(sugar) {
        if (this.caste === 'collector') {
            this.take(sugar);
            this.goHome();
        }
    }
    
    fruitReached(fruit) {
        if (this.caste === 'collector' && this.needsCarriers(fruit)) {
            this.take(fruit);
            this.goHome();
        }
    }

    becomesTired() {
        this.goHome();
    }

    tick() {
        if (!this.target || this.currentLoad <= 0)
            return;
        this.setMarker(Coordinate.directionAngle(this, this.target) - 180, 25);
    }
}
