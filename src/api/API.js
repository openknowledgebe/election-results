
import { API_URL } from '../constants';

class API {
  constructor() {
    this.BASE_URL = 'https://api.elections.openknowledge.be';
    this.headers = {
      Accept: 'application/json'
    };
  }

  get fetchOptions() {
    return {
      headers: this.headers
    }
  }

  handleResponse = async (response) => {
    if (!response.ok) {
      if (!response.statusText) throw Error('unknown error');
      throw Error(response.statusText);
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) return response.json();
    return response;
  }

  getEntities = (type = 'CK', year = 2019) => {
    return fetch(`${this.BASE_URL}/format-i/entities/${year}/${type}`, this.fetchOptions).then(this.handleResponse);
  }

  getGroups = (type = 'CK', year = 2019) => {
    return fetch(`${this.BASE_URL}/format-i/groups/${year}/${type}`, this.fetchOptions).then(this.handleResponse);
  }

  getLists = (type = 'CK', year = 2019) => {
    return fetch(`${this.BASE_URL}/format-i/lists/${year}/${type}`, this.fetchOptions).then(this.handleResponse);
  }

  getCandidates = (type = 'CK', year = 2019) => {
    return fetch(`${this.BASE_URL}/format-i/candidates/${year}/${type}?test`, this.fetchOptions).then(this.handleResponse);
  }

  getResults = (type = 'CK', year = 2019) => {
    return fetch(`${this.BASE_URL}/format-r/results/${year}/${type}?test&final`, this.fetchOptions).then(this.handleResponse);
  }

  getEvolution = (type = 'CK', year = 2019) => {
    return fetch(`${this.BASE_URL}/format-r/evolution/${year}/${type}?test`, this.fetchOptions).then(this.handleResponse);
  }
}

export default API;
