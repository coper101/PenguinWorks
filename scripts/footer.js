document.addEventListener("DOMContentLoaded", function () {
    fetch("footer.html") // Load footer dynamically
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;

            const currentPage = window.location.pathname.split("/").pop(); // Get current page filename

            function replaceWithIcon(selector, iconHTML) {
                const linkElement = document.querySelector(selector);
                if (linkElement) {
                    linkElement.parentElement.innerHTML = iconHTML; // Replace <li> with new content
                }
            }
            const appIconPath = "assets/data-pill-icon.png"

            if (currentPage === "support.html") {
                replaceWithIcon(
                    'a[href="support.html"]',
                    `<li>
                        <a href="index.html">
                            <img src="${appIconPath}" alt="App Icon"">
                        </a>
                    </li>`
                );
            }

            if (currentPage === "help.html") {
                replaceWithIcon(
                    'a[href="help.html"]',
                    `<li>
                        <a href="index.html">
                            <img src="${appIconPath}" alt="App Icon"">
                        </a>
                    </li>`
                );
            }

            if (currentPage === "whats-new.html") {
                replaceWithIcon(
                    'a[href="whats-new.html"]',
                    `<li>
                        <a href="index.html">
                            <img src="${appIconPath}" alt="App Icon"">
                        </a>
                    </li>`
                );
            }
        })
        .catch(error => console.error("Error loading footer:", error));
});
