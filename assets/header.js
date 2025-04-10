document.addEventListener("DOMContentLoaded", function() {
  if (window.innerWidth > 990) {
      document.querySelectorAll("[data-header-menu]").forEach(function(subMenu) {
          subMenu.addEventListener("mouseenter", function() {
              subMenu.setAttribute("open", "true");
              document.querySelector("html").classList.add("overlay");
          });
          subMenu.addEventListener("mouseleave", function() {
              setTimeout(function() {
                subMenu.removeAttribute("open");
                document.querySelector("html").classList.remove("overlay");
              }, 100);
          });
      });
  }
});