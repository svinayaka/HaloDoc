(function () {
  var HACKERAPI = "http://hn.algolia.com/api/v1/search?query=";
  var WIKIAPI =
    "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=";

  var inputSearchElm = document.getElementById("searchInput");
  var searchTypeElm = document.getElementById("searchType");
  var searchBtnElm = document.getElementById("searchBtn");
  var docFragment = null;
  var tBodyElm = document.getElementById("hackerInformation");
  var wikiElm = document.getElementById("wikiInformation");

  var hackerInformation = [];
  searchBtnElm.addEventListener("click", function () {
    if (!inputSearchElm.value) return alert("Need search value");
    docFragment = document.createDocumentFragment();
    var hackerView = document.getElementById("hackerSearch");
    var wikiView = document.getElementById("wikiSearch");
    var waiterElm = document.getElementById("waiter");
    var searchTerm = inputSearchElm.value;
    var searchTypeSelected = searchTypeElm.value;
    switch (searchTypeSelected) {
      case "hacker":
        waiterElm.style.display = "block";
        hackerView.style.display = "none";
        tBodyElm.innerHTML = "";
        fetch(HACKERAPI + searchTerm)
          .then((resp) => resp.json())
          .then((resp) => {
            if (resp && resp.hits) {
              for (let i = 0; i < resp.hits.length; i++) {
                hackerInformationCompletion(resp.hits[i], resp.hits[i].author);
                waiterElm.style.display = "none";
                hackerView.style.display = "block";
              }
            } else {
              return alert("No response returned");
            }
          })
          .catch((err) => {
            waiterElm.style.display = "none";
            hackerView.style.display = "block";
            alert("error occured");
          });
        break;
        case "wiki":
        waiterElm.style.display = "block";
        hackerView.style.display = "none";
        fetch(WIKIAPI + searchTerm + "&origin=*")
          .then((resp) => resp.json())
          .then((resp) => {
            docFragment.appendChild(displayWiki(resp));
              wikiElm.appendChild(docFragment);
              waiterElm.style.display = "none";
        hackerView.style.display = "block";
          });
        break;
    }
  });

  function hackerInformationCompletion(resp, author) {
    hackerInformation;
    fetch("http://hn.algolia.com/api/v1/users/" + author)
      .then((resp) => resp.json())
      .then((authorResponse) => {
        var createdRow = createTableRow(resp, authorResponse);
        docFragment.appendChild(createdRow);
          tBodyElm.appendChild(docFragment);
      })
      .catch((err) => {
        waiterElm.style.display = "none";
        hackerView.style.display = "block";
        alert("error occured");
      });
  }

  searchTypeElm.addEventListener("change", function () {
    var searchTypeSelected = searchTypeElm.value;
    var hackerView = document.getElementById("hackerSearch");
    var wikiView = document.getElementById("wikiSearch");
    switch (searchTypeSelected) {
      case "hacker":
        hackerView.style.display = "block";
        wikiView.style.display = "none";
        break;
      case "wiki":
        hackerView.style.display = "none";
        wikiView.style.display = "block";
        break;
      default:
        hackerView.style.display = "none";
        wikiView.style.display = "none";
        break;
    }
  });

  function createTableRow(hackerInfo, authorResp) {
    var row = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var achor = document.createElement("a");
    achor.href =
      "https://hn.algolia.com/api/v1/users/" +
      (hackerInfo.url || hackerInfo.story_title);
      achor.innerHTML = hackerInfo.title || hackerInfo.story_title;
      achor.target = '_blank';
    td1.appendChild(achor);
    var span1 = document.createElement("span");
    span1.innerHTML = hackerInfo.author;
    var span2 = document.createElement("span");
    span2.innerHTML = authorResp.submission_count;
    td2.appendChild(span1);
    td2.appendChild(span2);
    row.appendChild(td1);
    row.appendChild(td2);
    return row;
  }
  function displayWiki(info) {
    var divElm = document.createElement("div");
    divElm.className = "wikiInfo";
    var spanElm1 = document.createElement("span");
    var anchor = document.createElement("a");
    spanElm1.innerHTML = info[0];
    anchor.href = info[3][0] || "";
    anchor.innerText = info[3][0];
    divElm.appendChild(spanElm1);
    divElm.appendChild(anchor);
    return divElm;
  }
})();
