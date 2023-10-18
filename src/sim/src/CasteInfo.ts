class CasteInfo {
    name: string;
    color: string;
    speed: number = 0;
    rotationSpeed: number = 0;
    load: number = 0;
    range: number = 0;
    viewRange: number = 0;
    vitality: number = 0;
    attack: number = 0;

    static fromObject(obj: any) {
        let ci = new CasteInfo();
        ci.name = obj.name || '';
        ci.color = obj.color || null;
        ci.speed = Number.isInteger(obj.speed) ? obj.speed : 0;
        ci.rotationSpeed = Number.isInteger(obj.rotationSpeed) ? obj.rotationSpeed : 0;
        ci.load = Number.isInteger(obj.load) ? obj.load : 0;
        ci.range = Number.isInteger(obj.range) ? obj.range : 0;
        ci.viewRange = Number.isInteger(obj.viewRange) ? obj.viewRange : 0;
        ci.vitality = Number.isInteger(obj.vitality) ? obj.vitality : 0;
        ci.attack = Number.isInteger(obj.attack) ? obj.attack : 0;
        return ci;
    }

    getState(): CasteState {
        return {
            name: this.name,
            color: this.color,
            speed: this.speed,
            rotationSpeed: this.rotationSpeed,
            load: this.load,
            range: this.range,
            viewRange: this.viewRange,
            vitality: this.vitality,
            attack: this.attack
        };
    }
}