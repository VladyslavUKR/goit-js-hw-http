import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const listCountry = document.querySelector('.country-list');
const inputSearch = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');

inputSearch.addEventListener('input', debounce(onInputCountry, DEBOUNCE_DELAY));

function onInputCountry(e) {
  const inputValue = e.target.value.trim();
  if (inputValue === '') {
    clearMurkup();
    return;
  }
  fetchCountries(inputValue)
    .then(value => {
      console.log(value);
      if (value.length >= 2 && value.length <= 10) {
        clearMurkup();
        createCountryInfo(value);
        return;
      } else if (value.length === 1) {
        clearMurkup();
        createMurkup(value);
        return;
      } else {
        showErrorToMany();
      }
    })
    .catch(showError);
}

// _________  РОзмітка списку ____________

function createListItem(item) {
  return `<li class="list-item">
  <img src="${item.flags.svg}" width="150" height="100px"> 
  <h1>${item.name.common}</h1>
  <h2>Capital: ${item.capital}</h2>
  <h2>population: ${item.population}</h2>
  <h2>languages: ${Object.values(item.languages)}</h2>
  </li>`;
}

function createMurkup(array) {
  const generateContent = array.map(arr => createListItem(arr));
  listCountry.insertAdjacentHTML('afterbegin', generateContent);
}

// _________ / РОзмітка списку____________

// -_-_-_-_-_-_ Розмітка Інфо -_-_-_-_-_-_

function createCountryInfo(array) {
  const generateCountryInfo = array.map(arr => createMurkupCountryInfo(arr));
  countryInfo.insertAdjacentHTML('afterbegin', generateCountryInfo.join(' '));
}

function createMurkupCountryInfo(item) {
  return `<span class="text"><img src="${item.flags.svg}" class="flag-country" width="60px" height="40px">
    <p class="suptittle">${item.name.common}</p></span>
  `;
}
// -_-_-_-_-_-_ /  Розмітка Інфо -_-_-_-_-_-_

function showError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clearMurkup() {
  listCountry.innerHTML = '';
  countryInfo.innerHTML = '';
}

function showErrorToMany() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
