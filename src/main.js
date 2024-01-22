import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import axios from 'axios';

let currentPage = 1;  
let query = "";
let perPage = 40; 
let totalResult = 0;


const searchForm = document.querySelector(".search-form");
const url = new URL("https://pixabay.com/api/")

const galleryList = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const loadMoreBtn = document.querySelector(".load-more-btn");
const loadAllText = document.querySelector(".end-text");

const lightbox = new SimpleLightbox('.gallery a', {
  nav: true,
  captionDelay: 250,
  captionsData: 'alt',
  close: true,
  enableKeyboard: true,
  docClose: true,
});


// get images from Api
async function fetchImages(query, currentPage, perPage) {
  const params = {
    key: '41612762-752dc9341b43071862b7b3b8c',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage, // Використовуємо поточну сторінку
    per_page: perPage,
  }
  url.search = new URLSearchParams(params);
  
  // console.log(url.search);
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch(error) {
    viewError();
  }
}



// rendering gallery
function renderImages(galleryList, imgs) {
  console.log(imgs);
  console.log(imgs.hits);
  console.log(imgs.total);
  
  const markup = imgs
    .hits
    .map(
      img => {
    return `<li class="img-gallery-item"><a class="gallery-link" href="${img.largeImageURL}"><img class="gallery-image" src="${img.webformatURL}" alt="${img.tags}" width="${img.webformatWidth}"></a>
        <div class="info-img">
          <p>Likes<span>${img.likes}</span></p>
          <p>Views<span>${img.views}</span></p>
          <p>Comments<span>${img.comments}</span></p>
          <p>Downloads<span>${img.downloads}</span></p>
        </div>
      </li>`;
  }).join("");
  galleryList.insertAdjacentHTML("beforeend", markup);
  lightbox.refresh();
}

// get the height of a img
function getCardHeight() {
  const card = document.querySelector('.img-gallery-item');
  const rect = card.getBoundingClientRect();
  return rect.height;
}

// smoothly scroll by a given distance
function smoothScrollBy(distance) {
  window.scrollBy({
    top: distance,
    behavior: 'smooth',
  });
}


// press button Search
searchForm.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();
    // currentPage = 1;
    query = event.currentTarget.elements.query.value.trim();
    galleryList.innerHTML = "";
    loadAllText.classList.add("is-hidden");
    loader.style.display = "block";
  
    const data = await fetchImages(query, currentPage = 1, perPage)
    
    // якщо пошук не видає результатів: видалити текст і кноаку ЛоадМоре + помилка
    if (data.totalHits === 0) {
      loadMoreBtn.classList.add("is-hidden")
      loadAllText.classList.add("is-hidden")
      throw new Error("No images found");
      //успішний пошук
    } else {
      totalResult = data.totalHits;
      renderImages(galleryList, data)
      loadMoreBtn.classList.remove("is-hidden");
      loadAllText.classList.add("is-hidden");

      //Якщо результат відразу менший за місткість сторінки 40
      if (currentPage >= Math.ceil(totalResult / perPage)) {
        loadMoreBtn.classList.add("is-hidden");
        loadAllText.classList.remove("is-hidden");
      }
    }
    } catch (error) {
    viewError();
  } finally {
  loader.style.display = "none";
  }
});

searchForm.addEventListener("mousedown", function (event) {
  if (event.target.classList.value === 'form-control' && event.target.value !== "")  {
    event.target.value=""
  }
});


loadMoreBtn.addEventListener("click", async () => {
  try {
    currentPage += 1;
    loader.style.display = "block";
    loadMoreBtn.classList.add("is-hidden");
    const data = await fetchImages(query, currentPage, perPage);

    renderImages(galleryList, data);

    const cardHeight = getCardHeight();
    smoothScrollBy(cardHeight * 2.2);

    if (currentPage >= Math.ceil(totalResult / perPage)) {
      loadAllText.classList.remove("is-hidden");
    } else loadMoreBtn.classList.remove("is-hidden");
  } catch (error) {
    viewError();
  } finally {
    loader.style.display = "none";
  }
});


function viewError() {
  return iziToast.error({
    title: 'Error',
    position: 'center',
    message: 'Sorry, there are no images matching your search query. Please try again!',
  });
}
