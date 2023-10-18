class Colony {
    insects: Insect[];
    starvedInsects: Insect[];
    eatenInsects: Insect[];
    insectDelay = 0;
    statistics: PlayerStatistics;
    playerInfo: PlayerInfo;
    insectClass: string;
    antHill: AntHill;
    marker: Marker[];
    newMarker: Marker[];

    // castes stats
    castesSpeed: number[];
    castesRotationSpeed: number[];
    castesLoad: number[];
    castesRange: number[];
    castesViewRange: number[];
    castesVitality: number[];
    castesAttack: number[];

    // colony ant stats
    castes: CasteInfo[];
    antsInCaste: number[];

    constructor(playerInfo?: PlayerInfo) {
        this.insects = [];
        this.starvedInsects = [];
        this.eatenInsects = [];
        this.insectDelay = 0;
        this.statistics = new PlayerStatistics();
        this.marker = [];
        this.newMarker = [];

        // for ants
        if (playerInfo) {
            this.playerInfo = playerInfo;
            this.insectClass = 'PlayerAnt';

            this.castes = playerInfo.castes;
            if (this.castes.length === 0)
                this.castes.push(new CasteInfo());
            this.antsInCaste = this.castes.map(c => 0);

            this.castesSpeed = new Array<number>(this.castes.length);
            this.castesRotationSpeed = new Array<number>(this.castes.length);
            this.castesLoad = new Array<number>(this.castes.length);
            this.castesRange = new Array<number>(this.castes.length);
            this.castesViewRange = new Array<number>(this.castes.length);
            this.castesVitality = new Array<number>(this.castes.length);
            this.castesAttack = new Array<number>(this.castes.length);

            let i = 0;
            for (let c of this.castes) {
                this.castesSpeed[i] = SimSettings.casteAbilities.get(c.speed).speed;
                this.castesRotationSpeed[i] = SimSettings.casteAbilities.get(c.rotationSpeed).rotationSpeed;
                this.castesLoad[i] = SimSettings.casteAbilities.get(c.load).load;
                this.castesRange[i] = SimSettings.casteAbilities.get(c.range).range;
                this.castesViewRange[i] = SimSettings.casteAbilities.get(c.viewRange).viewRange;
                this.castesVitality[i] = SimSettings.casteAbilities.get(c.vitality).vitality;
                this.castesAttack[i] = SimSettings.casteAbilities.get(c.attack).attack;
                i++;
            }
        }
        // for bugs 
        else {
            this.playerInfo = null;
            this.insectClass = 'Bug';
            this.castesSpeed = [SimSettings.bugSpeed];
            this.castesRotationSpeed = [SimSettings.bugRotationSpeed];
            this.castesRange = [Number.MAX_SAFE_INTEGER];
            this.castesViewRange = [0];
            this.castesLoad = [0];
            this.castesVitality = [SimSettings.bugVitality];
            this.castesAttack = [SimSettings.bugAttack];
            this.antsInCaste = [0];
        }
    }

    newInsect() {
        let availableInsects = null;
        if (this.castes && this.castes.length > 0) {
            availableInsects = {};
            let castesCount = 0;
            for (let caste of this.castes) {
                if (!availableInsects.hasOwnProperty(caste.name)) {
                    // @ts-ignore
                    availableInsects[caste.name] = this.antsInCaste[castesCount];
                }
                castesCount++;
            }
        }

        let ant = eval(`new ${this.insectClass}()`);
        ant.init(this, availableInsects);
        this.insects.push(ant);
        this.antsInCaste[ant.casteIndex]++;
    }

    removeAnt(insect: Insect) {
        let ai = this.insects.indexOf(insect);
        if (ai > -1)
            this.insects.splice(ai, 1);
        this.antsInCaste[insect.casteIndex]--;
    }

    getState(): ColonyState {
        const antStates = [];
        for (let a of this.insects) {
            antStates.push((a as BaseAnt).getState());
        }

        const markerStates = [];
        for (let m of this.marker) {
            markerStates.push(m.getState());
        }

        const casteStates = [];
        for (let c of this.castes) {
            casteStates.push(c.getState());
        }

        return {
            antStates: antStates,
            antHillState: this.antHill.getState(),
            markerStates: markerStates,
            casteStates: casteStates,
            colonyName: this.playerInfo.colonyName,
            playerName: this.playerInfo.name,
            starvedAnts: this.statistics.starvedAnts,
            eatenAnts: this.statistics.eatenAnts,
            collectedFood: this.statistics.collectedFood,
            killedBugs: this.statistics.killedBugs,
            points: this.statistics.points
        };
    }
}