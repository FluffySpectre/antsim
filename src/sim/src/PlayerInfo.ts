class PlayerInfo {
    name: string;
    colonyName: string;
    castes: CasteInfo[];
    debug: boolean;

    static fromObject(obj: any): PlayerInfo {
        let pi = new PlayerInfo();
        pi.name = obj.name;
        pi.colonyName = obj.colonyName;
        pi.castes = [];
        if (Array.isArray(obj.castes)) {
            for (let c of obj.castes) {
                pi.castes.push(CasteInfo.fromObject(c));
            }
        }
        pi.debug = obj.debug || false;
        return pi;
    }
}
