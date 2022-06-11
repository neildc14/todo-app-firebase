export default function renderDefaultDocument() {
  let htmlElement = `<div>
      <div class="to-do-lists-filters">
        <p class="to-do-items-left m-0 item-filter"> 0 item left</p>
        <div class="to-do-filter-options-desktop">
          <div class="filter">All</div>
          <div class="filter">Active</div>
          <div class="filter">Completed</div>
        </div>
        <div class="to-do-filter-clear-completed item-filter">
          Clear Completed
        </div>
      </div>
    </div>`;
  toDoLists.innerHTML = htmlElement;
}
