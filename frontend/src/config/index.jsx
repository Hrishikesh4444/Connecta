import axios from "axios"


export const base_URL="https://connecta-w20j.onrender.com"

export const clientServer=axios.create({
    baseURL: base_URL,
})