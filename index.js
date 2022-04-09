const fs = require('fs');

function getQueue() {
    let first;
    let last;
    let size = 0;
    return {
        get length() {
            return size;
        },
        get peek() {
            return first.value
        },
        unshift() {
            if (size > 0) {
                size--;
                const result = first.value;
                first = first.next;
                if (!first) {
                    last = undefined;
                }
                return result;
            }
        },
        push(value) {
            if (last) {
                last = last.next = {
                    value,
                }
            } else first = last = { value };
            size++;
        }
    }
}

function mergeParts(array, start, mid, end) {
    let p1 = start;
    let p2 = mid;
    const queue = getQueue();
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

    function assign(i, value) {
        if (i < mid) {
            queue.push(array[i]);
            p1++;
        }
        array[i] = value;
    }
}

function countInversions(array, start = 0, end = array.length) {
    if (end - start > 2) {
        const mid = Math.floor((end + start) / 2);
        countInversions(array, start, mid);
        countInversions(array, mid, end);
        mergeParts(array, start, mid, end);
    }
    const lastPos = end - 1;
    if (start < lastPos && array[lastPos] < array[start]) {
        const greater = array[start];
        array[start] = array[lastPos];
        array[lastPos] = greater;
    }
}

const Benchmark = require('benchmark');


const benchmark = new Benchmark.Suite()
const bigArray = JSON.parse(fs.readFileSync('./_bcb5c6658381416d19b01bfc1d3993b5_IntegerArray.js'));
benchmark
    .add('Vanilla', () => bigArray.slice().sort((a, b) => a - b))
    .add('Merge sort', () => countInversions(bigArray.slice()))
    .on('cycle', event => console.log(`${event.target}`))
    .on('error', err => console.log(err))
    .run();
// [
//     // [5, 4, 3], // 3
//     // [5, 4, 3, 2], // 6
//     // [5, 4, 3, 2, 1], // 10
//     // [2, 1, 3, 2, 1], // 5
//     // [7, 6, 5, 4, 3, 2, 1], // 21
//     [7, 6, 5, 4, 3, 2, 1, 7, 6, 5, 4, 3, 2, 1],
//     bigArray // 2407905288,
// ].forEach(arr => {
//     let start = Date.now();
//     console.log(arr.slice().sort((a, b) => a - b))
//     console.log(`took ${Date.now() - start}`);
//     start = Date.now();
//     console.log(countInversions(arr));
//     console.log(`took ${Date.now() - start}`);
//     console.log(arr);
// });