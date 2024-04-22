const startBtn = document.getElementById("start");
const instructionsBtn = document.getElementById("instructions");
const creditsBtn = document.getElementById("credits");
const donateBtn = document.getElementById("donate");
const soundBtn = document.getElementById("sound");
const soundIcons = {
  soundOn: "&#128266",
  soundOff: "&#128264",
};
const donateToast = document.getElementById("donate-toast");
const sign = {
  element: document.getElementById("sign"),
  signAnimationReady: true,
  signInterval: "",
  r: 90,
  g: 90,
  b: 90,
  blinkCounter: 0,
};
const coffees = document.querySelector("#coffee-counter span");
let coffeeCount = 0;

const blink = (mode) => {
  const intervalChange = 20;
  if (mode === "up") {
    clearInterval(sign.signInterval);
    sign.signInterval = setInterval(() => {
      sign.r < 255 ? (sign.r += intervalChange) : (sign.r = 255);
      sign.g < 255 ? (sign.g += intervalChange) : (sign.g = 255);
      sign.b < 255 ? (sign.b += intervalChange) : (sign.b = 255);
      sign.element.style.color = `rgb(${sign.r}, ${sign.g}, ${sign.b})`;
      if (sign.r === 255) blink("down");
    }, 10);
  } else if (mode === "down") {
    clearInterval(sign.signInterval);
    sign.signInterval = setInterval(() => {
      sign.r > 90 ? (sign.r -= intervalChange) : (sign.r = 90);
      sign.g > 90 ? (sign.g -= intervalChange) : (sign.g = 90);
      sign.b > 90 ? (sign.b -= intervalChange) : (sign.b = 90);
      sign.element.style.color = `rgb(${sign.r}, ${sign.g}, ${sign.b})`;
      if (sign.r === 90) {
        sign.blinkCounter++;
        if (sign.blinkCounter < 3) {
          blink("up");
        } else {
          clearInterval(sign.signInterval);
          sign.blinkCounter = 0;
        }
      }
    }, 10);
    sign.signAnimationReady = true;
  }
};
