class PopupRenderer {
  constructor({
    popupId = "product-popup",
    popupImageId = "popup-image",
    popupIdTextId = "popup-id",
    closeBtnId = "popup-close",
  } = {}) {
    this.popup = document.getElementById(popupId);
    this.popupImg = document.getElementById(popupImageId);
    this.popupIdText = document.getElementById(popupIdTextId);
    this.closeBtnId = closeBtnId;
    this.handleEvent = this.handleEvent.bind(this);
    // document.addEventListener("click", this.handleEvent);
  }

  handleEvent(e) {
    const img = e.target.closest(".main__products-list-img");
    if (img) {
      const { src } = img;
      const { id } = img.dataset;
      this.popupImg.src = src;
      const number = id.toString().padStart(2, "0");
      this.popupIdText.textContent = `ID: ${number}`;
      this.popup.classList.remove("hidden");
      return;
    }
    if (
      e.target.id === this.closeBtnId ||
      e.target === this.popup ||
      e.target.classList.contains("popup")
    ) {
      this.popup.classList.add("hidden");
    }
  }
}

export default PopupRenderer;
