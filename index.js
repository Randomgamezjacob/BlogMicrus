import { supabase, onAuthChange, checkAuth } from './auth.js'
let notLoggedIn = document.getElementById("not-session")
let loggedIn = document.getElementById("session")
let userEmail = document.getElementById("email")
let logoutBtn = document.getElementById("logout")
onAuthChange(session => {
    if (session) {
        notLoggedIn.style.display = "none"
        loggedIn.style.display = "block"
        userEmail.textContent = session.user?.user_metadata?.display_name || session.user?.email || ''
    } else {
        notLoggedIn.style.display = "block"
        loggedIn.style.display = "none"
    }
})
// Check current session on page load to update UI immediately
checkAuth().then(session => {
    if (session) {
        notLoggedIn.style.display = "none"
        loggedIn.style.display = "block"
        userEmail.textContent = session.user?.user_metadata?.display_name || session.user?.email || ''
    } else {
        notLoggedIn.style.display = "block"
        loggedIn.style.display = "none"
    }
})
logoutBtn.onclick = async () => {
    await supabase.auth.signOut()
}