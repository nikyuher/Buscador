import { reactive } from 'vue'

interface UrlState {
  baseUrl: string
}

const state: UrlState = reactive({
  baseUrl: 'http://localhost:5000'
})

export default state