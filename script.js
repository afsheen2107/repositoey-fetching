const baseURL = "https://api.github.com/users/";

function fetchUserData() {
    const username = $("#username").val();
    const perPage = $("#perPage").val();
    const userDataContainer = $("#userData");
    const loader = $("#loader");

    // Show loader
    loader.show();

    // Clear previous data
    userDataContainer.empty();
    $("#repositories").empty();
    $("#pagination").empty();

    // Fetch user data from GitHub API
    $.ajax({
        url: `${baseURL}${username}`,
        method: "GET",
        dataType: "json",
        success: function (userData) {
            // Hide loader
            loader.hide();

            // Display user data
            if (userData) {
                const userDataDiv = $("<div>");

                // User Profile Picture
                userDataDiv.append(`<img src="${userData.avatar_url}" alt="Profile Picture" class="mb-3" style="width: 100px; height: 100px; border-radius: 50%;">`);

                // User Name
                userDataDiv.append(`<h2>${userData.name || username}</h2>`);

                // Links in Bio
                if (userData.bio) {
                    const bioLinks = userData.bio.match(/\bhttps?:\/\/\S+/gi);
                    if (bioLinks && bioLinks.length > 0) {
                        const linksDiv = $("<div>").addClass("mb-3");
                        linksDiv.append("<strong>Links in Bio:</strong>");
                        bioLinks.forEach(link => {
                            linksDiv.append(`<a href="${link}" target="_blank">${link}</a><br>`);
                        });
                        userDataDiv.append(linksDiv);
                    }
                }

                userDataContainer.append(userDataDiv);
                fetchRepositories(username, perPage);
            } else {
                userDataContainer.html("<p>User not found.</p>");
            }
        },
        error: function (xhr, status, error) {
            // Hide loader
            loader.hide();

            // Display error message
            userDataContainer.html(`<p>Error: ${status} - ${error}</p>`);
        }
    });
}

function fetchRepositories(username, perPage) {
    const repositoriesContainer = $("#repositories");
    const loader = $("#loader");

    // Show loader
    loader.show();

    // Fetch repositories from GitHub API
     $.ajax({
        url: `${baseURL}${username}/repos?per_page=${perPage}`,
        method: "GET",
        dataType: "json",
        success: function (data) {
            // Hide loader
            loader.hide();

            // Display repositories
            if (data && Array.isArray(data)) {
                if (data.length === 0) {
                    repositoriesContainer.html("<p>No repositories found.</p>");
                } else {
                    data.forEach(repository => {
                        const repositoryDiv = $("<div class='repository-box'>");
                        repositoryDiv.append(`<h4>${repository.name}</h4>`);

                        // Description
                        if (repository.description) {
                            repositoryDiv.append(`<p>${repository.description}</p>`);
                        }

                        // Skills (Topics)
                        if (repository.topics && repository.topics.length > 0) {
                            const topicsDiv = $("<div>").addClass("mb-2");
                            topicsDiv.append("<strong>Skills:</strong>");
                            repository.topics.forEach(topic => {
                                topicsDiv.append(`<span class="badge badge-secondary">${topic}</span>`);
                            });
                            repositoryDiv.append(topicsDiv);
                        } else {
                            repositoryDiv.append("<p>No skills specified.</p>");
                        }

                        repositoriesContainer.append(repositoryDiv);
                    });
                }
            } else {
                repositoriesContainer.html("<p>Error fetching repositories.</p>");
            }
        },
        error: function (xhr, status, error) {
            // Hide loader
            loader.hide();

            // Display error message
            repositoriesContainer.html(`<p>Error: ${status} - ${error}</p>`);
        }
    });
}