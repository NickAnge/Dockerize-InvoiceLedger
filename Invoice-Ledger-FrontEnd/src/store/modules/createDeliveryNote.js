import axios from 'axios';
import BackEndApi from '../../services/api/backEnd';

const actions = {
  createDeliveryNote(context, credentials) {
    const token = localStorage.getItem('access_token')

    axios.defaults.headers.common['Authorization'] = token
    return new Promise((resolve,reject) => {
      console.log(credentials)
        BackEndApi.postCalls('/deliveryNotes/createDeliveryNote', {
            name: credentials.name,
            job: credentials.job,
            VatRegistrationNum: credentials.VatRegistrationNum,
            address: credentials.address,
            city: credentials.city,
            loadingPlace: credentials.loadingPlace,
            taxOffice: credentials.taxOffice,
            destination: credentials.destination,
            details: credentials.details
        })
        .then(response => {
            resolve(response)
            console.log(response)
        })
        .catch(error => {
            console.log(error)
            reject(response)
        })
    })
  }
};

export default  {
  actions
}
