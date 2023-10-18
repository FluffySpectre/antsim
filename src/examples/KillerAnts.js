var PLAYER_INFO = {
    name: 'Björn Bosse',
    colonyName: 'Killer Ants',
    castes: [
        { name: 'killer', color: 'red', speed: -1, rotationSpeed: -1, load: -1, range: -1, viewRange: 0, vitality: 2, attack: 2 }
    ]
};

class PlayerAnt extends BaseAnt {
    determineCaste(availableInsects) {
        return 'killer';
    }

    waits() {
        this.goForward(40);
        this.turnByDegrees(RandomNumber.number(-10, 10));
    }
    
    spotsBug(bug) {
        this.setMarker(0, 150);
        this.attackTarget(bug);
    }

    smellsFriend(marker) {
        if (!this.target)
            this.goToTarget(marker);
    }

    becomesTired() {
        this.goHome();
    }

    tick() {
        if (this.range - this.traveledDistance - 100 < this.distanceToAntHill)
            this.goHome();
        if (this.vitality >= this.maxVitality * 2 / 3)
            return;
        this.goHome();
    }
}
