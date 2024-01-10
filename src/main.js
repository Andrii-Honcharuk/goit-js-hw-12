import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector(".search-form");
const url = new URL("https://pixabay.com/api/")


const galleryContainer = document.querySelector(".gallery");

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
};

url.search = new URLSearchParams(params);
  
  galleryContainer.innerHTML = ''; // очищення при кожному натисканні

  loader.style.display = "block";

    fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json()
    })
    .then(imgs => {
      if (imgs.hits.length === 0) {
        iziToast.error({
          title: 'Error',
          position: 'center',
          message: 'Sorry, there are no images matching your search query. Please try again!',
        });
      } else {
        galleryContainer.innerHTML = renderImagesHtmlReduce(imgs.hits)
  
    lightbox.refresh(); 
  }
    })
      .catch(error => {
      iziToast.error({
        title: 'Error',
        position: 'center',
        message: 'Sorry, there are no images matching your search query. Please try again later!',
      });
    })

      .finally(() => {
      loader.style.display = "none";
    });

});

function renderImagesHtmlReduce(galleryContainer) {
  return galleryContainer.reduce(
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
}