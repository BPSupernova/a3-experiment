function RandomNums() {
    let n1 = Math.floor(Math.random() * 100) + 1;
    let n2 = Math.floor(Math.random() * 100) + 1;
    let n3 = Math.floor(Math.random() * 100) + 1;
    let n4 = Math.floor(Math.random() * 100) + 1;
    let n5 = Math.floor(Math.random() * 100) + 1;
    let nums = [n1, n2, n3, n4, n5];
    return nums;
}

export default RandomNums;
