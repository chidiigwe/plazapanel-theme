/* PlazaPanel — Navigation refinements */
(function () {
    "use strict";

    var primary = document.getElementById("main-navigation");
    var sidebar = document.getElementById("sidebar");

    if (!primary || !sidebar) return;

    var observer = null;
    var selectedModule = "";

    function activeModule() {
        return primary.querySelector("a.active");
    }

    function moduleName(link) {
        if (!link) return "";

        var title = link.querySelector(".title");

        return (title ? title.textContent : link.textContent)
            .trim();
    }

    function updateNavigation() {
        var active = activeModule();

        if (active) {
            selectedModule = moduleName(active);
        }

        primary.querySelectorAll("a").forEach(function (link) {
            if (link.classList.contains("active")) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        var drawer = document.getElementById("pp-drawer");

        if (drawer) {
            var heading = drawer.querySelector(
                ".pp-drawer-heading span"
            );

            if (heading && selectedModule) {
                heading.textContent = selectedModule + " Menu";
            }

            drawer.setAttribute(
                "aria-label",
                selectedModule
                    ? selectedModule + " navigation"
                    : "Hosting navigation"
            );
        }
    }

    primary.addEventListener("click", function (event) {
        var link = event.target.closest("a");

        if (!link || !primary.contains(link)) return;

        selectedModule = moduleName(link);

        // ISPConfig remains responsible for module switching.
        // We only update the descriptive heading.
        var drawer = document.getElementById("pp-drawer");

        if (drawer) {
            var heading = drawer.querySelector(
                ".pp-drawer-heading span"
            );

            if (heading) {
                heading.textContent = selectedModule + " Menu";
            }
        }
    });

    // ISPConfig can replace the top navigation after AJAX requests.
    var topContainer = document.getElementById("topnav-container");

    if (topContainer) {
        observer = new MutationObserver(function () {
            updateNavigation();
        });

        observer.observe(topContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class"]
        });
    }

    // Detect replacement of the contextual sidebar contents.
    var sidebarObserver = new MutationObserver(function () {
        updateNavigation();
    });

    sidebarObserver.observe(sidebar, {
        childList: true,
        subtree: true
    });

    updateNavigation();
})();
