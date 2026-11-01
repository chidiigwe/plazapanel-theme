(function () {
    "use strict";

    function init() {
        const toggle = document.getElementById("pp-mobile-toggle");
        const overlay = document.getElementById("pp-mobile-overlay");
        const primary = document.getElementById("topnav-container");
        const secondary = document.getElementById("sidebar");

        if (!toggle || !overlay || !primary || !secondary) return;

        const mq = window.matchMedia("(max-width: 991px)");

        const drawer = document.createElement("aside");
        drawer.id = "pp-drawer";
        drawer.setAttribute("aria-label", "Hosting navigation");
        drawer.setAttribute("aria-hidden", "true");

        const heading = document.createElement("div");
        heading.className = "pp-drawer-heading";

        const title = document.createElement("span");
        title.textContent = "Navigation";

        const close = document.createElement("button");
        close.type = "button";
        close.className = "pp-drawer-close";
        close.textContent = "\u00d7";
        close.setAttribute("aria-label", "Close navigation");

        heading.append(title, close);
        drawer.appendChild(heading);
        document.body.appendChild(drawer);

        // Mark the original locations for desktop restoration.
        const primaryAnchor = document.createComment("pp-primary");
        const secondaryAnchor = document.createComment("pp-secondary");
        primary.parentNode.insertBefore(primaryAnchor, primary);
        secondary.parentNode.insertBefore(secondaryAnchor, secondary);

        function setOpen(open) {
            const value = Boolean(open && mq.matches);
            document.body.classList.toggle("pp-menu-open", value);
            toggle.setAttribute("aria-expanded", String(value));
            toggle.setAttribute(
                "aria-label",
                value ? "Close navigation" : "Open navigation"
            );
            drawer.setAttribute("aria-hidden", String(!value));
            if ("inert" in drawer) drawer.inert = !value;
        }

        function arrange() {
            setOpen(false);

            if (mq.matches) {
                drawer.append(secondary);
            } else {
                primaryAnchor.parentNode.insertBefore(
                    primary, primaryAnchor.nextSibling
                );
                secondaryAnchor.parentNode.insertBefore(
                    secondary, secondaryAnchor.nextSibling
                );
            }
        }

        toggle.addEventListener("click", function () {
            setOpen(!document.body.classList.contains("pp-menu-open"));
            if (document.body.classList.contains("pp-menu-open")) {
                close.focus();
            }
        });

        primary.addEventListener("click", function (event) {
            const link = event.target.closest("a");

            if (!link || !primary.contains(link) || !mq.matches) {
                return;
            }

            const label = link.querySelector(".title");
            const moduleName = label
                ? label.textContent.trim()
                : link.textContent.trim();

            title.textContent = moduleName
                ? moduleName + " Menu"
                : "Module Menu";

            // Retain the existing ISPConfig module click handler.
            // Display the contextual sidebar immediately; ISPConfig
            // updates its contents when module navigation completes.
            setOpen(true);

            drawer.setAttribute(
                "aria-label",
                moduleName
                    ? moduleName + " navigation"
                    : "Module navigation"
            );

            close.focus();
        });

        close.addEventListener("click", function () {
            setOpen(false);
            toggle.focus();
        });

        overlay.addEventListener("click", function () {
            setOpen(false);
            toggle.focus();
        });

        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                document.body.classList.contains("pp-menu-open")
            ) {
                setOpen(false);
                toggle.focus();
            }
        });

        drawer.addEventListener("click", function (event) {
            const link = event.target.closest("a");
            if (link && (
                link.hasAttribute("data-capp") ||
                link.hasAttribute("data-load-content") ||
                link.getAttribute("href") !== "#"
            )) {
                setOpen(false);
            }
        });

        if (mq.addEventListener) {
            mq.addEventListener("change", arrange);
        } else {
            mq.addListener(arrange);
        }

        arrange();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
