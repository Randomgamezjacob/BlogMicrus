// @ts-nocheck
import { supabase, checkAuth } from './auth.js'
let email = document.getElementById("email")
let password = document.getElementById("password")
let errorText = document.getElementById("error")
let loginBtn = document.getElementById("login")
async function login(email, password) {
    const { data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    if (error) {
        errorText.textContent = "Something went wrong, pls try again !! <:3 " + error.message
    } else {
        window.location.href = "index.html"
    }
}
checkAuth().then(session => {
    if (session) {
        window.location.href = "index.html"
    }
})
loginBtn.onclick = async function() {
    const sound = new Audio("./blogmicrus jingle.mp3")
    await sound.play().catch(() => {});
    login(email.value, password.value)
}