document.addEventListener("DOMContentLoaded", function () {
  const progressContainer = document.getElementById("progress");
  const progressArc = document.getElementById("progress-arc");
  const progressSvg = document.getElementById("progress-svg");
  const valueInput = document.getElementById("value");
  const animateCheckbox = document.getElementById("animate");
  const hideCheckbox = document.getElementById("hide");
  const errorMessage = document.getElementById("error-message");

  valueInput.addEventListener("input", updateProgress);
  animateCheckbox.addEventListener("change", toggleAnimation);
  hideCheckbox.addEventListener("change", toggleVisibility);

  function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");

    return d;
  }

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  function updateProgress() {
    const value = parseInt(valueInput.value, 10);

    if (value < 0 || value > 100 || isNaN(value)) {
      valueInput.classList.add("error");
      errorMessage.textContent = "Please enter a value between 0 and 100";
      animateCheckbox.checked = false;
      animateCheckbox.disabled = true;
      toggleAnimation();
      return;
    } else {
      valueInput.classList.remove("error");
      errorMessage.textContent = "";
      animateCheckbox.disabled = false;
    }

    const endAngle = (value / 100) * 360;
    const d = describeArc(50, 50, 45, 0, endAngle === 360 ? 359.99 : endAngle);
    progressArc.setAttribute("d", d);
  }

  function toggleAnimation() {
    if (animateCheckbox.checked) {
      progressSvg.classList.add("animated");
    } else {
      progressSvg.classList.remove("animated");
      void progressSvg.offsetWidth;
    }
  }

  function toggleVisibility() {
    progressContainer.style.display = hideCheckbox.checked ? "none" : "flex";
  }

  updateProgress();
});
