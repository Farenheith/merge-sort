const fs = require('fs');

function getCircularQueue(size) {
    let array = new Array(size);
    let pos = -1;
    let first = 0;
    let length = 0;
    return {
        get length() {
            return length;
        },
        get peek() {
            return array[first];
        },
        unshift() {
            const result = array[first];
            first = (first + 1) % size;
            length--;
            return result;
        },
        push(value) {
            length++;
            pos = (pos + 1) % size;
            array[pos] = value;
        }
    }
}

function mergeParts(array, start, mid, end, queue) {
    let p1 = start;
    let p2 = mid;
    for (let i = start; i < end; i++) {
        if (i > mid && queue.length === 0) break;
        if (p2 >= end) {
            array[i] = queue.unshift();
        } else {
            const p2Value = array[p2];
            if (array[p2] < (queue.length > 0 ? queue.peek : array[p1])) {
                assign(i, p2Value);
                p2++;
            } else if (queue.length > 0) assign(i, queue.unshift());
            else if (p1 < mid) p1++;
        }
    }

    if (queue.length > 0) {
        throw new Error('Something is wrong');
    }

    function assign(i, value) {
        if (i < mid) {
            queue.push(array[i]);
            p1++;
        }
        array[i] = value;
    }
}

function recursiveMergeSort(array, start, end, queue) {
    if (end - start > 2) {
        const mid = Math.floor((end + start) / 2);
        recursiveMergeSort(array, start, mid, queue);
        recursiveMergeSort(array, mid, end, queue);
        mergeParts(array, start, mid, end, queue);
    }
    const lastPos = end - 1;
    if (start < lastPos && array[lastPos] < array[start]) {
        const greater = array[start];
        array[start] = array[lastPos];
        array[lastPos] = greater;
    }
}

function mergeSort(array) {
    return recursiveMergeSort(array, 0, array.length, getCircularQueue(Math.ceil(array.length / 2)));
}

const bigArray = JSON.parse(fs.readFileSync('./_bcb5c6658381416d19b01bfc1d3993b5_IntegerArray.js'));
const Benchmark = require('benchmark');
const benchmark = new Benchmark.Suite()
benchmark
    .add('Vanilla', () => bigArray.slice().sort((a, b) => a - b))
    .add('Merge sort', () => mergeSort(bigArray.slice()))
    .on('cycle', event => console.log(`${event.target}`))
    .on('error', err => console.log(err))
    .run();
[
    // [5, 4, 3], // 3
    // [5, 4, 3, 2], // 6
    // [5, 4, 3, 2, 1], // 10
    // [2, 1, 3, 2, 1], // 5
    // [7, 6, 5, 4, 3, 2, 1], // 21
    [7, 6, 5, 4, 3, 2, 1, 7, 6, 5, 4, 3, 2, 1],
    bigArray // 2407905288,
].forEach(arr => {
    let start = Date.now();
    console.log(arr.slice().sort((a, b) => a - b))
    console.log(`took ${Date.now() - start}`);
    start = Date.now();
    console.log(mergeSort(arr));
    console.log(`took ${Date.now() - start}`);
    console.log(arr);
});