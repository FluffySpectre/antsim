/// <reference path="Insect.ts"/>

class Bug extends Insect {
    init(colony: Colony, availableInsects: {[key: string]: number}) {
        super.init(colony, availableInsects);

        this.radius = 6;
        this.vitality = colony.castesVitality[0];
        this.currentSpeed = colony.castesSpeed[0];
        this.attack = colony.castesAttack[0];
        this.colour = 'blue';
    }

    getState(): BugState {
        return { 
            positionX: this.position.x,
            positionY: this.position.y,
            direction: this.direction,
            radius: this.radius,
            vitality: this.vitality,
            colour: this.colour
        };
    }
}
