export default function createSwiper() {
  const swiperObj = {
    handleWishlistIcons() {
      const wishList = localStorage.getItem("wishlist")
        ? JSON.parse(localStorage.getItem("wishlist"))
        : [];
      if (wishList.length > 0) {
        document
          .querySelectorAll(".swiper-slide__img-wishlistContainer-icon")
          .forEach((icon) => {
            const isWished = wishList.includes(icon.dataset.id);
            icon.classList.toggle("swiper-slide__img--active", isWished);
          });
      }
      document.addEventListener("click", function (e) {
        const { target } = e;
        if (target.matches(".swiper-slide__img-wishlistContainer-icon")) {
          target.classList.toggle("swiper-slide__img--active");
        }
        const { id } = target.dataset;
        if (wishList.includes(id)) {
          wishList.splice(wishList.indexOf(id), 1);
        } else {
          wishList.push(id);
        }
        localStorage.setItem("wishlist", JSON.stringify(wishList));
      });
    },
    initializeSwiper() {
      const nextArrow = document.querySelector(".swiper-navigation__next-btn");
      const prevArrow = document.querySelector(".swiper-navigation__prev-btn");
      this.handleWishlistIcons();
      const swiper = new Swiper(".swiper", {
        slidesPerView: 1.2,
        slidesPerGroup: 1,
        spaceBetween: 16,
        grabCursor: true,
        loop: true,
        navigation: {
          nextEl: nextArrow,
          prevEl: prevArrow,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          type: "bullets",
          renderBullet: function (index, className) {
            return `<span class="${className} swiper-pagination-line"></span>`;
          },
        },
        breakpoints: {
          1100: {
            slidesPerView: 4,
            slidesPerGroup: 1,
            spaceBetween: 24,
          },
          867: {
            slidesPerView: 3,
            slidesPerGroup: 1,
          },
          550: {
            slidesPerView: 2,
            slidesPerGroup: 1,
          },
        },
      });

      const updateArrowVisibility = () => {
        if (swiper.isBeginning) {
          prevArrow.style.opacity = "0";
          prevArrow.style.pointerEvents = "none";
        } else {
          prevArrow.style.opacity = "1";
          prevArrow.style.pointerEvents = "auto";
        }

        if (swiper.isEnd) {
          nextArrow.style.opacity = "0";
          nextArrow.style.pointerEvents = "none";
        } else {
          nextArrow.style.opacity = "1";
          nextArrow.style.pointerEvents = "auto";
        }
      };

      swiper.on("slideChange", updateArrowVisibility);
      updateArrowVisibility();
    },
  };
  return swiperObj;
}
