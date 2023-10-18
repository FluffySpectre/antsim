var PLAYER_INFO = {
    name: 'Björn Bosse',
    colonyName: 'Group Ants',
    castes: [
        { name: 'default', color: 'black', speed: 0, rotationSpeed: 0, load: 0, range: 0, viewRange: 0, vitality: 0, attack: 0 },
    ]
};

class PlayerAnt extends BaseAnt {
    constructor() {
        super();

        this.isAtGroup = false;
        this.group = PlayerAnt.totalAnts >= 100 ? PlayerAnt.totalAnts % 10 : PlayerAnt.totalAnts / 10;
        
        PlayerAnt.totalAnts++;
    }

    determineCaste(availableInsects) {
        return 'default';
    }

    waits() {
        if (PlayerAnt.groupLeader[this.group] != this)
            return;
        if (this.isTired || this.vitality < this.maxVitality / 2)
            this.goHome();
        else
            this.goForward();
    }

    spotsSugar(sugar) {
        if (PlayerAnt.groupLeader[this.group] != this || (this.target && !(this.target instanceof Insect)))
            return;
        this.goToTarget(sugar);
    }

    sugarReached(sugar) {
        this.take(sugar);
        this.goHome();
    }

    tick() {
        if (!PlayerAnt.groupLeader[this.group] || PlayerAnt.groupLeader[this.group].vitality <= 0)
            PlayerAnt.groupLeader[this.group] = this;
        if (PlayerAnt.groupLeader[this.group] === this) {
            if (this.isAtGroup)
                return;
            this.stop();
            this.isAtGroup = true;
        }
        else {
            if (this.target instanceof Insect && this.target.vitality <= 0)
                this.stop();
            if (this.target)
                return;
            if (PlayerAnt.groupLeader[this.group].target instanceof Insect) {
                this.drop();
                // this.attack(PlayerAnt.groupLeader[this.group].target);
            }
            else if (PlayerAnt.groupLeader[this.group].carriedFruit)
                this.goToTarget(PlayerAnt.groupLeader[this.group].carriedFruit);
            else if (PlayerAnt.groupLeader[this.group].target instanceof Food) {
                this.goToTarget(PlayerAnt.groupLeader[this.group].target);
            }
            else {
                let d = Coordinate.distance(this.coordinate, PlayerAnt.groupLeader[this.group].coordinate);
                if (this.isAtGroup && d > 64)
                    this.isAtGroup = false;
                if (!this.isAtGroup && d < 16)
                    this.isAtGroup = true;
                if (!this.isAtGroup) {
                    this.turnToDirection(Coordinate.directionAngle(this.coordinate, PlayerAnt.groupLeader[this.group].coordinate));
                    this.goForward(d);
                    PlayerAnt.groupLeader[this.group].isAtGroup = false;
                }
                else {
                    let remRotation = this.remainingRotation;
                    this.turnToDirection(PlayerAnt.groupLeader[this.group].coordinate.direction);
                    if (d < 32 && Math.abs(this.remainingRotation) > 135)
                    this.turnByDegrees(remRotation);
                    this.goForward(PlayerAnt.groupLeader[this.group].remainingDistance);
                }
            }
        }
    }
}
PlayerAnt.totalAnts = 0;
PlayerAnt.groupLeader = new Array(10);