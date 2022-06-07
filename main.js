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
  }
}

inputNewToDo.removeEventListener("keyup", addNewToDo);

function getItemFromDatabase() {
  db.collection("todos")
    .orderBy("createdAt", "asc")
    .onSnapshot((querySnapshot) => {
      if (querySnapshot.size === 0) return renderDefaultDocument();
      let docItems = [];
      querySnapshot.forEach((doc) => {
        docItems.push({ id: doc.id, ...doc.data() });
        return renderDocument(docItems);
      });
    });
}

getItemFromDatabase();

function renderDocument(docItem) {
  let htmlElement = "<div>";
  let completed = [];

  docItem.map((doc) => {
    if (doc.status === "completed") {
      completed.push(doc);
    }

    htmlElement += `<div class="to-do-list"
    id="todoListBracket">
      <div class="checkbox-container">
        <div class="checkbox ${
          doc.status == "completed" ? "check-filled" : ""
        }" data-id=${doc.id}>
          <img
            src="images/icon-check.svg"
            alt="checkbox button"
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
    <p class="to-do-items-left m-0 item-filter">${
      docItem.length - completed.length
    } item(s) left</p>
    <div class="to-do-filter-options-desktop">
      <div class="to-do-filter-all filter">All</div>
      <div class="to-do-filter-active filter">Active</div>
      <div class="to-do-filter-complete filter">Completed</div>
    </div>
    <div class="to-do-filter-clear-completed item-filter">
      Clear Completed
    </div>
  </div>
</div>`;
  toDoLists.innerHTML = htmlElement;
  createEventListeners();
}

function renderDefaultDocument() {
  let htmlElement = `<div>
    <div class="to-do-lists-filters">
      <p class="to-do-items-left m-0 item-filter"> 0 item(s) left</p>
      <div class="to-do-filter-options-desktop">
        <div class="to-do-filter-all filter">All</div>
        <div class="to-do-filter-active filter">Active</div>
        <div class="to-do-filter-complete filter">Completed</div>
      </div>
      <div class="to-do-filter-clear-completed item-filter">
        Clear Completed
      </div>
    </div>
  </div>`;
  toDoLists.innerHTML = htmlElement;
}

const createEventListeners = () => {
  let closeBtns = document.querySelectorAll(".close-button");
  let checkMarksBtn = document.querySelectorAll(".checkbox");
  let clearCompleteBtn = document.querySelectorAll(
    ".to-do-filter-clear-completed"
  );

  closeBtns.forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      deleteItem(closeBtn.dataset.id);
    });
  });

  checkMarksBtn.forEach((checkMark) => {
    checkMark.addEventListener("click", () => {
      completedItem(checkMark.dataset.id);
    });
  });

  clearCompleteBtn.forEach((clearComplete) => {
    clearComplete.addEventListener("click", () => {
      clearCompleted();
    });
  });
};

function deleteItem(id) {
  db.collection("todos")
    .doc(id)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
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

        filters();
      } else if (status === "completed") {
        toDosRef.update({
          status: "active",
        });

        filters();
      }
    }
  });
}

function clearCompleted() {
  db.collection("todos")
    .where("status", "==", "completed")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    })
    .then(() => {
      console.log("Clear Successful");
      getItemFromDatabase();
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

const filters = () => {
  let filterAll = document.querySelectorAll(".to-do-filter-all");
  let filterActive = document.querySelectorAll(".to-do-filter-active");
  let filterComplete = document.querySelectorAll(".to-do-filter-complete");

  filterAll.forEach((all) => {
    all.classList.add("filter-active");
    all.addEventListener("click", function handler() {
      all.classList.add("filter-active");
      filterActive.forEach((active) => {
        active.classList.remove("filter-active");
      });
      filterComplete.forEach((complete) => {
        complete.classList.remove("filter-active");
      });
      allFunction();
      console.log(this);
      // this.removeEventListener("click", handler);
    });
  });

  filterActive.forEach((active) => {
    active.addEventListener("click", function handler() {
      active.classList.add("filter-active");
      filterAll.forEach((all) => {
        all.classList.remove("filter-active");
      });
      filterComplete.forEach((complete) => {
        complete.classList.remove("filter-active");
      });

      activeFunction();
      console.log(this);
      // this.removeEventListener("click", handler);
    });
  });

  filterComplete.forEach((complete) => {
    complete.addEventListener("click", function handler() {
      complete.classList.add("filter-active");
      filterAll.forEach((all) => {
        all.classList.remove("filter-active");
      });
      filterActive.forEach((active) => {
        active.classList.remove("filter-active");
      });

      completedFunction();
      console.log(this);
      // this.removeEventListener("click", handler);
    });
  });

  function allFunction() {
    getItemFromDatabase();
  }

  function activeFunction() {
    db.collection("todos")
      .where("status", "==", "active")
      .orderBy("createdAt", "asc")
      .onSnapshot((querySnapshot) => {
        let activeItem = [];
        querySnapshot.forEach((doc) => {
          activeItem.push({ id: doc.id, ...doc.data() });
          renderDocument(activeItem);
          console.log(activeItem);
        });
      });
  }

  function completedFunction() {
    db.collection("todos")
      .where("status", "==", "completed")
      .orderBy("createdAt", "asc")
      .onSnapshot((querySnapshot) => {
        let completedItem = [];
        querySnapshot.forEach((doc) => {
          completedItem.push({ id: doc.id, ...doc.data() });
          renderDocument(completedItem);
        });
      });
  }
};

filters();
