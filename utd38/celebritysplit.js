const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const powerSet = (arr = []) => {
    const res = [];
    const { length } = arr;
    const numberOfCombinations = 2 ** length;
    for (let combinationIndex = 0; combinationIndex < numberOfCombinations; combinationIndex += 1) {
        const subSet = [];
        for (let setElementIndex = 0; setElementIndex < arr.length;
             setElementIndex += 1) {
            if (combinationIndex & (1 << setElementIndex)) {
                subSet.push(arr[setElementIndex]);
            };
        };
        res.push(subSet);
    };
    return res;
};


var permArr = [],
    usedChars = [];
const  permute = (input) => {
    var i, ch;
    for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (input.length === 0) {
            permArr.push(usedChars.slice());
        }
        permute(input);
        input.splice(i, 0, ch);
        usedChars.pop();
    }
    return permArr
};

const canBeSplitEven = mansions => {
    permArr = [];
    usedChars = [];
    const set = permute(mansions);
    // console.log(mansions, set.length);

    return set.some(permutation => {
        let jack = 0;
        let jill = 0;
        for (const i of permutation) {
            if (jill < jack) jill += i;
            else jack += i;
        }

        if(jack === jill){
            // console.log(permutation);
            return true;
        }
    });
};

let lines = [];
let numToCollect = -1;
let isCollecting = false;
rl.on("line", line => {
    if(isCollecting){
        lines.push(line);
    }else{
        numToCollect = parseInt(line);
        isCollecting = true;

        if(numToCollect === 0) {
            rl.close();
        }
    }

    if(lines.length === numToCollect){
        const mansions = lines.map(x => parseInt(x));
        const possible = powerSet(mansions).filter(canBeSplitEven);
        const toDivide = possible.sort((a, b) => b.length - a.length)[0] || [];

        console.log("toDivide", possible, toDivide);
        const toSell = mansions.filter(mansion => {
            const idx = toDivide.indexOf(mansion);
            if(idx === -1){
                return true;
            }else{
                debugger;
                toDivide.splice(idx, 1);
                return false;
            }
        });
        const sellValue = toSell.reduce((ac, b) => ac + b, 0);
        console.log("dividing", mansions, toSell, sellValue);
        process.stdout.write(sellValue + "\n");

        lines = [];
        isCollecting = false;
    }
});
