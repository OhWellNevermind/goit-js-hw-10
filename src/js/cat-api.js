import axios from 'axios';

function fetchBreeds() {
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => {
      return response.data;
    })
    .then(data => {
      return data.map(cat => {
        return { id: cat.id, name: cat.name };
      });
    });
}

function fetchCatByBreed(breedId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => {
      return response.data;
    })
    .then(([data]) => {
      if (data.length === 0) {
        throw new Error();
      }
      return {
        catImg: data.url,
        catName: data.breeds[0].name,
        catDescription: data.breeds[0].description,
        catTemperament: data.breeds[0].temperament,
      };
    });
}

export { fetchBreeds, fetchCatByBreed };
