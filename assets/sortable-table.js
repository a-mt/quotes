
var collator = new Intl.Collator("en");

function Sort(table) {
  const TBODY = ".table__tbody",
        THEAD = ".table__thead",
        TR    = ".table__tr";

  var tbody = table.querySelector(TBODY),
      thead = table.querySelector(THEAD);

  /**
   * Add sort btn + event listeners
   */
  this.init = function() {
    table.querySelectorAll(".sortable__col").forEach(function(th, i){
      th.dataset.cellIndex = i;
      th.innerHTML += '<div class="actions">'
             +  '<button class="sort sort-asc">&#x025B4</button>'
             +  '<button class="sort sort-desc">&#x025BE;</button>'
             + '</div>';
    });

    thead.querySelectorAll(".sort").forEach(function(btn){
      btn.addEventListener('click', this.handleSort);
    }, this);
  }

  /**
   * Click btn: sort rows
   */
  this.handleSort = function(e) {
    var asc   = e.target.classList.contains("sort-asc"),
      column  = e.target.parentNode.parentNode,
      index   = column.dataset.cellIndex,
      numeric = column.classList.contains("numeric");

    // Reverse order ?
    if(column.classList.contains("is-active")) {

      // Change classes
      if(column.classList.contains("sort-" + (asc ? "asc" : "desc"))) {
        return;
      }
      column.classList.remove("sort-" + (asc ? "desc" : "asc"));
      column.classList.add("sort-" + (asc ? "asc" : "desc"));

      // Reorder rows
      var rows = [].slice.call(tbody.querySelectorAll(TR));
      tbody.innerHTML = "";

      for (var i = rows.length - 1; i >= 0; i--){
        tbody.appendChild(rows[i]);
      }

    } else {
      // Change classes
      thead.querySelectorAll(".is-active").forEach(function(th){
        th.classList.remove("is-active");
        th.classList.remove("sort-asc");
        th.classList.remove("sort-desc");
      });
      column.classList.add("is-active");
      column.classList.add("sort-" + (asc ? "asc" : "desc"));

      // Reorder rows
      var rows = [].slice.call(tbody.querySelectorAll(TR));

      rows = rows.sort(function(a, b){
        var vA = a.children[index].innerText,
           vB = b.children[index].innerText;

        if(numeric) {
          return parseFloat(vA) - parseFloat(vB);
        } else {
          return collator.compare(vA,vB);
        }
      });

      tbody.innerHTML = "";
      if(asc) {
        for (var i = 0; i < rows.length; i++){
          tbody.appendChild(rows[i]);
        }
      } else {
        for (var i = rows.length - 1; i >= 0; i--){
          tbody.appendChild(rows[i]);
        }
      }
    }
  }
  this.init();
}

function initListeners(){
  var tableList = document.querySelectorAll(".sortable");

  for(var i=0; i<tableList.length; i++) {
    new Sort(tableList[i]);
  }
}

window.onload = function(){
  setTimeout(initListeners, 1);
}
