(function () {
    "use strict";

    function init() {
        const toggle = document.getElementById("pp-mobile-toggle");
        const overlay = document.getElementById("pp-mobile-overlay");

        if (!toggle || !overlay) return;

        const mobile = window.matchMedia("(max-width: 991px)");

        function closeMenu() {
            document.body.classList.remove("pp-menu-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open navigation");
        }

        function openMenu() {
            if (!mobile.matches) return;

            document.body.classList.add("pp-menu-open");
            toggle.setAttribute("aria-expanded", "true");
            toggle.setAttribute("aria-label", "Close navigation");
        }

        toggle.addEventListener("click", function () {
            if (document.body.classList.contains("pp-menu-open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        overlay.addEventListener("click", closeMenu);

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
                toggle.focus();
            }
        });

        document.addEventListener("click", function (event) {
            if (
                event.target.closest(
                    "#main-navigation a[data-capp], " +
                    "#sidebar a[data-load-content]"
                )
            ) {
                closeMenu();
            }
        });

        window.addEventListener("resize", function () {
            if (!mobile.matches) closeMenu();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
