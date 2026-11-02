import axios from "axios";

const baseUrl: string = 'http://localhost:3000'
const API = axios.create({ baseURL: baseUrl })

export const getData = async () => {
    return await API.get('/tale')
        .then(respont => { return respont.data })
        .catch(error => console.log( error ))
}
