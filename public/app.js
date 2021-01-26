window.addEventListener("resize", () => {
  document.body.height = window.innerHeight;
});

const form = document.querySelector("#form");
const codeInput = document.querySelector("#code-input");
const theGoods = document.querySelector("#hires");

const verifyCode = function (e) {
  let theCode = codeInput.value;
  if (theCode === "hires" || "Hires") {
   theGoods.className = "show";
   form.className = "hide";
   e.preventDefault();
  } else {
    alert("sorry no");
  }
};

form.addEventListener("submit", verifyCode);

