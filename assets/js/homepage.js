var userFormEl = document.querySelector("#user-form");
var userInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

function formSubmitHandler(event) {
  event.preventDefault();
  var userName = userInputEl.value.trim();

  if (userName) {
    getUserRepos(userName);
    userInputEl.value = "";
  } else alert("Please enter a valid Github usename");
}

userFormEl.addEventListener("submit", formSubmitHandler);

function getUserRepos(user) {
  //format the github url to be dynamic
  var apiUrl = `https://api.github.com/users/${user}/repos`;

  //make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      //if the response.ok is true else alert an error
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, user);
        });
      } else {
        alert("Error: GitHub User Not Found");
      }
    })
    .catch(function (error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("Unable to connect to GitHub");
    });
}

function displayRepos(repos, searchTerm) {
  //check for empty array of repositorys
  if (repos.length === 0) {
    repoContainerEl.textContent = "NO repositorys found.";
    return;
  }
  // clear old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;
  console.log(repos)

  //loop over repos
  for (var i = 0; i < repos.length; i++) {
    //format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;
    //create a container for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?q=" + repoName);
    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }
}
