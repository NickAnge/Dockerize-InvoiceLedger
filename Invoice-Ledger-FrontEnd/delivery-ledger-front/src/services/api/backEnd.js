import axios from 'axios';

export default {
    postCalls(route, data) {
      return axios.post('http://10.64.45.62:5000' + route, data)
        .then(response => {
          return response;
        })
    },
    getCalls(route) {
      return axios.get('http://10.64.45.62:5000' + route)
        .then(response => {
          return response;
        })
    },
    getSearch(route) {
      return axios.get('http://10.64.45.62:5000' + route)
        .then(response => {
          return response;
        })
    },
    deleteCalls(route) {
      return axios.delete('http://10.64.45.62:5000' + route)
        .then(response => {
          return response;
        })
    },
    putCalls(route, data) {
      return axios.put('http://10.64.45.62:5000' + route, data)
        .then(response => {
          return response;
        })
    }
  }