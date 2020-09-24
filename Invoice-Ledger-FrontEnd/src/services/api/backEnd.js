import axios from 'axios';

export default {
  postCalls(route, data) {
    return axios.post('http://localhost:5000' + route, data)
      .then(response => {
        return response;
      })
  },
  getCalls(route) {
    return axios.get('http://localhost:5000' + route)
      .then(response => {
        return response;
      })
  },
  getSearch(route) {//10.64.92.213:5000
    return axios.get('http://localhost:5000' + route)
      .then(response => {
        return response;
      })
  },
  deleteCalls(route) {//10.64.92.213:5000
    return axios.delete('http://localhost:5000' + route)
      .then(response => {
        return response;
      })
  },
  putCalls(route, data) {
    return axios.put('http://localhost:5000' + route, data)
      .then(response => {
        return response;
      })
  }
}