class SimSettings {
    static stepsPerSecond = 30;
    static stepMultiplicator = 1;
    static totalRounds = 7300; // @30FPS = 4 minutes
    static antLimit = 50;
    static antHillRadius = 25;
    static displayDebugLabels = false;
    static sugarLimit = 2;
    static fruitLimit = 2;
    static bugLimit = 5;
    static minSugarAmount = 500;
    static maxSugarAmount = 500;
    static minFruitAmount = 250;
    static maxFruitAmount = 250;
    static sugarRadiusMultiplier = 1;
    static fruitLoadMultiplier = 5;
    static fruitRadiusMultiplier = 1.25;
    static pointsForFood = 1;
    static pointsForStarvedAnts = -5;
    static pointsForEatenAnts = 0;
    static pointsForKilledBugs = 150;
    static antRespawnDelay = 15;
    static bugRespawnDelay = 75;
    static sugarRespawnDelay = 150;
    static fruitRespawnDelay = 225;
    static bugSpeed = 2;
    static bugRotationSpeed = 5;
    static bugVitality = 1000;
    static bugAttack = 50;
    static bugRegenerationDelay = 5;
    static bugRegenerationValue = 1;
    static battleRange = 10;
    static casteAbilities = new CasteAbilities();
    static antNames = [
        'Anke', 'Matthias', 'Roland', 'Bernhard', 'Werner', 'Joachim', 'Gabi', 'Björn', 'Anja', 'Carsten', 'Benjamin', 'Timon', 'Yannik', 'Matthias LT', 'Jens', 'Dennis', 'Christine', 'Sebastian', 'Seddy', 'Tim', 'Manuel'
    ];
    static markerMaximumAge = 150;
    static markerSizeMinimum = 20;
    static markerDistance = 13;

    static get markerSizeMaximum() {
        return this.markerSizeMinimum * this.markerMaximumAge;
    }

    static get markerRangeMaximum() {
        return this.markerSizeMaximum - this.markerSizeMinimum;
    }
}
