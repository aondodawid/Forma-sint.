import createDataFetcher from "./DataFetcher.js";

/**
 * ProductRenderer class to manage product rendering and interactions.
 * @class ProductRenderer
 * @property {string} selectListSelector - CSS selector for the custom select list.
 * @property {string} productListId - ID of the product list element.
 * @property {Array<string>} values - Array of values for the select options.
 * @property {number} maxMobileWidth - Maximum width for mobile view.
 * @property {number} current - Current selected value.
 * @property {number} pageNumber - Current page number for fetching products.
 * @property {boolean} bannerRendered - Flag to check if the banner has been rendered.
 * @property {boolean} isProductLoaded - Flag to check if products are currently being loaded.
 * @property {number} maxMobileWidth - Maximum width for mobile view.
 * @property {Function} createProduct - Method to create a product element.
 * @property {Function} renderProducts - Method to render products in the product list.
 * @property {Function} initializeUtilities - Method to initialize the custom select list.
 * @property {Function} initializeObservers - Method to initialize observers for product visibility and loading more products.
 * @property {Function} init - Method to initialize the product renderer.

 */

class ProductRenderer {
  constructor({
    selectListSelector = ".main__products-container-customSelect-list",
    productListId = "listing",
    values = ["14", "24", "36"],
    maxMobileWidth = 699,
  } = {}) {
    this.dataFetcher = createDataFetcher();
    this.selectList = document.querySelector(selectListSelector);
    this.productList = document.getElementById(productListId);
    this.values = values;
    [this.current] = values;
    this.pageNumber = 1;
    this.bannerRendered = false;
    this.isProductLoaded = false;
    this.maxMobileWidth = maxMobileWidth;
  }

  createProduct(product, index, fragment, bannerIndex) {
    const productElement = document.createElement("div");
    productElement.classList.add("product", "fade-in");

    const img = document.createElement("img");
    img.className = "main__products-list-img";
    img.src = product.image;
    img.alt = `product-${product.id}`;
    img.loading = "lazy";
    img.setAttribute("data-id", product.id);

    const idP = document.createElement("p");
    idP.className = "main__products-list-id";
    const number = product.id.toString().padStart(2, "0");
    idP.textContent = `ID: ${number}`;

    productElement.appendChild(img);
    productElement.appendChild(idP);
    fragment.appendChild(productElement);

    if (!this.bannerRendered && index === bannerIndex) {
      const banner = document.createElement("a");
      banner.classList.add("product", "banner", "fade-in");
      banner.href = "#home";
      fragment.appendChild(banner);
      this.bannerRendered = true;
    }
  }

  createProducts(newProducts, fragment, media) {
    const isMobile = media.matches;
    const bannerIndex = isMobile ? 3 : 4;
    newProducts.forEach((product, index) => {
      this.createProduct(product, index, fragment, bannerIndex);
    });
    this.productList.appendChild(fragment);
  }

  async renderProducts() {
    if (this.isProductLoaded) return;
    this.isProductLoaded = true;

    const { getJsonValues } = this.dataFetcher.initializeDataFetcher();
    const pageSize = parseInt(this.current, 10);
    const newProducts = await getJsonValues(pageSize, this.pageNumber);
    const fragment = document.createDocumentFragment();
    const media = window.matchMedia(`(max-width: ${this.maxMobileWidth}px)`);

    this.pageNumber += 1;

    this.createProducts(newProducts, fragment, media);

    media.addEventListener("change", () => {
      this.productList.innerText = "";
      this.bannerRendered = false;
      this.pageNumber = 1;
      this.renderProducts();
    });

    this.initializeObservers();
    this.isProductLoaded = false;
  }

  initializeUtilities() {
    const renderList = () => {
      this.selectList.innerText = "";
      const sorted = [
        this.current,
        ...this.values.filter((v) => v !== this.current),
      ];
      document.addEventListener("click", (e) => {
        if (
          this.selectList.classList.contains("open") &&
          !e.target.closest(".main__products-container-customSelect-list")
        ) {
          this.selectList.classList.remove("open");
        }
      });
      sorted.forEach((selectedValue, index) => {
        const li = document.createElement("li");
        li.textContent = selectedValue;
        li.dataset.value = selectedValue;
        if (index === 0) li.classList.add("first");
        li.addEventListener("click", async () => {
          if (index !== 0) {
            this.current = selectedValue;
            this.pageNumber = 1;
            renderList();
            this.selectList.classList.remove("open");
            this.productList.innerText = "";
            await this.renderProducts();
          } else {
            this.selectList.classList.toggle("open");
          }
        });
        this.selectList.appendChild(li);
      });
    };
    renderList();
  }

  initializeObservers() {
    const products = document.querySelectorAll(".product");
    const fadeInObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.2 },
    );
    products.forEach((product) => fadeInObserver.observe(product));
    const lastProduct = products[products.length - 1];
    if (!lastProduct) return;
    const loadMoreObserver = new IntersectionObserver(async ([entry]) => {}, {
      threshold: 1,
    });
    loadMoreObserver.observe(lastProduct);
  }

  async init() {
    await this.renderProducts();
    this.initializeObservers();
    this.initializeUtilities();
  }
}

export default ProductRenderer;
