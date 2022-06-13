//globals
let themeProviderBtn = document.getElementById("themeProvider");
let body = document.querySelector("body");
let header = document.querySelector("header");
let toDoLists = document.getElementById("toDoLists");
let todoListBracket = document.getElementById("odoListBracket");

let inputNewToDo = document.getElementById("inputNewToDo");
let filterAll = document.querySelectorAll(".to-do-filter-all");
let filterActive = document.querySelectorAll(".to-do-filter-active");
let filterComplete = document.querySelectorAll(".to-do-filter-complete");

//imports
import renderDefaultDocument from "./render.js";
/*themeprovider */
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
      if (querySnapshot.size !== 0 || querySnapshot.size > 0) {
        let docItems = [];
        querySnapshot.forEach((doc) => {
          docItems.push({ id: doc.id, ...doc.data() });
          return renderDocument(docItems);
        });
      }
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

    htmlElement += `<div class="to-do-list ${
      doc.status == "completed" ? "complete" : "active"
    }"
    id="todoListBracket">
      <div class="checkbox-container">
        <div class="checkbox ${
          doc.status == "completed" ? "check-filled" : "active"
        }" data-id=${doc.id}>
          <img
            src="images/icon-check.svg"
            alt="checkbox button"
          />
        </div>
      </div> 
      <div class="to-do-text  ${
        doc.status == "completed" ? "check-text" : "active"
      }">
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

const createEventListeners = () => {
  let closeBtns = document.querySelectorAll(".close-button");
  let checkMarksBtn = document.querySelectorAll(".checkbox");
  let clearCompleteBtn = document.querySelectorAll(
    ".to-do-filter-clear-completed"
  );

  closeBtns.forEach((closeBtn) => {
    closeBtn.addEventListener("click", function handler() {
      deleteItem(closeBtn.dataset.id);
      this.removeEventListener("click", handler);
    });
  });

  checkMarksBtn.forEach((checkMark) => {
    checkMark.addEventListener("click", function handlerListener() {
      completedItem(checkMark.dataset.id);
      this.removeEventListener("click", handlerListener);
    });
  });

  clearCompleteBtn.forEach((clearComplete) => {
    clearComplete.addEventListener("click", function handlerListener() {
      clearCompleted();
      this.removeEventListener("click", handlerListener);
    });
  });
};

function deleteItem(id) {
  db.collection("todos")
    .doc(id)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
      // getItemFromDatabase();
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
      console.log(doc.data());
      if (status === "active") {
        toDosRef.update({
          status: "completed",
        });

        filterActivated();
      } else if (status === "completed") {
        toDosRef.update({
          status: "active",
        });

        filterActivated();
      }
    }
  });
}

function filterActivated() {
  let filterActivated = document.querySelectorAll(".filter-active");
  console.log(filterActivated[0]);

  if (filterActivated[0].classList.contains("to-do-filter-all"))
    return getItemFromDatabase();
  if (filterActivated[0].classList.contains("to-do-filter-active"))
    return activeFunction();

  if (filterActivated[0].classList.contains("to-do-filter-complete"))
    return completedFunction();
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
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

filterAll.forEach((all) => {
  all.classList.add("filter-active");
  all.addEventListener("click", function () {
    all.classList.add("filter-active");
    filterActive.forEach((active) => {
      active.classList.remove("filter-active");
    });
    filterComplete.forEach((complete) => {
      complete.classList.remove("filter-active");
    });
    getItemFromDatabase();
  });
});

filterActive.forEach((active) => {
  active.addEventListener("click", function () {
    active.classList.add("filter-active");
    filterAll.forEach((all) => {
      all.classList.remove("filter-active");
    });
    filterComplete.forEach((complete) => {
      complete.classList.remove("filter-active");
    });

    activeFunction();
  });
});

filterComplete.forEach((complete) => {
  complete.addEventListener("click", function () {
    complete.classList.add("filter-active");
    filterAll.forEach((all) => {
      all.classList.remove("filter-active");
    });
    filterActive.forEach((active) => {
      active.classList.remove("filter-active");
    });

    completedFunction();
  });
});

function activeFunction() {
  // getDBCollection("active");

  setFilter("complete");
}

function completedFunction() {
  // getDBCollection("completed");
  setFilter("active");
}

//facade design pattern
// function getDBCollection(status) {
//   db.collection("todos")
//     .where("status", "==", status)
//     .orderBy("createdAt", "asc")
//     .onSnapshot((querySnapshot) => {
//       if (querySnapshot.size === 0) return renderDefaultDocument();
//       if (querySnapshot.size !== 0 && querySnapshot.size > 0) {
//         let collectionItem = [];
//         querySnapshot.forEach((doc) => {
//           collectionItem.push({ id: doc.id, ...doc.data() });
//           renderDocument(collectionItem);
//         });
//       }
//     });
// }

function setFilter(filterType) {
  let todoList = document.querySelectorAll(".to-do-list");
  todoList.forEach((todo) => {
    if (todo.classList.contains(filterType)) {
      todo.classList.add("remove");
    } else {
      todo.classList.remove("remove");
    }
  });
}
