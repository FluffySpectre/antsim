class Environment {
    sugarHills: Sugar[];
    fruits: Fruit[];
    playerColony: Colony;
    bugs: Colony;
    sugarDelay: number;
    fruitDelay: number;
    bugDelay: number;
    currentRound: number;
    currentSimState: SimState;

    constructor(playerInfo: PlayerInfo, randSeed: number) {
        if (randSeed !== 0) randomSeed(randSeed);

        this.sugarHills = [];
        this.fruits = [];
        this.playerColony = new Colony(playerInfo);
        this.playerColony.antHill = new AntHill(width / 2, height / 2, SimSettings.antHillRadius);
        this.bugs = new Colony();
        this.sugarDelay = 0;
        this.fruitDelay = 0;
        this.bugDelay = 0;

        this.currentRound = 0;
    }

    // this is the main simulation loop
    step() {
        this.currentRound++;

        this.removeSugar();
        this.spawnSugar();
        this.spawnFruit();

        for (let i=0; i<this.bugs.insects.length; i++) {
            let b = this.bugs.insects[i] as Bug;

            // check for fights
            let battleAnts = this.getAntsInBattleRange(b);
            if (battleAnts.length > 0) {
                let damage = Math.floor(SimSettings.bugAttack / battleAnts.length);
                for (let a of battleAnts) {
                    a.vitality -= damage;
                    a.underAttack(b);
                    if (a.vitality <= 0)
                        a.colony.eatenInsects.push(a);
                }
            }

            b.move();
            
            if (b.remainingDistance === 0) {
                b.turnToDirection(random(0, 360));
                b.goForward(random(160, 320));
            }
        }

        for (let i = 0; i<this.playerColony.insects.length; i++) {
            let a = this.playerColony.insects[i] as BaseAnt;

            // check the suroundings of the ant
            let nearAnts = this.getAntsInViewRange(a);
            a.colonyCount = nearAnts[0] as number;
            a.casteCount = nearAnts[1] as number;
            let nearestColonyAnt = nearAnts[2] as BaseAnt;

            let nearBugs = this.getBugsInViewRange(a);
            a.bugCount = nearBugs[0] as number;
            let nearestBug = nearBugs[1] as Bug;

            a.move();

            if (a.traveledDistance > a.range) {
                a.vitality = 0;
                this.playerColony.starvedInsects.push(a);
            } else {
                if (a.traveledDistance > a.range / 3 && !a.isTired) {
                    a.isTired = true;
                    a.becomesTired();
                }

                if (nearestBug && !(a.target instanceof Bug))
                    a.spotsBug(nearestBug);
                if (nearestColonyAnt && !(a.target instanceof BaseAnt))
                    a.spotsFriend(nearestColonyAnt);
                if (a.target instanceof Bug) {
                      let targetBug = a.target as Bug;
                      if (targetBug.vitality > 0) {
                        if (Coordinate.distance(a, a.target) < SimSettings.battleRange) {
                            targetBug.vitality -= a.attack;
                            if (targetBug.vitality <= 0) {
                                this.bugs.eatenInsects.push(targetBug);
                                this.playerColony.statistics.killedBugs++;
                                a.stop();
                            }
                        }
                    }
                    else
                        a.target = null;
                }

                if (a.reached)
                    this.antAndTarget(a);
                this.antAndSugar(a);
                if (!a.carriedFruit) {
                    this.antAndFruit(a);
                }
                this.antAndMarker(a);

                if (!a.target && a.remainingDistance === 0)
                    a.waits();
                a.tick();
            }
        }

        this.removeAnts();
        this.spawnAnt();
        this.updateMarker();
        this.moveFruitAndAnts();
        this.removeFruit();
        this.removeBugs();
        this.healBugs();
        this.spawnBug();

        // generate the new simulation state
        this.generateSimState();
    }

    generateSimState() {
        const newSimState = new SimState();
        newSimState.colonyState = this.playerColony.getState();
        for (let b of this.bugs.insects) {
            newSimState.bugStates.push((b as Bug).getState());
        }
        for (let s of this.sugarHills) {
            newSimState.sugarStates.push(s.getState());
        }
        for (let f of this.fruits) {
            newSimState.fruitStates.push(f.getState());
        }
        this.currentSimState = newSimState;
    }

    getState() {
        return this.currentSimState;
    }

    spawnAnt() {
        if (this.playerColony.insects.length < SimSettings.antLimit && this.playerColony.insectDelay < 0) {
            this.playerColony.newInsect();
            this.playerColony.insectDelay = SimSettings.antRespawnDelay;
        }
        this.playerColony.insectDelay--;
    }

    removeAnts() {
        let antsToRemove = [];
        for (let i = 0; i < this.playerColony.starvedInsects.length; i++) {
            let a = this.playerColony.starvedInsects[i] as BaseAnt;
            if (a && antsToRemove.indexOf(a) === -1) {
                antsToRemove.push(a);
                this.playerColony.statistics.starvedAnts++;
                a.hasDied('starved');
            }
        }
        for (let i = 0; i < this.playerColony.eatenInsects.length; i++) {
            let a = this.playerColony.eatenInsects[i] as BaseAnt;
            if (a && antsToRemove.indexOf(a) === -1) {
                antsToRemove.push(a);
                this.playerColony.statistics.eatenAnts++;
                a.hasDied('eaten');
            }
        }
        
        for (let a of antsToRemove) {
            if (a) {
                this.playerColony.removeAnt(a);
                for (let f of this.fruits) {
                    let carrierIndex = f.carriers.indexOf(a);
                    if (carrierIndex > -1)
                        f.carriers.splice(carrierIndex, 1);
                }
            }
        }
        this.playerColony.starvedInsects = [];
        this.playerColony.eatenInsects = [];
    }

    antAndTarget(ant: BaseAnt) {
        if (ant.target instanceof AntHill) {
            if (ant.carriedFruit)
                return;
            ant.traveledDistance = 0;
            ant.target = null;
            ant.smelledMarker = [];
            ant.colony.statistics.collectedFood += ant.currentLoad;
            ant.currentLoad = 0;
            ant.vitality = ant.maxVitality;
            ant.isTired = false;
        }
        else if (ant.target instanceof Sugar) {
            let t = ant.target;
            ant.target = null;
            if (t.amount <= 0)
                return;
            ant.sugarReached(t);
        }
        else if (ant.target instanceof Fruit) {
            let t = ant.target;
            ant.target = null;
            if (t.amount <= 0)
                return;
            ant.fruitReached(t);
        }
        else {
            if (ant.target instanceof Insect)
                return;
            ant.target = null;
        }
    }

    antAndSugar(ant: BaseAnt) {
        for (let s of this.sugarHills) {
            let num = Coordinate.distance(ant, s);
            if (ant.target !== s && num <= ant.viewRange) {
                ant.spotsSugar(s);
            }
        }
    }

    antAndFruit(ant: BaseAnt) {
        for (let f of this.fruits) {
            let num = Coordinate.distance(ant, f);
            if (ant.target !== f && num <= ant.viewRange)
                ant.spotsFruit(f);
        }
    }

    antAndMarker(ant: BaseAnt) {
        let marker = this.getNearestMarker(ant);
        if (!marker)
            return;
        ant.smellsFriend(marker);
        ant.smelledMarker.push(marker);
    }

    updateMarker() {
        let markerToRemove = [];
        for (let m of this.playerColony.marker) {
        if (m.isActive)
            m.update();
        else
            markerToRemove.push(m);
        }

        for (let m of markerToRemove) {
            for (let i of this.playerColony.insects) {
                if (i) {
                    let smIndex = i.smelledMarker.indexOf(m);
                    if (smIndex > -1) {
                        i.smelledMarker.splice(smIndex, 1);
                    }
                }
            }
            this.playerColony.marker.splice(this.playerColony.marker.indexOf(m), 1);
        }
        markerToRemove = [];

        for (let newM of this.playerColony.newMarker) {
            let alreadyAMarker = false;
            for (let m of this.playerColony.marker) {
                if (Coordinate.distanceMidPoints(m, newM) < SimSettings.markerDistance) {
                    alreadyAMarker = true;
                    break;
                }
            }
            if (alreadyAMarker)
                continue;

            this.playerColony.marker.push(newM);
        }

        this.playerColony.newMarker = [];
    }

    moveFruitAndAnts() {
        for (let f of this.fruits) {
            if (f.carriers.length <= 0) continue;
            let dx = 0;
            let dy = 0;
            let load = 0;
            for (let a of f.carriers) {
                if (a.target === f || a.remainingRotation !== 0)
                    continue;

                dx += a.currentSpeed * Math.cos(a.direction * Math.PI / 180.0);
                dy += a.currentSpeed * Math.sin(a.direction * Math.PI / 180.0);
                load += a.currentLoad;
            }
            load = Math.min(Math.floor(0.0 + load * SimSettings.fruitLoadMultiplier), f.amount);
            dx = dx * load / f.amount / f.carriers.length;
            dy = dy * load / f.amount / f.carriers.length;

            let newFruitCoord = Coordinate.withDeltas(f, dx, dy);
            f.position = newFruitCoord.position;
            f.direction = newFruitCoord.direction;
            for (let a of f.carriers) {
                let newCarrierCoord = Coordinate.withDeltas(a, dx, dy);
                a.position = newCarrierCoord.position;
                a.direction = newCarrierCoord.direction;
            }
        }
    }

    spawnSugar() {
        if (this.sugarHills.length < SimSettings.sugarLimit && this.sugarDelay <= 0) {
            this.sugarDelay = SimSettings.sugarRespawnDelay;

            let p = this.getRandomPoint();
            let amount = random(SimSettings.minSugarAmount, SimSettings.maxSugarAmount);
            this.sugarHills.push(new Sugar(p.x, p.y, amount));
        }
        this.sugarDelay--;
    }

    removeSugar() {
        this.sugarHills = this.sugarHills.filter(s => s && s.amount > 0);
    }

    spawnFruit() {
        if (this.fruits.length < SimSettings.fruitLimit && this.fruitDelay <= 0) {
            this.fruitDelay = SimSettings.fruitRespawnDelay;

            let p = this.getRandomPoint();
            let amount = random(SimSettings.minFruitAmount, SimSettings.maxFruitAmount);
            this.fruits.push(new Fruit(p.x, p.y, amount));
        }
        this.fruitDelay--;
    }

    removeFruit() {
        for (let f of this.fruits) {
            if (Coordinate.distanceMidPoints(f, this.playerColony.antHill) <= 5) {
                this.playerColony.statistics.collectedFood += f.amount;
                f.amount = 0;
                for (let a of f.carriers) {
                    if (a) {
                        a.carriedFruit = null;
                        a.currentLoad = 0;
                        a.remainingDistance = 0;
                        a.remainingRotation = 0;
                        a.goHome();
                    }
                }
                f.carriers = [];
            }
        }
        this.fruits = this.fruits.filter(f => f && f.amount > 0);
    }

    spawnBug() {
      if (this.bugs.insects.length < SimSettings.bugLimit && this.bugs.insectDelay < 0) {
        this.bugs.newInsect();
        this.bugs.insectDelay = SimSettings.bugRespawnDelay;
      }
      this.bugs.insectDelay--;
    }

    healBugs() {
        if (this.currentRound % SimSettings.bugRegenerationDelay !== 0)
            return;

        for (let b of this.bugs.insects) {
            if (b && b.vitality < b.maxVitality) {
                b.vitality += SimSettings.bugRegenerationValue;
            }
        }
    }

    removeBugs() {
        for (let i = this.bugs.eatenInsects.length - 1; i >= 0; i--) {
            let b = this.bugs.eatenInsects[i] as Bug;
            if (b) {
                let bIndex = this.bugs.insects.indexOf(b);
                if (bIndex > -1) {
                    this.bugs.insects.splice(bIndex, 1);
                }
            }
        }
        this.bugs.eatenInsects = [];
    }

    getBugsInViewRange(insect: Insect) {
        let numBugs = 0;
        let nearestBug = null, nearestBugDist = Number.MAX_SAFE_INTEGER;
        for (let b of this.bugs.insects) {
            if (b === insect) continue; // ignore ourself

            let distSqr = Coordinate.distanceSqr(insect, b);
            if (distSqr <= insect.viewRange * insect.viewRange) {
                if (distSqr < nearestBugDist) {
                    nearestBugDist = distSqr;
                    nearestBug = b;
                }
                numBugs++;
            }
        }
        return [numBugs, nearestBug];
    }

    getAntsInViewRange(insect: Insect) {
        let numColonyAnts = 0, numCasteAnts = 0;
        let nearestAnt = null, nearestAntDist = Number.MAX_SAFE_INTEGER;
        for (let a of this.playerColony.insects) {
            if (a === insect) continue; // ignore ourself

            // distanceSqr is used here because of performance reasons
            let distSqr = Coordinate.distanceSqr(insect, a);
            if (distSqr <= insect.viewRange * insect.viewRange) {
                if (distSqr < nearestAntDist) {
                    nearestAntDist = distSqr;
                    nearestAnt = a;
                }

                numColonyAnts++;
                if (a.casteIndex === insect.casteIndex) {
                    numCasteAnts++;
                }
            }
        }
        return [numColonyAnts, numCasteAnts, nearestAnt];
    }

    getAntsInBattleRange(insect: Insect) {
        let battleAnts = [];
        for (let i of this.playerColony.insects) {
            let a = i as BaseAnt;
            if (a === insect) continue; // ignore ourself

            // distanceSqr is used here because of performance reasons
            let distSqr = Coordinate.distanceSqr(insect, a);
            if (distSqr <= SimSettings.battleRange * SimSettings.battleRange) {
                battleAnts.push(a);
            }
        }
        return battleAnts;
    }

    getNearestMarker(insect: Insect) {
        let nearestMarker = null;
        let nearestMarkerDist = Number.MAX_SAFE_INTEGER;
        for (let m of this.playerColony.marker) {
            let mDist = Coordinate.distanceMidPoints(insect, m);
            if (mDist - insect.radius - m.radius <= 0 && mDist < nearestMarkerDist && insect.smelledMarker.indexOf(m) === -1) {
                nearestMarkerDist = mDist;
                nearestMarker = m;
            }
        }
        return nearestMarker;
    }

    getRandomPoint() {
        let rp = createVector(random(20, width - 20), random(20, height - 20));
        while (rp.dist(this.playerColony.antHill.position) < 25) {
            rp = createVector(random(20, width - 20), random(20, height - 20));
        }
        return rp;
    }
}