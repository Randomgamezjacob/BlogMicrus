// @ts-nocheck
import { supabase } from './auth.js'

let email = document.getElementById("email")
let password = document.getElementById("password")
let displayNameInput = document.getElementById("name")
let errorText = document.getElementById("error")
let signupBtn = document.getElementById("signup")

async function createAccount(emailVal, passwordVal, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email: emailVal,
    password: passwordVal
  }, {
    data: {
      display_name: displayName,
      profile_css: "style.css",
      site_css: "style.css"
    }
  })
  console.log('signUp response', data, error)
  if (error) {
    errorText.textContent = "Something went wrong, pls try again !! <:3 " + error.message
  } else {
    // Try to update the user's metadata immediately in case signUp didn't persist it
    try {
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          profile_css: "style.css",
          site_css: "style.css"
        }
      })
      if (updateError) console.warn('updateUser failed', updateError.message)
      else console.log('updateUser result', updateData)
    } catch (e) {
      console.warn('updateUser exception', e)
    }

    errorText.textContent = "Almost there! :D Check for an email from Supabase Auth"
  }
}

signupBtn.onclick = function() {
    createAccount(email.value, password.value, displayNameInput.value)
}