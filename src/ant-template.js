var PLAYER_INFO = {
    name: '<Your Name>',
    colonyName: 'My first ants',
    castes: [
        { name: 'default', color: 'black', speed: 0, rotationSpeed: 0, load: 0, range: 0, viewRange: 0, vitality: 0, attack: 0 }
    ]
};

class PlayerAnt extends BaseAnt {
    // this function gets called once if the ant is born
    constructor() {
        super(); // needs to be called first

        // add here your custom variables
        //...
    }

    // CASTE SELECTION
    determineCaste(availableInsects) {
        return 'default';
    }

    // this function is called, if the ant has nothing to do 
    // and is waiting for commands
    waits() {
        // just go forward for now...
        this.goForward();
    }
}