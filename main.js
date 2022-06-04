//globals
let themeProviderBtn = document.getElementById("themeProvider");
let body = document.querySelector("body");
let header = document.querySelector("header");
let toDoLists = document.getElementById("toDoLists");
let todoListBracket = document.getElementById("odoListBracket");
let warningText = document.getElementById("warningText");
let inputNewToDo = document.getElementById("inputNewToDo");

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
    let newInput = inputNewToDo.value.toLowerCase();

    const timestamp = firebase.firestore.FieldValue.serverTimestamp;

    db.collection("todos")
      .add({
        todo: newInput,
        status: "active",
        createdAt: timestamp(),
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });

    inputNewToDo.value = "";

    getItemFromDatabase();
  }
}

function getItemFromDatabase() {
  db.collection("todos")
    .get()
    .then((querySnapshot) => {
      let docItems = [];
      querySnapshot.forEach((doc) => {
        docItems.push({ id: doc.id, ...doc.data() });
        renderDocument(docItems);
      });
    });
}
getItemFromDatabase();

function renderDocument(docItem) {
  let htmlElement = "<div>";
  docItem.map((doc) => {
    htmlElement += `<div class="to-do-list"
    id="todoListBracket">
  <div class="checkbox-container">
    <div class="checkbox ${
      doc.status == "completed" ? "check-filled" : ""
    }" data-id=${doc.id}>
      <img
        src="images/icon-check.svg"
        alt="checkbox button"
        class="${doc.status == "completed" ? "check-image" : ""}"
      />
    </div>
  </div> 
  <div class="to-do-text  ${
    doc.status == "completed" ? "check-text" : ""
  }" data-check="incomplete">
  ${doc.todo}</div>
  <div class="close-button-container">
    <div class="close-button" data-id=${doc.id}>
      <img src="images/icon-cross.svg"
      alt="close button" />
    </div>
  </div>
</div>`;
  });
  htmlElement += `<div class="to-do-lists-filters">
  <p class="to-do-items-left m-0 item-filter">${docItem.length} item(s) left</p>
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
  toDoLists.innerHTML = htmlElement;
  createEventListeners();
}

function createEventListeners() {
  let closeBtns = document.querySelectorAll(".close-button");
  let checkMarks = document.querySelectorAll(".checkbox");
  closeBtns.forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      deleteItem(closeBtn.dataset.id);
    });
  });

  checkMarks.forEach((checkMark) => {
    checkMark.addEventListener("click", () => {
      completedItem(checkMark.dataset.id);
    });
  });
}

function deleteItem(id) {
  console.log("click");
  db.collection("todos")
    .doc(id)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
      getItemFromDatabase();
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

function completedItem(id) {
  var toDosRef = db.collection("todos").doc(id);
  toDosRef.get().then((doc) => {
    if (doc.exists) {
      let status = doc.data().status;

      if (status === "active") {
        toDosRef.update({
          status: "completed",
        });

        getItemFromDatabase();
      } else if (status === "completed") {
        toDosRef.update({
          status: "active",
        });

        getItemFromDatabase();
      }
    }
  });
}
