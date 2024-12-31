// loop
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};
// recursion
var sum_to_n_b = function(n) {

    if (n === 0) return 0;
    return n + sum_to_n_b(n - 1);
};
// formula s=(n*(n+1))/2
var sum_to_n_c = function(n) {
    return n * (n + 1) / 2;
};