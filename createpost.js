// @ts-nocheck
import { supabase, checkAuth } from './auth.js'
import { categories, renderCategoryOptions } from './categories.js'

const titleInput = document.getElementById('title')
const bodyInput = document.getElementById('body')
const videoInput = document.getElementById('video-link')
const categorySelect = document.getElementById('category')
const createBtn = document.getElementById('create')

renderCategoryOptions(categorySelect)

async function createPost() {
	createBtn.disabled = true
	const title = titleInput.value?.trim()
	const body = bodyInput.value?.trim()
	const video = videoInput.value?.trim()
	const category = categorySelect.value

	if (!title || !body) {
		alert('Please provide a title and body for the post.')
		createBtn.disabled = false
		return
	}

	const session = await checkAuth()
	const author = session?.user?.user_metadata?.display_name || session?.user?.email || null

	const post = {
		title,
		author,
		body,
		likes: 0,
		['video_link']: video || 'https://file.garden/aRKhe5yF3h5TsRHL/placeholder.mp4',
		category: category || null,
		profile_css: session?.user?.user_metadata?.profile_css || 'style.css'
	}

	try {
		const { data, error } = await supabase.from('Posts').insert([post]).select()
		if (error) {
			console.error('Insert error', error)
			alert('Failed to create post: ' + error.message)
			createBtn.disabled = false
			return
		}
		// success: redirect to home or clear form
		window.location.href = 'index.html'
	} catch (e) {
		console.error(e)
		alert('Unexpected error creating post')
		createBtn.disabled = false
	}
}

createBtn.addEventListener('click', createPost)

