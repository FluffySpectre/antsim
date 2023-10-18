enum LoadType {
    None,
    Sugar,
    Fruit
}

enum TargetType {
    None,
    Anthill,
    Bug,
    Sugar,
    Fruit,
    Marker
}

interface CasteState {
    name: string;
    color: string;
    speed: number;
    rotationSpeed: number;
    load: number;
    range: number;
    viewRange: number;
    vitality: number;
    attack: number;
}

interface AntHillState {
    positionX: number;
    positionY: number;
    radius: number;
}

interface ColonyState {
    antStates: AntState[];
    antHillState: AntHillState;
    markerStates: MarkerState[];
    casteStates: CasteState[];
    colonyName: string;
    playerName: string;
    starvedAnts: number;
    eatenAnts: number;
    collectedFood: number;
    killedBugs: number;
    points: number;
}

interface AntState {
    casteIndex: number;
    positionX: number;
    positionY: number;
    direction: number;
    radius: number;
    vitality: number;
    load: number;
    loadType: LoadType;
    viewRange: number;
    debugMessage: string;
    colour: string;
    targetPositionX: number;
    targetPositionY: number;
    targetType: TargetType;
}

interface BugState {
    positionX: number;
    positionY: number;
    direction: number;
    radius: number;
    vitality: number;
    colour: string;
}

interface SugarState {
    amount: number;
    positionX: number;
    positionY: number;
    radius: number;
}

interface FruitState {
    amount: number;
    positionX: number;
    positionY: number;
    radius: number;
    carriers: number;
}

interface MarkerState {
    positionX: number;
    positionY: number;
    direction: number;
    radius: number;
    age: number;
    maxAge: number;
}

class SimState {
    colonyState: ColonyState;
    bugStates: BugState[];
    sugarStates: SugarState[];
    fruitStates: FruitState[];

    constructor() {
        this.bugStates = [];
        this.sugarStates = [];
        this.fruitStates = [];
    }
}
