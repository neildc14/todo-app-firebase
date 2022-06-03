//globals
const themeProviderBtn = document.getElementById("themeProvider");
const body = document.querySelector("body");
const header = document.querySelector("header");
const toDoLists = document.getElementById("toDoLists");
const todoListBracket = document.getElementById("odoListBracket");
const warningText = document.getElementById("warningText");
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
    inputNewToDo.value.toLowerCase();
  }
}

htmlElement += `<div class="to-do-list" 
    id="todoListBracket">
  <div class="checkbox-container" 
  data-check="incomplete" 
  onclick="checkToDoItemComplete(this)">
    <div class="checkbox">
      <img
        src="images/icon-check.svg"
        alt="checkbox button"
        id="checkboxBtn"
      />
    </div>
  </div>
  <div class="to-do-text" data-check="incomplete">
  ${element[i]}</div>
  <div class="close-button-container"
  id="closeBtn" 
  data-active="false" 
  onclick="deleteItem(this)">
    <div class="close-button">
      <img src="images/icon-cross.svg" 
      alt="close button" />
    </div>
  </div>
</div>
`;

htmlElement += `<div class="to-do-lists-filters">
  <p class="to-do-items-left m-0 item-filter">
  ${toDoCounter} 
  items left</p>
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
