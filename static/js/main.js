(function () {
  "use strict";

  // ======= Sticky Navbar
  window.onscroll = function () {
    const header = document.querySelector(".header");
    const logo = document.querySelector(".navbar-brand img");
    const backToTop = document.querySelector(".back-to-top");

    if (window.pageYOffset > header.offsetTop) {
      header.classList.add("sticky");
      logo.src = "static/images/logo/logo-2.svg";
    } else {
      header.classList.remove("sticky");
      logo.src = "static/images/logo/logo.svg";
    }

    backToTop.style.display = window.pageYOffset > 50 ? "flex" : "none";
  };

  // ===== Menu Scroll
  const pageLinks = document.querySelectorAll(".menu-scroll");
  pageLinks.forEach((elem) => {
    elem.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(elem.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
        offsetTop: 1 - 60,
      });
    });
  });

  // ===== Active menu section on scroll
  function onScroll() {
    const sections = document.querySelectorAll(".menu-scroll");
    const scrollPos = window.pageYOffset;

    sections.forEach((currLink) => {
      const refElement = document.querySelector(currLink.getAttribute("href"));
      if (
        refElement.offsetTop <= scrollPos + 73 &&
        refElement.offsetTop + refElement.offsetHeight > scrollPos + 73
      ) {
        document.querySelector(".menu-scroll.active")?.classList.remove("active");
        currLink.classList.add("active");
      } else {
        currLink.classList.remove("active");
      }
    });
  }

  window.document.addEventListener("scroll", onScroll);

  // ===== Navbar Toggle (Correction: Éviter la fermeture immédiate)
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  navbarToggler.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    navbarToggler.classList.toggle("active");
    navbarCollapse.classList.toggle("show");
  });

  navbarCollapse.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", (event) => {
    if (!navbarToggler.contains(event.target) && !navbarCollapse.contains(event.target)) {
      navbarToggler.classList.remove("active");
      navbarCollapse.classList.remove("show");
    }
  });

  // ===== Submenu Toggle
  const submenuButtons = document.querySelectorAll(".nav-item-has-children");
  submenuButtons.forEach((elem) => {
    const anchor = elem.querySelector("a");
    const submenu = elem.querySelector(".submenu");

    if (anchor && submenu) {
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        submenu.classList.toggle("show");
      });
    }
  });

  // ===== WOW.js Initialization
  new WOW().init();

  // ===== GLightbox Initialization
  const myGallery = GLightbox({
    href: "static/images/about/Moi.jpg",
    type: "image",
    source: "local",
    width: 900,
    autoplayVideos: true,
  });

  // ===== Scroll to Top
  function scrollTo(element, to = 0, duration = 500) {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
      currentTime += increment;
      const val = Math.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;

      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }

  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    return t < 1 ? (c / 2) * t * t + b : (-c / 2) * (--t * (t - 2) - 1) + b;
  };

  document.querySelector(".back-to-top").onclick = () => {
    scrollTo(document.documentElement);
  };
})();
