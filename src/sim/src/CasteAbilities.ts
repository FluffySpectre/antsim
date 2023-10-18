class CasteAbilityLevel {
    speed: number;
    rotationSpeed: number;
    load: number;
    range: number;
    viewRange: number;
    vitality: number;
    attack: number;
}

class CasteAbilities {
    private offset = -1;
    private abilities: CasteAbilityLevel[];

    constructor() {
        this.abilities = [new CasteAbilityLevel(), new CasteAbilityLevel(), new CasteAbilityLevel(), new CasteAbilityLevel()];
        this.abilities[0].speed = 2;
        this.abilities[0].rotationSpeed = 4;
        this.abilities[0].load = 4;
        this.abilities[0].range = 1800;
        this.abilities[0].viewRange = 20;
        this.abilities[0].vitality = 50;
        this.abilities[0].attack = 0;

        this.abilities[1].speed = 3;
        this.abilities[1].rotationSpeed = 8;
        this.abilities[1].load = 5;
        this.abilities[1].range = 2250;
        this.abilities[1].viewRange = 40;
        this.abilities[1].vitality = 100;
        this.abilities[1].attack = 2;

        this.abilities[2].speed = 4;
        this.abilities[2].rotationSpeed = 16;
        this.abilities[2].load = 7;
        this.abilities[2].range = 3400;
        this.abilities[2].viewRange = 80;
        this.abilities[2].vitality = 175;
        this.abilities[2].attack = 4;

        this.abilities[3].speed = 5;
        this.abilities[3].rotationSpeed = 24;
        this.abilities[3].load = 10;
        this.abilities[3].range = 4500;
        this.abilities[3].viewRange = 120;
        this.abilities[3].vitality = 250;
        this.abilities[3].attack = 8;
    }

    minIndex() {
        return this.offset;
    }

    maxIndex() {
        return this.offset + this.abilities.length-1;
    }

    get(index: number): CasteAbilityLevel {
        if (!Number.isSafeInteger(index) || index < this.offset || index > this.maxIndex()) {
            if (index !== undefined)
                console.error('Caste ability level invalid! Got: ' + index + '. Allowed are: -1, 0, 1, 2');
            return this.abilities[0];
        }
        return this.abilities[index - this.offset];
    }
}
