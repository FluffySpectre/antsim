/// <reference path="Insect.ts"/>

class BaseAnt extends Insect {
    isTired: boolean;
    name: string;

    init(colony: Colony, availableInsects: {[key: string]: number}) {
        super.init(colony, availableInsects);
    
        let cIndex = -1;
        let antCast = '';
        if (availableInsects) {
            antCast = this.determineCaste(availableInsects);
            for (let i=0; i<colony.castes.length; i++) {
                let cast = colony.castes[i];
                if (cast.name === antCast) {
                    cIndex = i;
                    this.colour = cast.color || this.colour;
                    break;
                }
            }
        }
        if (cIndex > -1) {
            this.casteIndex = cIndex;
            // console.log('Cast set to: ' + colony.castes[this.casteIndex].name);
        } else {
            if (colony.castes[0].name) // no error for default caste
                console.error('Caste not exists: ' + antCast + '. Using default instead.');

            this.casteIndex = 0;
        }

        this.isTired = false;
        this.name = random(SimSettings.antNames);
        this.vitality = colony.castesVitality[this.casteIndex];
        this.currentSpeed = colony.castesSpeed[this.casteIndex];
        this.attack = colony.castesAttack[this.casteIndex];
    }

    determineCaste(availableInsects: {[key: string]: number}): string { 
        return ''; 
    }

    // player events
    waits() { }
    spotsSugar(sugar: Sugar) { }
    spotsFruit(fruit: Fruit) { }
    spotsBug(bug: Bug) { }
    spotsFriend(ant: BaseAnt) { }
    smellsFriend(marker: Marker) { }
    sugarReached(sugar: Sugar) { }
    fruitReached(fruit: Fruit) { }
    becomesTired() { }
    underAttack(bug: Bug) { }
    hasDied(death: string) { }
    tick() { }

    getState(): AntState {
        let targetType = TargetType.None;
        switch (true) {
            case this.target instanceof Sugar:
                targetType = TargetType.Sugar;
                break;
            case this.target instanceof Fruit:
                targetType = TargetType.Fruit;
                break;
            case this.target instanceof Bug:
                targetType = TargetType.Bug;
                break;
            case this.target instanceof AntHill:
                targetType = TargetType.Anthill;
                break;
            case this.target instanceof Marker:
                targetType = TargetType.Marker;
                break;
        }
        return {
            casteIndex: this.casteIndex,
            positionX: this.position.x,
            positionY: this.position.y,
            radius: this.radius,
            direction: this.direction,
            colour: this.colour,
            targetPositionX: this.target ? this.target.position.x : -1,
            targetPositionY: this.target ? this.target.position.y : -1,
            targetType: targetType,
            vitality: this.vitality,
            load: this.currentLoad,
            loadType: !this.carriedFruit && this.currentLoad <= 0 ? LoadType.None : this.carriedFruit ? LoadType.Fruit : LoadType.Sugar,
            viewRange: this.viewRange,
            debugMessage: this.debugMessage
        };
    }
}