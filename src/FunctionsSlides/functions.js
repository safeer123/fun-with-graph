const LOGISTIC_MAP_FUNC = `
(r) => {
  // Logistic Map
  // https://en.wikipedia.org/wiki/Logistic_map
  const y = (x) => r * x * (1 - x);
  let y0 = 0.4;
  for (let i = 0; i < 1000 + ((r * 1000) % 7); i += 1) {
    y0 = y(y0);
  }
  return y0;
}
`;

const MULT_FUNC = `
(x) => {
  // Circular functions, sin and cos
  const y_circle = Math.sqrt(25 - x*x);
  return [
    { value: y_circle, color: 'blue'}, 
    {value: Math.cos(x), color: '#7D6'}, 
    Math.sin(x)
    ];
}
`;

const FLY_STARIGHT_DAMMIT_FUNC = `
(n) => {
  // FLY_STARIGHT_DAMMIT_FUNC
  // https://www.youtube.com/watch?v=pAMgUB51XZA&ab_channel=Numberphile

  const gcd = (a, b) =>
  {
      if (b == 0)
          return a;
      return gcd(b, a % b);
  }

  if(n===0) {
      window.last_val=0;
  }
  // console.log(window.last_val);
  
  const gcdval = gcd(n, window.last_val);
  let newVal;
  if(n <= 1) {
    newVal = 1;
  } else if(gcdval === 1) {
    newVal = window.last_val + n + 1;
  } else if (gcdval > 1) {
    newVal = window.last_val / gcdval;
  }
  window.last_val=newVal;
  return newVal;
}
`;

const SUBTRACT_DIG_PRODUCT_FUNC = `
(n) => {
  // SUBTRACT PROD OF NON-ZERO DIGITS
  // https://www.youtube.com/watch?v=o8c4uYnnNnc&ab_channel=Numberphile

  let rem = n;
  let prod = 1;
  
  do {
    let dig = rem % 10;
    if(dig > 0) {
      prod *= dig;
    }
    rem = (rem-dig)/10;
  } while (rem > 0)
  // console.log(prod);
  return n-prod;
}
`;

const POLAR_FLOWERS_FUNC = `
(t) => {
  // Polar function example 1
  return [
    {
      value: 2 + Math.sin(6*t),
      color: '#934'
    },
    {
      value: Math.sin(5*t),
      color: '#394'
    },
  ];
}
`;

const POLAR_FLOWERS_FUNC_2 = `
(t) => {
  // Polar function example 2
  return [
    {
      value: Math.sin(3/4*t),
      color: '#934'
    },
  ];
}
`;

export default [
  {
    function: LOGISTIC_MAP_FUNC,
    startVal: 1,
    endVal: 4.2,
    step: 0.0005,
    polar: false
  },
  {
    function: MULT_FUNC,
    startVal: -5,
    endVal: 5,
    step: 0.01,
    polar: false
  },
  {
    function: FLY_STARIGHT_DAMMIT_FUNC,
    startVal: 0,
    endVal: 1000,
    step: 1,
    polar: false
  },
  {
    function: SUBTRACT_DIG_PRODUCT_FUNC,
    startVal: 1,
    endVal: 10000,
    step: 1,
    polar: false
  },
  {
    function: POLAR_FLOWERS_FUNC,
    startVal: 0,
    endVal: "2*Math.PI",
    step: 0.005,
    polar: true
  },
  {
    function: POLAR_FLOWERS_FUNC_2,
    startVal: 0,
    endVal: "10*Math.PI",
    step: 0.01,
    polar: true
  }
];
