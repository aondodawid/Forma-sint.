/**
 * SidebarMenu class to manage sidebar interactions
 * @class SidebarMenu
 * @param {Object} options - Configuration options for the sidebar menu
 * @param {string} [options.sidebarId="menu"] - ID of the sidebar element
 * @param {string} [options.openBtnId="open-sidebar-btn"] - ID of the button to open the sidebar
 * @param {string} [options.closeBtnId="close-sidebar-btn"] - ID of the button to close the sidebar
 * @param {string} [options.overlayClass="overlay"] - Class name for the overlay
 * @param {string} [options.menuLinkClass="main-menu__link"] - Class name for the menu links
 * @param {number} [options.maxWidth=770] - Maximum width for mobile view
 * @param {string} [options.homeId="home-link"] - ID of the home link element

 */
export default class SidebarMenu {
  constructor({
    sidebarId = "menu",
    openBtnId = "open-sidebar-btn",
    closeBtnId = "close-sidebar-btn",
    overlayClass = "overlay",
    menuLinkClass = "main-menu__link",
    minWidth: maxWidth = 770,
    homeId = "home-link",
  } = {}) {
    this.sidebar = document.getElementById(sidebarId);
    this.openSidebarBtn = document.getElementById(openBtnId);
    this.homeLink = document.getElementById(homeId);
    this.closeBtnId = closeBtnId;
    this.overlayClass = overlayClass;
    this.menuLinkClass = menuLinkClass;
    this.mediaQuery = window.matchMedia(`(max-width:${maxWidth}px)`);
    this.handleClick = this.handleClick.bind(this);
    this.updateMenu = this.updateMenu.bind(this);
    this.isMobile = this.mediaQuery.matches;
    this.init();
  }

  init() {
    this.mediaQuery.addEventListener("change", this.updateMenu);
    this.updateMenu(this.mediaQuery);
    document.addEventListener("click", this.handleClick);
    this.initObservers();
  }

  initObservers() {
    const sections = document.querySelectorAll(".observe");
    const navLinks = document.querySelectorAll(".main-menu__link");
    const listing = document.getElementById("listing");
    const threshold = 0.5;
    const observe = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.removeAttribute("aria-current");
            if (link.getAttribute("href") === `#${entry.target.id}`) {
              link.setAttribute("aria-current", "page");
            }
          });
        }
      });
    };
    const listingObserver = new IntersectionObserver(observe, {
      threshold: 0,
    });
    const observer = new IntersectionObserver(observe, {
      threshold: threshold,
    });
    if (listing) listingObserver.observe(listing);
    sections.forEach((section) => observer.observe(section));
    let isRerunObservers = false;
    // Re-observe after clicking a menu link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        observer.unobserve(document.getElementById("featured"));
        observer.unobserve(document.getElementById("home"));
        listingObserver.unobserve(listing);
        isRerunObservers = true;
        if (isRerunObservers) {
          setTimeout(function () {
            sections.forEach((section) => observer.observe(section));
            if (listing) listingObserver.observe(listing);
            isRerunObservers = false;
          }, 500);
        }
      });
    });
  }

  updateMenu(e) {
    this.isMobile = e.matches;
    const { isMobile } = this;
    if (isMobile) {
      this.sidebar.setAttribute("inert", "");
    } else {
      this.sidebar.removeAttribute("inert");
    }
  }

  open() {
    this.sidebar.classList.add("active");
    if (this.openSidebarBtn) {
      this.openSidebarBtn.setAttribute("aria-expanded", "true");
    }
    this.sidebar.removeAttribute("inert");
  }

  close() {
    this.sidebar.classList.remove("active");
    if (this.openSidebarBtn) {
      this.openSidebarBtn.setAttribute("aria-expanded", "false");
    }
    this.sidebar.setAttribute("inert", "");
  }

  handleClick(e) {
    const links =
      e.target.closest(".main-menu__link") ||
      e.target.closest(".header__nav--link");
    if (links) {
      const currentLink = document.querySelector('[aria-current="page"]');
      currentLink.removeAttribute("aria-current");
      if (
        e.target.closest(".header__nav--link") ||
        e.target.closest("#nav-icon")
      ) {
        this.homeLink.setAttribute("aria-current", "page");
      } else e.target.setAttribute("aria-current", "page");
    }
    if (!this.isMobile) return;
    if (this.openSidebarBtn && e.target.closest(`#${this.openSidebarBtn.id}`)) {
      this.open();
    } else if (
      (this.closeBtnId && e.target.closest(`#${this.closeBtnId}`)) ||
      (this.overlayClass && e.target.closest(`.${this.overlayClass}`)) ||
      (this.menuLinkClass && e.target.closest(`.${this.menuLinkClass}`))
    ) {
      this.close();
    }
  }
}
