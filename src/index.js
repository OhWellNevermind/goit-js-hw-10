import axios from 'axios';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
import 'slim-select/dist/slimselect.css';
import { fetchBreeds, fetchCatByBreed } from './js/cat-api';
//API_KEY = live_fRb2UnFurHFjZZvAhm0glThakcosmr8ZbJeT7DjVqEW8GvK8eGGi4PnJq4zRTrze
const API_KEY =
  'live_fRb2UnFurHFjZZvAhm0glThakcosmr8ZbJeT7DjVqEW8GvK8eGGi4PnJq4zRTrze';

const refs = {
  breed_select: document.querySelector('.breed-select'),
  loaderMessage: document.querySelector('.loader'),
  catInfoContainer: document.querySelector('.cat-info'),
};
axios.defaults.headers.common['x-api-key'] = API_KEY;
refs.breed_select.classList.add('hidden');

fetchBreeds()
  .then(breeds_name => {
    const optionsHtml = breeds_name.reduce((acc, { id, name }) => {
      return acc + `<option value="${id}">${name}</option>`;
    }, '');

    refs.breed_select.insertAdjacentHTML('beforeend', optionsHtml);
    new SlimSelect({
      select: '.breed-select',
    });
    refs.breed_select.classList.remove('hidden');
    refs.loaderMessage.classList.add('hidden');
  })
  .catch(error => {
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  });

refs.breed_select.addEventListener('change', event => {
  fetchCatByBreed(refs.breed_select.value)
    .then(({ catImg, catName, catDescription, catTemperament }) => {
      refs.catInfoContainer.innerHTML = '';
      refs.loaderMessage.classList.remove('hidden');
      setTimeout(() => {
        refs.catInfoContainer.innerHTML = createCat(
          catImg,
          catName,
          catDescription,
          catTemperament
        );
        refs.loaderMessage.classList.add('hidden');
      }, 1000);
    })
    .catch(error => {
      refs.catInfoContainer.innerHTML = '';
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Perhaps there is no information about that cat!'
      );
    });
});

function createCat(imgUrl, catName, catDescription, catTemperament) {
  return `
      <div class="img-container">
        <img width="600px" heigth="400px" src="${imgUrl}" alt="${catName}" />
      </div>
      <div class="cat-description-container">
        <div class="about-cat">
            <h2>${catName}</h2>
            <p>${catDescription}</p>
            <p>Temperament: ${catTemperament}</p>
        </div>
      </div>`;
}
