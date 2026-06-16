// @ts-nocheck
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabaseUrl = 'https://iehxuojxbzeobzbstdfv.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHh1b2p4Ynplb2J6YnN0ZGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MzMxNDYsImV4cCI6MjA5NzEwOTE0Nn0.AKoVnomeTOkoSJbCkz59KUQl2vQS6OqaywzzBTy96aE"
const supabase = createClient(supabaseUrl, supabaseKey)
let style = document.getElementById("style")
async function changeCSSFile(theme) {
    style.href = theme
    const { data, error } = await supabase.auth.updateUser({
        data: {
            site_css: theme
        }
    })
}
async function changeBlogCSS(theme) {
    style.href = theme
    const { data, error } = await supabase.auth.updateUser({
        data: {
            profile_css: theme
        }
    })
}
document.getElementById("theme").onchange = function() {
    changeCSSFile(this.value)
}
document.getElementById("blog-theme").onchange = function() {
    changeBlogCSS(this.value)
}