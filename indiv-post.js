import { supabase } from './auth.js'
import { categories } from './categories.js'

const postContainer = document.getElementById('post-container')

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('id')
}

function renderPost(post) {
  if (!post) {
    postContainer.textContent = 'Post not found.'
    return
  }

  const title = escapeHtml(post.title ?? 'Untitled')
  const author = escapeHtml(post.author ?? 'Unknown')
  const body = escapeHtml(post.body ?? '')
  const videoUrl = escapeHtml(post['video-link'] || post.video_link || '')
  const categoryLabel = escapeHtml(
    categories.find(category => category.value === post.category)?.label || 'Other'
  )

  postContainer.innerHTML = `
    <article class="post-card">
      <h1>${title}</h1>
      <h4>By: ${author}</h4>
      <p><strong>Category:</strong> ${categoryLabel}</p>
      <p>${body}</p>
      ${videoUrl ? `<video width="320" height="240" controls><source src="${videoUrl}" type="video/mp4">Your browser does not support video.</video>` : ''}
      <p></p>
      <button class="like" onclick="likePost(${post.id})">Like! (${post.likes ?? 0})</button>
    </article>
  `
}

async function likePost(postId) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    alert('Please log in to like posts')
    return
  }

  const userId = session.user.id

  // Check if user already liked this post
  const { data: existingLike, error: checkError } = await supabase
    .from('PostLikes')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single()

  if (existingLike) {
    alert('You already liked this post')
    return
  }

  // Add like record
  const { error: insertError } = await supabase
    .from('PostLikes')
    .insert({ user_id: userId, post_id: postId })

  if (insertError) {
    console.error('Error adding like:', insertError)
    alert('Error liking post')
    return
  }

  // Increment like count
  const { data: post, error: fetchError } = await supabase
    .from('Posts')
    .select('likes')
    .eq('id', postId)
    .single()

  if (fetchError) {
    console.error('Error fetching post:', fetchError)
    return
  }

  const newLikes = (post.likes ?? 0) + 1

  const { error: updateError } = await supabase
    .from('Posts')
    .update({ likes: newLikes })
    .eq('id', postId)

  if (updateError) {
    console.error('Error updating likes:', updateError)
    return
  }

  loadPost()
}

async function loadPost() {
  const postId = getPostIdFromUrl()

  if (!postId) {
    postContainer.textContent = 'No post ID provided.'
    return
  }

  const { data, error } = await supabase
    .from('Posts')
    .select('*')
    .eq('id', postId)
    .single()

  if (error) {
    console.error('Supabase error loading post:', error)
    postContainer.textContent = 'Unable to load post.'
    return
  }

  renderPost(data)
}

window.likePost = likePost

loadPost()
