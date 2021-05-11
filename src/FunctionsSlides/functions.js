const LOGISTIC_MAP_FUNC = `
(r) => {
  const y = (x) => r * x * (1 - x);
  let y0 = 0.4;
  for (let i = 0; i < 1000 + ((r * 1000) % 7); i += 1) {
    y0 = y(y0);
  }
  return y0;
}
`;

const IDENTITY_FUNC = `
(x) => {
  return x;
}
`;

export default [
  {
    function: LOGISTIC_MAP_FUNC,
    startVal: 1,
    endVal: 4.2,
    step: 0.0005
  },
  {
    function: IDENTITY_FUNC,
    startVal: -2,
    endVal: 2,
    step: 0.01
  }
];
