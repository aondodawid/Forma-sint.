import SidebarMenu from "./SidebarMenu.js";
import createSwiper from "./Swiper.js";
import { setMeta } from "./utilities.js";
import ProductRenderer from "./ProductRenderer.js";
import RenderPopup from "./RenderPopup.js";

const sidebarMenu = new SidebarMenu();
const productRenderer = new ProductRenderer();
const swiper = createSwiper();
const renderPopup = new RenderPopup();

swiper.initializeSwiper();

const metaData = {
  "#home": {
    title: "Forma'sint | Alpine Gear Shop",
    description:
      "Shop for alpine climbing jackets, helmets, and more. Featured and latest products for mountain adventures.",
  },
  "#featured": {
    title: "Featured Alpine Gear | Forma'sint",
    description:
      "Browse our featured alpine jackets, helmets, and gear. Top picks for mountain adventures.",
  },
  "#listing": {
    title: "Product Listing | Forma'sint",
    description:
      "Explore all alpine gear products. Find jackets, helmets, and more for your next climb.",
  },
};

function updateMetaByHash() {
  const hash = window.location.hash || "#home";
  const { title, description } = metaData[hash] || metaData["#home"];
  setMeta(title, description);
}

window.addEventListener("hashchange", updateMetaByHash);
document.addEventListener("DOMContentLoaded", updateMetaByHash);

document.addEventListener("DOMContentLoaded", () => {
  productRenderer.init();
});

document.addEventListener("click", (e) => {
  renderPopup.handleEvent(e);
  sidebarMenu.handleClick(e);
});
