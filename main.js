const themeProviderBtn = document.getElementById("themeProvider");
const body = document.querySelector("body");
const header = document.querySelector("header");

const toDoLists = document.getElementById("toDoLists");
const todoListBracket = document.getElementById("odoListBracket");

//variable for inputs
const inputNewToDo = document.getElementById("inputNewToDo");

/*themprovider */
themeProviderBtn.addEventListener("click", themeProviderFunc);

function themeProviderFunc() {
  if (body.dataset["theme"] === "darkTheme") {
    themeProviderBtn.setAttribute("src", "images/icon-sun.svg");
    body.setAttribute("data-theme", "lightTheme");
  } else {
    themeProviderBtn.setAttribute("src", "images/icon-moon.svg");
    body.setAttribute("data-theme", "darkTheme");
  }
}

/*input to add to do list */
inputNewToDo.addEventListener("keypress", addNewToDo);

function addNewToDo(event) {
  if (inputNewToDo.value !== "" && event.key === "Enter") {
    let NEW_TODO_VALUE = inputNewToDo.value.toLowerCase();

    if (localStorage.getItem("data") == null) {
      localStorage.setItem("data", "[]");
    }

    let old_todo = JSON.parse(localStorage.getItem("data"));
    old_todo.push(NEW_TODO_VALUE);
    localStorage.setItem("data", JSON.stringify(old_todo));
    inputNewToDo.value = "";
  }
}

let LOCAL_STORAGE = JSON.parse(localStorage.getItem("data"));
console.log(LOCAL_STORAGE);
// LOCAL_STORAGE.forEach(addToLists);

// function addToLists(currentValue, index) {
//   console.log(currentValue, index);
//   let htmlElement = `<div class="to-do-list" id="todoListBracket">
//   <div class="checkbox-container">
//     <div class="checkbox">
//       <img
//         src="images/icon-check.svg"
//         alt="checkbox button"
//         id="checkboxBtn"
//       />
//     </div>
//   </div>
//   <div class="to-do-text">${currentValue}${index}</div>
//   <div class="close-button-container" id="closeBtn">
//     <div class="close-button">
//       <img src="images/icon-cross.svg" alt="close button" />
//     </div>
//   </div>
// </div>`;

//   toDoLists.innerHTML = htmlElement;
// }
function loop() {
  let htmlElement = "<div>";
  for (let i = 0; i < LOCAL_STORAGE.length; i++) {
    htmlElement += `<div class="to-do-list" id="todoListBracket">
    <div class="checkbox-container">
      <div class="checkbox">
        <img
          src="images/icon-check.svg"
          alt="checkbox button"
          id="checkboxBtn"
        />
      </div>
    </div>
    <div class="to-do-text">${LOCAL_STORAGE[i]}</div>
    <div class="close-button-container closeBtn" data-close-btn="closeBtn">
      <div class="close-button">
        <img src="images/icon-cross.svg" alt="close button" />
      </div>
    </div>
  </div>
  `;
  }
  htmlElement += `<div class="to-do-lists-filters">
    <p class="to-do-items-left m-0 item-filter">5 items left</p>
    <div class="to-do-filter-options-desktop">
      <div class="to-do-filter-all filter">All</div>
      <div class="to-do-filter-active filter">Active</div>
      <div class="to-do-filter-all filter">Completed</div>
    </div>
    <div class="to-do-filter-clear-completed item-filter">
      Clear Completed
    </div>
  </div>
  </div>`;
  htmlElement += "</div>";
  toDoLists.innerHTML = htmlElement;
}

loop();

/*closeBtn function */
const checkboxBtn = document.getElementById("checkboxBtn");
const closeBtn = document.querySelector(".closeBtn");
closeBtn.addEventListener("click", crossOutFunction);

function crossOutFunction() {
  this.parentElement.style.display = "none";
  console.log(this.parentElement);
  localStorage.removeItem("data");
}
