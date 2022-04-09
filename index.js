const fs = require('fs');

function mergeSortedSlices(array, start, mid, end, circular, size) {
    let p2 = mid;
    let i;
    let firstPos = 0;
    let nextPos = 0;
    for (i = start; i < end; i++) {
        if (p2 >= end) break;
        let nextValue = array[p2];
        const currentValue = array[i];
        if (firstPos === nextPos) {
            if (i >= mid) return;
            if (nextValue >= currentValue) continue;
            p2++;
        } else if (nextValue < circular[firstPos]) p2++;
        else {
            nextValue = circular[firstPos];
            firstPos = (firstPos + 1) % size;
        }
        if (i < mid) {
            circular[nextPos] = currentValue;
            nextPos = (nextPos + 1) % size;
        }
        array[i] = nextValue;
    }
    while (firstPos !== nextPos) {
        array[i] = circular[firstPos];
        firstPos = (firstPos + 1) % size;
        i++;
    }
}

function recursiveMergeSort(array, start, end, queue, size) {
    if (end - start > 2) {
        const mid = Math.floor((end + start) / 2);
        recursiveMergeSort(array, start, mid, queue, size);
        recursiveMergeSort(array, mid, end, queue, size);
        mergeSortedSlices(array, start, mid, end, queue, size);
    }
    const lastPos = end - 1;
    if (start < lastPos && array[lastPos] < array[start]) {
        const greater = array[start];
        array[start] = array[lastPos];
        array[lastPos] = greater;
    }
}

function mergeSort(array) {
    const size = Math.ceil(array.length / 2) + 1;
    return recursiveMergeSort(array, 0, array.length, new Array(size), size);
}

const smallArray = [8, 2, 6, 5, 1, 5, 7, 32, 54, 9, 16, 3, 78, 15];
const bigArray = JSON.parse(fs.readFileSync('./_bcb5c6658381416d19b01bfc1d3993b5_IntegerArray.js'));
const Benchmark = require('benchmark');
const benchmark = new Benchmark.Suite()
let count = 0;
benchmark
    .add('Vanilla Small array', () => smallArray.slice().sort((a, b) => a - b))
    .add('Merge sort Small array', () => mergeSort(smallArray.slice()))
    .add('Vanilla', () => bigArray.slice().sort((a, b) => a - b))
    .add('Merge sort', () => mergeSort(bigArray.slice()))
    .add('Vanilla x2', () => bigArray.concat(bigArray).sort((a, b) => a - b))
    .add('Merge sort x2', () => mergeSort(bigArray.concat(bigArray)))
    .add('Vanilla x3', () => bigArray.concat(bigArray).concat(bigArray).sort((a, b) => a - b))
    .add('Merge sort x3', () => mergeSort(bigArray.concat(bigArray).concat(bigArray)))
    .on('cycle', event => {
        console.log(`${event.target}`);
        count++;
        if (count % 2 === 0) {
            console.log('*'.repeat(100));
        }
    })
    .on('error', err => console.log(err))
    .run();
[
    [5, 4, 3],
    [5, 4, 3, 2],
    [5, 4, 3, 2, 1],
    [2, 1, 3, 2, 1],
    [7, 6, 5, 4, 3, 2, 1],
    [7, 6, 5, 4, 3, 2, 1, 7, 6, 5, 4, 3, 2, 1],
    smallArray,
    bigArray,
].forEach((arr , arrNumber)=> {
    const arr1 = arr.slice();
    arr1.sort((a, b) => a - b);
    const arr2 = arr.slice();
    mergeSort(arr2);
    let arrayPrinted = false;
    arr1.forEach((x, i) => {
        if (x !== arr2[i]) {
            if (!arrayPrinted) {
                console.log(arr1);
                console.log(arr2);
                arrayPrinted = true;
            }
            console.log(`Position ${i} is divergent`);
        }
    })
});