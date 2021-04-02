import axios from 'axios'

export const HTTP = axios.create({
  baseURL: 'https://sleddog.party/api/sportsmen/'
})