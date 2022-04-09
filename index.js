const fs = require('fs');

function mergeSortedSlices(array, start, mid, end, comparer, circular, size) {
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
            if (comparer(nextValue, currentValue) >= 0) continue;
            p2++;
        } else if (comparer(nextValue, circular[firstPos]) < 0) p2++;
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

function recursiveMergeSort(array, start, end, comparer, queue, size) {
    if (end - start > 2) {
        const mid = Math.floor((end + start) / 2);
        recursiveMergeSort(array, start, mid, comparer, queue, size);
        recursiveMergeSort(array, mid, end, comparer, queue, size);
        mergeSortedSlices(array, start, mid, end, comparer, queue, size);
    }
    const lastPos = end - 1;
    if (start < lastPos && comparer(array[lastPos], array[start]) < 0) {
        const greater = array[start];
        array[start] = array[lastPos];
        array[lastPos] = greater;
    }
}

function mergeSort(array, comparer) {
    const size = Math.ceil(array.length / 2) + 1;
    return recursiveMergeSort(array, 0, array.length, comparer, new Array(size), size);
}

const comparer = (a, b) => a - b;
const smallArray = [8, 2, 6, 5, 1, 5, 7, 32, 54, 9, 16, 3, 78, 15];
const bigArray = JSON.parse(fs.readFileSync('./_bcb5c6658381416d19b01bfc1d3993b5_IntegerArray.js'));
const Benchmark = require('benchmark');
const benchmark = new Benchmark.Suite()
let count = 0;
benchmark
    .add('Vanilla Small array', () => smallArray.slice().sort(comparer))
    .add('Merge sort Small array', () => mergeSort(smallArray.slice(), comparer))
    .add('Vanilla', () => bigArray.slice().sort(comparer))
    .add('Merge sort', () => mergeSort(bigArray.slice(), comparer))
    .add('Vanilla x2', () => bigArray.concat(bigArray).sort(comparer))
    .add('Merge sort x2', () => mergeSort(bigArray.concat(bigArray), comparer))
    .add('Vanilla x3', () => bigArray.concat(bigArray).concat(bigArray).sort(comparer))
    .add('Merge sort x3', () => mergeSort(bigArray.concat(bigArray).concat(bigArray), comparer))
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
].forEach((arr)=> {
    const arr1 = arr.slice();
    arr1.sort(comparer);
    const arr2 = arr.slice();
    mergeSort(arr2, comparer);
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