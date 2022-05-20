//screen lighting
const screenLighting = document.getElementById("screenLighting");
screenLighting.addEventListener("click", screenMode);

const body = document.body.style.setProperty(
  "background-color",
  " hsl(0, 0%, 98%)"
);

function screenMode() {
  let header = document.querySelector("header");
  let inputToDo = document.getElementById("inputToDo");
  let sunIcon = "images/icon-sun.svg";
  let moonIcon = "images/icon-moon.svg";

  if (screenLighting.getAttribute("src") === sunIcon) {
    screenLighting.setAttribute("src", "images/icon-moon.svg");
    header.style.setProperty(
      "background-image",
      'url("images/bg-desktop-dark.jpg")'
    );
    document.body.style.setProperty("background-color", "hsl(235, 21%, 11%)");
    inputToDo.style.cssText = `background-color: hsl(235, 24%, 19%); 
    color:hsl(0, 0%, 98%) !important`;
  } else if (screenLighting.getAttribute("src") === moonIcon) {
    screenLighting.setAttribute("src", "images/icon-sun.svg");
    header.style.setProperty(
      "background-image",
      'url("images/bg-desktop-light.jpg")'
    );
    document.body.style.setProperty("background-color", "hsl(0, 0%, 98%)");
    inputToDo.style.cssText = `background-color:hsl(0, 0%, 98%); 
    color: hsl(235, 24%, 19%) !important`;
  }
}

//-input to do
const inputToDo = document.getElementById("inputToDo");
const addBtn = document.getElementById("addToDo");
const toDo = document.getElementById("toDo");
const toDos = document.getElementById("toDos");
const allToDos = document.getElementById("allToDos");

const todoArray = [];
console.log(todoArray);
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputToDo.value !== null && inputToDo.value !== "") {
    todoArray.unshift(inputToDo.value);
    console.log(todoArray);
    extractedToDos();
    clearInput();
  }
});

function extractedToDos() {
  let htmlElement = '<li class="createdList">';

  for (let i = 0; i < todoArray.length; i++) {
    console.log(todoArray);
    let index = todoArray[i];
    console.log(index);
    htmlElement += '<div class="to-do">';
    htmlElement +=
      '<img src="images/icon-check.svg" alt="checkbox button" class="check"/>';
    htmlElement += '<div class="indication-paragraph">';
    htmlElement += '<p id="toDo">' + todoArray[i] + "</p>";
    htmlElement += "</div>";
    htmlElement +=
      '<img src="images/icon-cross.svg" alt="close button" class="cross-out" id="crossOut" onclick="clicked(index)" onmouseover="crossDisplay()"/>';
    htmlElement += "</div>";
  }

  htmlElement += "</li>";
  allToDos.innerHTML = htmlElement;
}

//clear inputToDo
function clearInput() {
  inputToDo.value = "";
}

function crossDisplay() {
  this.style.setProperty("opactiy", "0");
}

//remove todo
function clicked(i) {
  alert(i);
}
