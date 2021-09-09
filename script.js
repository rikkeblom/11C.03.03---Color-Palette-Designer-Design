"use strict";
//STILL TO DO:
// - reworking the random color function at load so the values are stored in the globalColorStorageArray
//   and can be sent through the same system as the manually picked colors
// - adjusting the values until I like them
// - tidying up the code and maybe adding more comments

window.addEventListener("DOMContentLoaded", start);

//setting global color storage array and a template object for storing the HSL info
//I should make 4 copies of the original picked HSL and then edit each copy depending on the harmony
//then at the end I can insert the original in the 3rd spot with splice and loop through them to get rgb and hex and display it all
let globalColorStorageArray = [];

//--------------------------

function start() {
  console.log("start()");
  //setting random initial main color
  const rgbValue = randomColor();
  const HSLValue = RGBtoHSL(rgbValue);
  const CSSValue = RGBtoCSS(rgbValue);
  const HEXValue = RGBtoHEX(rgbValue);

  //making the four color object copies in the global array
  //then adjusting according to the fallback harmony choice
  //and splicing in the random initial color
  for (let i = 0; i < 4; i++) {
    globalColorStorageArray[i] = Object.assign({}, HSLValue);
  }
  analogousHarmony();
  globalColorStorageArray.splice(2, 0, HSLValue);

  //setting the color picker to start at the random initial color
  //   document.querySelector(".colorPicker").value = HEXValue;
  //displaying the initial color
  //   displayColorValues(HEXValue, CSSValue, HSLValue);
  //   displayColor(HEXValue);

  //setting event listeners on the color picker and the harmony dropdown
  document.querySelector(".colorPicker").addEventListener("change", newColorHarmony);
  document.querySelector(".colorPicker").addEventListener("input", newColorHarmony);
  document.querySelector("#drop").addEventListener("input", newColorHarmony);
  document.querySelector("#drop").addEventListener("change", newColorHarmony);
}

function randomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return { r, g, b };
}

function newColorHarmony() {
  //resetting the globalarray each time a value is changed
  globalColorStorageArray = [];

  const hexValue = document.querySelector(".colorPicker").value;
  const rgbValue = HEXtoRGB(hexValue);
  const HSLValue = RGBtoHSL(rgbValue);
  const CSSValue = RGBtoCSS(rgbValue);
  console.log(hexValue);

  //making the four color object copies in the global array
  for (let i = 0; i < 4; i++) {
    globalColorStorageArray[i] = Object.assign({}, HSLValue);
  }

  //   displayColor(hexValue);
  //   displayColorValues(hexValue, CSSValue, HSLValue);
  //   console.log(getHarmonyType());

  if (getHarmonyType() === "Analogous") {
    analogousHarmony();
  } else if (getHarmonyType() === "Monochromatic") {
    monochromaticHarmony();
  } else if (getHarmonyType() === "Triad") {
    triadHarmony();
  } else if (getHarmonyType() === "Complementary") {
    complementaryHarmony();
  } else if (getHarmonyType() === "Compound") {
    compoundHarmony();
  } else if (getHarmonyType() === "Shades") {
    shadesHarmony();
  }

  //I will add an else if for each of the 6 harmony types
  globalColorStorageArray.splice(2, 0, HSLValue);

  //Then I want to loop through all the HSL values and convert them to RGB, CSS and HEX
  translateValues();

  //Then I want to send those to another function to display them in the corresponding square
  displayColor();
  displayColorValues();
}

function getHarmonyType() {
  return document.querySelector("#drop").value;
}

//----------------------------Harmony Types

function analogousHarmony() {
  //console.log("analogousHarmony()");
  //H is shifted some degrees for each color - you decide how many degrees, it isn't adjustable by the user. S and L are kept constant

  globalColorStorageArray[0].h = globalColorStorageArray[0].h + 15;
  globalColorStorageArray[1].h = globalColorStorageArray[1].h + 90;
  globalColorStorageArray[2].h = globalColorStorageArray[2].h + 30;
  globalColorStorageArray[3].h = globalColorStorageArray[3].h + 200;

  //here I use remainder in a loop to make sure h is never below 0 or above 360
  for (let i = 0; i < 4; i++) {
    while (globalColorStorageArray[i].h > 360) {
      globalColorStorageArray[i].h = globalColorStorageArray[i].h - 360;
    }
    while (globalColorStorageArray[i].h < 0) {
      globalColorStorageArray[i].h = globalColorStorageArray[i].h + 360;
    }
    globalColorStorageArray[i].h = globalColorStorageArray[i].h % 360;
  }
  //   console.table(globalColorStorageArray);
}

function monochromaticHarmony() {
  //H is kept constant, each color has either more S, less S, more L or less L (only one change on each color).
  globalColorStorageArray[0].s = globalColorStorageArray[0].s - 30;
  globalColorStorageArray[1].s = globalColorStorageArray[1].s + 30;
  globalColorStorageArray[2].l = globalColorStorageArray[2].l - 30;
  globalColorStorageArray[3].l = globalColorStorageArray[3].l + 30;

  //here I use remainder in a loop to make sure s is never below 0 or above 100
  for (let i = 0; i < 4; i++) {
    while (globalColorStorageArray[i].s > 100) {
      globalColorStorageArray[i].s = globalColorStorageArray[i].s - 100;
    }
    while (globalColorStorageArray[i].s < 0) {
      globalColorStorageArray[i].s = globalColorStorageArray[i].s + 100;
    }
    globalColorStorageArray[i].s = globalColorStorageArray[i].s % 100;
  }
  //here I use remainder in a loop to make sure s is never below 0 or above 100
  for (let i = 0; i < 4; i++) {
    while (globalColorStorageArray[i].l > 100) {
      globalColorStorageArray[i].l = globalColorStorageArray[i].l - 100;
    }
    while (globalColorStorageArray[i].l < 0) {
      globalColorStorageArray[i].l = globalColorStorageArray[i].l + 100;
    }
    globalColorStorageArray[i].l = globalColorStorageArray[i].l % 100;
  }
}

function triadHarmony() {
  //Two colors are shifted 60 or 120 degrees from the base.
  //You decide what to do with the two remaining colors. Usually also shifting them, and adjusting the L is prefered.
  globalColorStorageArray[0].h = globalColorStorageArray[0].h + 60;
  globalColorStorageArray[1].h = globalColorStorageArray[1].h + 120;
  globalColorStorageArray[2].h = globalColorStorageArray[2].h - 60;
  globalColorStorageArray[3].h = globalColorStorageArray[3].h - 120;

  //here I use remainder in a loop to make sure h is never below 0 or above 360
  for (let i = 0; i < 4; i++) {
    while (globalColorStorageArray[i].h > 360) {
      globalColorStorageArray[i].h = globalColorStorageArray[i].h - 360;
    }
    while (globalColorStorageArray[i].h < 0) {
      globalColorStorageArray[i].h = globalColorStorageArray[i].h + 360;
    }
    globalColorStorageArray[i].h = globalColorStorageArray[i].h % 360;
  }
}

function complementaryHarmony() {
  //One color is at 180 degrees from the base. You decide how to handle the other three!
  globalColorStorageArray[0].h = globalColorStorageArray[0].h + 180;
  globalColorStorageArray[0].s = globalColorStorageArray[0].s + 30;
  globalColorStorageArray[1].h = globalColorStorageArray[1].h + 180;
  globalColorStorageArray[2].s = globalColorStorageArray[2].s + 30;
  globalColorStorageArray[3].s = globalColorStorageArray[3].s + 60;

  //here I use remainder in a loop to make sure s is never below 0 or above 100
  for (let i = 0; i < 4; i++) {
    while (globalColorStorageArray[i].s > 100) {
      globalColorStorageArray[i].s = globalColorStorageArray[i].s - 100;
    }
    while (globalColorStorageArray[i].s < 0) {
      globalColorStorageArray[i].s = globalColorStorageArray[i].s + 100;
    }
    globalColorStorageArray[i].s = globalColorStorageArray[i].s % 100;
  }
  //here I use remainder in a loop to make sure h is never below 0 or above 360
  for (let i = 0; i < 4; i++) {
    while (globalColorStorageArray[i].h > 360) {
      globalColorStorageArray[i].h = globalColorStorageArray[i].h - 360;
    }
    while (globalColorStorageArray[i].h < 0) {
      globalColorStorageArray[i].h = globalColorStorageArray[i].h + 360;
    }
    globalColorStorageArray[i].h = globalColorStorageArray[i].h % 360;
  }
}

function compoundHarmony() {
  //A combination of complementary and analogous - you decide how many colors are complementary, and how many are analogous
  globalColorStorageArray[0].h = globalColorStorageArray[0].h + 15;
  globalColorStorageArray[1].h = globalColorStorageArray[1].h + 90;
  globalColorStorageArray[2].h = globalColorStorageArray[0].h + 180;
  globalColorStorageArray[2].s = globalColorStorageArray[0].s + 30;
  globalColorStorageArray[3].h = globalColorStorageArray[1].h + 180;
  //here I use remainder in a loop to make sure s is never below 0 or above 100
  for (let i = 0; i < 4; i++) {
    while (globalColorStorageArray[i].s > 100) {
      globalColorStorageArray[i].s = globalColorStorageArray[i].s - 100;
    }
    while (globalColorStorageArray[i].s < 0) {
      globalColorStorageArray[i].s = globalColorStorageArray[i].s + 100;
    }
    globalColorStorageArray[i].s = globalColorStorageArray[i].s % 100;
  }
  //here I use remainder in a loop to make sure h is never below 0 or above 360
  for (let i = 0; i < 4; i++) {
    while (globalColorStorageArray[i].h > 360) {
      globalColorStorageArray[i].h = globalColorStorageArray[i].h - 360;
    }
    while (globalColorStorageArray[i].h < 0) {
      globalColorStorageArray[i].h = globalColorStorageArray[i].h + 360;
    }
    globalColorStorageArray[i].h = globalColorStorageArray[i].h % 360;
  }
}

function shadesHarmony() {
  //H is kept constant, a so is S, but L varies for each color.
  globalColorStorageArray[0].l = globalColorStorageArray[0].l + 15;
  globalColorStorageArray[1].l = globalColorStorageArray[1].l + 30;
  globalColorStorageArray[2].l = globalColorStorageArray[2].l + 45;
  globalColorStorageArray[3].l = globalColorStorageArray[3].l + 70;

  for (let i = 0; i < 4; i++) {
    while (globalColorStorageArray[i].l > 100) {
      globalColorStorageArray[i].l = globalColorStorageArray[i].l - 100;
    }
    while (globalColorStorageArray[i].l < 0) {
      globalColorStorageArray[i].l = globalColorStorageArray[i].l + 100;
    }
    globalColorStorageArray[i].l = globalColorStorageArray[i].l % 100;
  }
}

//----------------------------Convertion of color values
function translateValues() {
  for (let i = 0; i < 5; i++) {
    globalColorStorageArray[i].hex = RGBtoHEX({ r: HSLtoRGB(globalColorStorageArray[i]).r, g: HSLtoRGB(globalColorStorageArray[i]).g, b: HSLtoRGB(globalColorStorageArray[i]).b });
    globalColorStorageArray[i].css = RGBtoCSS({ r: HSLtoRGB(globalColorStorageArray[i]).r, g: HSLtoRGB(globalColorStorageArray[i]).g, b: HSLtoRGB(globalColorStorageArray[i]).b });
  }
  console.table(globalColorStorageArray);
}

function HEXtoRGB(hexvalue) {
  //we recieve the value of HEX through the parameter

  //we want to translate it into an object like this one
  //I split the HEX-color into three components, and convert those hexadecimal values to actual numbers

  let rValue = hexvalue.substring(1, 3);
  let bValue = hexvalue.substring(3, 5);
  let gValue = hexvalue.substring(5, 7);

  rValue = parseInt(rValue, 16);
  bValue = parseInt(bValue, 16);
  gValue = parseInt(gValue, 16);

  const RGBvalue = {
    r: rValue,
    b: bValue,
    g: gValue,
  };

  return RGBvalue;
}

function RGBtoCSS(rgbvalue) {
  return `rgb(${rgbvalue.r},${rgbvalue.g},${rgbvalue.b})`;
}

function RGBtoHEX(rgbvalue) {
  let rValue = rgbvalue.r;
  let bValue = rgbvalue.b;
  let gValue = rgbvalue.g;

  rValue = rValue.toString(16).padEnd(2, 0);
  bValue = bValue.toString(16).padEnd(2, 0);
  gValue = gValue.toString(16).padEnd(2, 0);

  const HEXvalue = "#" + rValue + bValue + gValue;
  //   console.log(HEXvalue);

  return HEXvalue;
}

function RGBtoHSL(rgbvalue) {
  // console.log(rgbvalue);
  let r = rgbvalue.r;
  let b = rgbvalue.b;
  let g = rgbvalue.g;

  r /= 255;
  g /= 255;
  b /= 255;

  // console.log(rgbvalue);

  let h, s, l;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = 60 * (0 + (g - b) / (max - min));
  } else if (max === g) {
    h = 60 * (2 + (b - r) / (max - min));
  } else if (max === b) {
    h = 60 * (4 + (r - g) / (max - min));
  }

  if (h < 0) {
    h = h + 360;
  }

  l = (min + max) / 2;

  if (max === 0 || min === 1) {
    s = 0;
  } else {
    s = (max - l) / Math.min(l, 1 - l);
  }
  // multiply s and l by 100 to get the value in percent, rather than [0,1]
  s *= 100;
  l *= 100;

  // console.log("hsl(%f,%f%,%f%)", h, s, l); // just for testing
  const HSLvalue = {
    h: Math.round(h),
    s: Math.round(s),
    l: Math.round(l),
  };
  return HSLvalue;
}

function HSLtoRGB(hslvalue) {
  let h = hslvalue.h;
  let s = hslvalue.s;
  let l = hslvalue.l;

  h = h;
  s = s / 100;
  l = l / 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

//----------------------------Display

function displayColor() {
  for (let i = 0; i < 5; i++) {
    document.querySelector(`.smallColorContainer${i + 1} .colorDisplayBox`).style.backgroundColor = globalColorStorageArray[i].hex;
  }
}

function displayColorValues() {
  for (let i = 0; i < 5; i++) {
    document.querySelector(`.smallColorContainer${i + 1} .hexValue span`).textContent = globalColorStorageArray[i].hex;
    document.querySelector(`.smallColorContainer${i + 1} .rgbValue span`).textContent = globalColorStorageArray[i].css;
    document.querySelector(`.smallColorContainer${i + 1} .hslValue span`).textContent = `${globalColorStorageArray[i].h}°, ${globalColorStorageArray[i].s}%, ${globalColorStorageArray[i].l}%`;
  }
}
