const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const calcDist = (x1, y1, x2, y2) => Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);

const getNthPointOnCircle = (current, total, radius) => {
    let angle = ((Math.PI * 2) / total);
    let myAngle = (angle * current);

    return {x: radius * Math.cos(myAngle), y: radius * Math.sin(myAngle)};
};

const isValid = (nPeople, dCm, tClink, radius) => {
    let reachable = 0;
    for(let person = 0; person < nPeople; person++){
        const myPoint = getNthPointOnCircle(person, nPeople, radius);
        for(let otherPerson = person; otherPerson < nPeople; otherPerson++){
            if(person === otherPerson) continue;

            const theirPoint = getNthPointOnCircle(otherPerson, nPeople, radius);

            const dist = calcDist(myPoint.x, myPoint.y, theirPoint.x, theirPoint.y) / 2;

            if(dist < dCm){
                reachable ++;
            }
        }
    }
    return reachable === tClink;
};

const findBounds = (nPeople, dCm, tClink) => {
    let searchStart1 = 0;
    let searchEnd1 = 10**11;
    let searchStart2 = 0;
    let searchEnd2 = 10**11;

    let tries = 0;
    while(true){
        let searchSteps = 100;
        let step1 = (searchEnd1 - searchStart1) / searchSteps;

        let newStart1;
        let newEnd1;
        let newStart2;
        let newEnd2;
        let workedLastTime = false;
        for(let radius = searchStart1; radius < searchEnd1; radius += step1){
            const worksHere = isValid(nPeople, dCm, tClink, radius);
            if(!workedLastTime && worksHere){
                workedLastTime = true;
                newStart1 = Math.max(radius - step1, 0);
                newEnd1 = radius + step1;
            }
        }

        if(!newEnd1){
            newStart1 = searchStart1;
            newEnd1 = searchEnd1 / searchSteps;
        }

        if(workedLastTime && !searchStart2) searchStart2 = newEnd1;
        let step2 = (searchEnd2 - searchStart2) / searchSteps;
        workedLastTime = true;
        for(let radius = searchStart2; radius < searchEnd2; radius += step2){
            const worksHere = isValid(nPeople, dCm, tClink, radius);
            if(workedLastTime && !worksHere){
                newStart2 = Math.max(radius - step2, 0);
                newEnd2 = radius + step2;
                break;
            }
        }


        if((newEnd1 - newStart1 < 10**-5 && newEnd2 - newStart2 < 10**-5) || tries > 10){
            return [(newEnd1 - newStart1) / 2 + newStart1, (newEnd2 - newStart2) / 2 + newStart2];
        }


        searchStart1 = newStart1;
        searchEnd1 = newEnd1;
        searchStart2 = newStart2;
        searchEnd2 = newEnd2;

        tries ++;
    }
};

rl.once("line", line => {
    const a = line.trim().split(" ").map(x => parseInt(x));

    console.log(findBounds(a[0], a[1], a[2]).map(num => Math.round((num + Number.EPSILON) * 10**6) / 10**6).join(" "));

    rl.close();
})
