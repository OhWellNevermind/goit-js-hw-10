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
    });

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
    .then(data => {
      return data[0];
    })
    .then(cat => {
      refs.catInfoContainer.innerHTML = '';
      refs.loaderMessage.classList.remove('hidden');
      setTimeout(() => {
        const catHtml = `
      <div class="img-container">
        <img width="400px" heigth="200px" src="${cat.url}" alt="${cat.breeds[0].name}" />
      </div>
      <div class="cat-description-container">
        <h2>${cat.breeds[0].name}</h2>
        <p>${cat.breeds[0].description}</p>
        <p>Temperament: ${cat.breeds[0].temperament}</p>
      </div>`;
        refs.catInfoContainer.innerHTML = catHtml;
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
