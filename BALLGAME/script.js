const randomNumber = Math.floor(Math.random() * 10) + 1;
let attempts = 0;
const maxAttempts = 6;

const slider = document.getElementById("slider");
const numbersDiv = document.getElementById("numbers");
const attemptText = document.getElementById("attempt");
const resultText = document.getElementById("result");

// Create number circles
for (let i = 1; i <= 10; i++) {
  const circle = document.createElement("div");
  circle.classList.add("circle");
  circle.innerText = i;
  numbersDiv.appendChild(circle);
}

slider.addEventListener("input", () => {
  const guess = parseInt(slider.value);
  attempts++;

  const circles = document.querySelectorAll(".circle");
  circles.forEach(c => c.style.background = "cyan"); // reset

  const selectedCircle = circles[guess - 1];

  if (guess < randomNumber) {
    selectedCircle.style.background = "goldenrod";
  } else if (guess > randomNumber) {
    selectedCircle.style.background = "red";
  } else {
    selectedCircle.style.background = "green";
    resultText.innerText = `You Win! Guessed correctly in ${attempts} attempts.`;
    slider.disabled = true;
    return;
  }

  attemptText.innerText = `Attempt No. ${attempts}`;

  if (attempts >= maxAttempts && guess !== randomNumber) {
    resultText.innerText = `Game Over! The correct number was ${randomNumber}.`;
    slider.disabled = true;
  }
});
