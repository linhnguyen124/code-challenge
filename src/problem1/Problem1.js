const sum_to_n_a = function (n) {
  if (n === 0) {
    return n;
  }
  return n + sum_to_n_a(n - 1);
};

const sum_to_n_b = function (n) {
  let res = 0;
  for (let i = 1; i <= n; i++) {
    res += i;
  }
  return res;
};

const sum_to_n_c = function (n) {
  if (n % 2 === 0) {
    return (n + 1) * (n / 2);
  }
  return (n + 1) * Math.floor(n / 2) + Math.floor(n / 2) + 1;
};