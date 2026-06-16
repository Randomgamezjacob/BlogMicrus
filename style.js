// @ts-nocheck
let style = document.getElementById("style")
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabaseUrl = 'https://iehxuojxbzeobzbstdfv.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHh1b2p4Ynplb2J6YnN0ZGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MzMxNDYsImV4cCI6MjA5NzEwOTE0Nn0.AKoVnomeTOkoSJbCkz59KUQl2vQS6OqaywzzBTy96aE"
const supabase = createClient(supabaseUrl, supabaseKey)
async function applyCSS() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
        const user = session.user
        const siteCss = user.user_metadata?.site_css
        if (siteCss) {
            style.href = siteCss
        }
    }
}

// Apply CSS when page loads
applyCSS()