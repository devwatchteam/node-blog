(function() {

  let totalPosts = []

  const loadJSON = (path, cb) => {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType(`application/json`);
    xobj.open(`GET`, path, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState === 4 && xobj.status === 200) {
        cb(xobj.responseText);
      }
    };
    xobj.send(null);
  }

  loadJSON(`/static/data/post.json`, (response) => {
    const json = JSON.parse(response);
    const info = Object.values(json);
    totalPosts = info;
    console.table(info);
  });

  let postList = document.querySelector(`.post-list`);
  let pagination = document.querySelector(`.pagination`);

  const searchResults = (post) => {
    let urlBase = location.href.substring(0, location.href.lastIndexOf("/")+1);
    console.log(urlBase);
    if (!urlBase.includes(`post`)) {
      urlBase += `post/`;
    }
    if (post) {
      return `<li class="post-list-item">
        <a class="post-link" href="${urlBase}${post.name}.html">
          <date class="post-date">${post.attributes.date.replace(/\"/g, "")}</date>
          <h2 class="post-header">${post.attributes.title.replace(/\"/g, "")}</h2>
          <p class="post-description">${post.attributes.description.replace(/\"/g, "")}<span class="accent"> &hellip;Read More</span></p>
        </a>
      </li>`
    }
  };

  const searchInput = document.getElementById(`search`);
  const searchBtn = document.getElementById(`search-btn`);

  const searching = (e, term) => {
    let found = null;
    postList ? postList.innerHTML = '' : '';
    pagination ? pagination.innerHTML = '': '';
    console.log(term);
    if (!postList) {
      let wrap = document.querySelector(`.wrap-body`);
      wrap.innerHTML = "";
      postList = document.createElement('ul');
      postList.classList.add('post-list');
      wrap.insertAdjacentHTML(
        'beforeend',
        postList.outerHTML
      );
    }

    const resultsArray = [];
    totalPosts.map(post => {
      if (post.body.toLowerCase().includes(term.toLowerCase())) {
        console.log(`WHOA! ${term} has been found!`);
        if (!found) {
          found = true;
        }
        resultsArray.push(post);
      } else {
        console.log(`No results found matching ${term}`);
        if (found === null) {
          found = false;
        }
      }
    });

    if (found) {
      resultsArray.map(result => {
        document.querySelector(`.post-list`).innerHTML += searchResults(result);
      });
    } else {
      document.querySelector(`.post-list`).innerHTML = (
        `<li class="post-list-item">
          <p class="post-description">No Results found matching <span class="accent">${term}</span></p>
        </li>`
      );
    }
  }

  searchBtn.addEventListener(`click`, (e) => {
    e.preventDefault;
    if (searchInput.value.length !== 0) {
      searching(e, searchInput.value.trim());
      searchInput.value = '';
    }
  });

  searchInput.addEventListener(`keydown`, (e) => {
    e.preventDefault;
    if (e.keyCode === 13 && searchInput.value.length !== 0) {
      searching(e, searchInput.value.trim());
      searchInput.value = '';
    }
  });

})()
