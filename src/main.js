import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import axios from 'axios';

let currentPage = 1; // Додали змінну для відстеження поточної сторінки
let query = "";
let perPage = 40;
let totalResult = 0;

// const api = axios.create({
//   baseURL: "https://pixabay.com/api/",
//   params: {
//     key: '41612762-752dc9341b43071862b7b3b8c',
//     q: query,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     page: currentPage, // Використовуємо поточну сторінку
//     per_page: perPage,
//   }
// }) 

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
async function fetchImages() {
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
  try {
    const response = await axios.get(url);
    return response.data;
  } catch(error) {
    viewError();
  }
}

// const createGetImagesRequest = (q) => {
//   let page = 1;
//   const per_page = 5;

//   return async () =>  {
//     const {imgs, totalHits} = await fetchImages({ page, per_page, q });
//     page += 1;

//     return imgs;
//   }
// }

// const showImgs = createGetImagesRequest("123");

// showImgs()
//   .then((imgs) => {console.log(imgs);
// })

// rendering gallery
function renderImages(galleryList, imgs) {
  const markup = imgs.hits.map((img) => {
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


// fetchImages().then(data => renderImages(galleryList, data));



function getCardHeight() {
  const card = document.querySelector('.img-gallery-item');
  const rect = card.getBoundingClientRect();
  return rect.height;
}

// Helper function to smoothly scroll the page by a given distance
function smoothScrollBy(distance) {
  window.scrollBy({
    top: distance,
    behavior: 'smooth',
  });
}





// press button Search
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  currentPage = 1;
  query = event.currentTarget.elements.query.value.trim();
  galleryList.innerHTML = "";
  loader.style.display = "block";
  fetchImages()
  .then(data => {
    // якщо пошук не видає результатів: видалити текст і кноаку ЛоадМоре + помилка
    if (data.totalHits === 0) {
      // console.log(data.totalHits)
      // console.log(totalResult)
      loadMoreBtn.classList.add("is-hidden")
      loadAllText.classList.add("is-hidden")
      throw new Error("No images found");
      //успішний пошук
    } else {
      totalResult = data.totalHits;
      renderImages(galleryList, data)
      console.log("TR - " + totalResult);
      console.log("PP - " + perPage);
      console.log("CP - " + currentPage);
      console.log("IF - " + currentPage >= Math.ceil(totalResult / perPage));
      // console.log(totalResult);
      // console.log(data.totalHits)
      loadMoreBtn.classList.remove("is-hidden");
      loadAllText.classList.add("is-hidden");

      // let elem = document.querySelector(".img-gallery-item");
      // let rect = elem.getBoundingClientRect();
      // for (const key in rect) {
      //   if (typeof rect[key] !== "function") {
      //     let para = document.createElement("p");
      //     para.textContent = `${key} : ${rect[key]}`;
      //     document.body.appendChild(para);
      //    }
      // }

      //Якщо результат відразу менший за місткість сторінки 40
      if (currentPage >= Math.ceil(totalResult / perPage)) {
        loadMoreBtn.classList.add("is-hidden");
        loadAllText.classList.remove("is-hidden");
      }
      }
  })
  .catch((error) => viewError())
  .finally(() => {loader.style.display = "none";
  console.log("All: " + totalResult);
  });
});


loadMoreBtn.addEventListener("click", async () => {
  try {
    console.log("TR - " + totalResult);
    console.log("PP - " + perPage);
    currentPage += 1;
    console.log("CP - " + currentPage);
    console.log("IF - " + currentPage >= Math.ceil(totalResult / perPage));
    loader.style.display = "block";
    fetchImages()
    .then(data => {
      renderImages(galleryList, data)
      
      const cardHeight = getCardHeight();
      smoothScrollBy(cardHeight * 2.2);
    }

    )
    .finally(() => {loader.style.display = "none";
  console.log("All: " + totalResult);
  });
    if (currentPage >= Math.ceil(totalResult / perPage)) {
      loadMoreBtn.classList.add("is-hidden");
      loadAllText.classList.remove("is-hidden");
    }
  } catch (error) {
    viewError();
  }
})


function viewError() {
  return iziToast.error({
    title: 'Error',
    position: 'center',
    message: 'Sorry, there are no images matching your search query. Please try again!',
  });
}














































/* import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';

const searchForm = document.querySelector(".search-form");
const url = new URL("https://pixabay.com/api/")

const galleryList = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const loadMoreBtn = document.querySelector(".load-more-btn");

const lightbox = new SimpleLightbox('.gallery a', {
  nav: true,
  captionDelay: 250,
  captionsData: 'alt',
  close: true,
  enableKeyboard: true,
  docClose: true,
});

let currentPage = 1; // Додали змінну для відстеження поточної сторінки
let query = "";

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  query = event.currentTarget.elements.query.value.trim();

  const perPage = 12; // Задали кількість зображень на сторінці
  
  const params = {
    key: '41612762-752dc9341b43071862b7b3b8c',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage, // Використовуємо поточну сторінку
    per_page: perPage,
  };

  url.search = new URLSearchParams(params);

  galleryList.innerHTML = '';
  loader.style.display = "block";

  try {
    const response = await axios.get(url.toString()); // Використовуємо Axios для HTTP-запиту
    const imgs = response.data;

    if (imgs.hits.length === 0) {
      viewError();
    } else {
      renderImages(galleryList, imgs);
      lightbox.refresh();

      loadMoreBtn.style.display = "block";
    }
  } catch (error) {
    viewError();

  } finally {
    loader.style.display = "none";
    currentPage++; // Збільшуємо значення сторінки для наступного запиту
  }
});

loadMoreBtn.addEventListener("click", async () => {
  loader.style.display = "block";

  try {
    const response = await axios.get(url.toString());
    const imgs = response.data;

    if (imgs.hits.length > 0) {
      renderImages(galleryList, imgs);
      lightbox.refresh();
    } else {
      console.log("Всі зображення");// Відобразіть повідомлення, що більше зображень немає
    }
  } catch (error) {
    viewError();
  } finally {
    loader.style.display = "none";
    currentPage++;
  }
});


function renderImages(galleryList, imgs) {
  const markup = imgs.hits.map((img) => {
    return `<li class="img-gallery-item"><a class="gallery-link" href="${img.largeImageURL}"><img class="gallery-image" src="${img.webformatURL}" alt="${img.tags}" width="${img.webformatWidth}"></a>
        <div class="info-img">
          <p>Likes<span>${img.likes}</span></p>
          <p>Views<span>${img.views}</span></p>
          <p>Comments<span>${img.comments}</span></p>
          <p>Downloads<span>${img.downloads}</span></p>
        </div>
      </li>`;
  }).join("");
  galleryList.innerHTML = markup;
}

function viewError() {
  return iziToast.error({
    title: 'Error',
    position: 'center',
    message: 'Sorry, there are no images matching your search query. Please try again!',
  });
}





























/* 
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import axios from 'axios';
// console.log(axios.isCancel('something'));


const searchForm = document.querySelector(".search-form");
const url = new URL("https://pixabay.com/api/")

// const containerEl = document.querySelector(".container")
// const countPicturesEl = document.querySelector('.countpictures')
const galleryList = document.querySelector(".gallery");
const loader = document.querySelector(".loader");


const lightbox = new SimpleLightbox('.gallery a', {
  nav: true,
  captionDelay: 250,
  captionsData: 'alt',
  close: true,
  enableKeyboard: true,
  docClose: true,
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = event.currentTarget.elements.query.value.trim()
  
  const params = {
    key: '41612762-752dc9341b43071862b7b3b8c',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 10,
};

url.search = new URLSearchParams(params);
  
  galleryList.innerHTML = '';

  // containerEl.removeChild

  loader.style.display = "block";

  fetchImages()
      .then(imgs => {
        // const totalImages = imgs.total; // Отримання загальної кількості картинок
        // console.log(`Загальна кількість зображень: ${totalImages}`);

        // containerEl.insertAdjacentHTML("beforebegin", ` <p class = "countpictures"><span>Знайдено ${totalImages} зображень</span></p> `);


      if (imgs.hits.length === 0) {
        viewError();
      } else {
        renderImages(galleryList, imgs);
        lightbox.refresh(); 
        }
    })
      .catch(error => {
        viewError();
    })
      .finally(() => {
      loader.style.display = "none";
    });

});

function fetchImages() {
     return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json()
    })
}

function renderImages(galleryList, imgs) {
  const markup = imgs
    .hits
    .map((img) => {
      return `<li class="img-gallery-item"><a class="gallery-link" href="${img.largeImageURL}"><img class="gallery-image" src="${img.webformatURL}" alt="${img.tags}" width="${img.webformatWidth}"></a>
        <div class="info-img">
          <p>Likes<span>${img.likes}</span></p>
          <p>Views<span>${img.views}</span></p>
          <p>Comments<span>${img.comments}</span></p>
          <p>Downloads<span>${img.downloads}</span></p>
        </div>
      </li>`;
    })
    .join("");
  galleryList.innerHTML = markup;
}

function viewError() {
  return iziToast.error({
    title: 'Error',
    position: 'center',
    message: 'Sorry, there are no images matching your search query. Please try again!',
  })
}
*/












/*function renderImages(galleryList) {
  return galleryList.reduce(
    (acc, img) =>
      acc +
      `<li class="img-gallery-item"><a class="gallery-link" href="${img.largeImageURL}"><img class="gallery-image" src="${img.webformatURL}" alt="${img.tags}" width="${img.webformatWidth}"></a>
        <div class="info-img">
          <p>Likes<span>${img.likes}</span></p>
          <p>Views<span>${img.views}</span></p>
          <p>Comments<span>${img.comments}</span></p>
          <p>Downloads<span>${img.downloads}</span></p>
        </div>
      </li>`,
    ''
  );
}*/