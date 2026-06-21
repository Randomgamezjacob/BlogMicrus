import { supabase } from './auth.js'
import { categories, renderCategoryOptions } from './categories.js'

const postsContainer = document.getElementById('posts')
const categoryFilter = document.getElementById('category-filter')

renderCategoryOptions(categoryFilter, true)
categoryFilter.addEventListener('change', loadPopularPosts)

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderPosts(posts) {
  if (!posts || posts.length === 0) {
    postsContainer.textContent = 'No posts found.'
    return
  }

  postsContainer.innerHTML = posts
    .map(post => {
      const title = escapeHtml(post.title ?? 'Untitled')
      const author = escapeHtml(post.author ?? 'Unknown')
      const body = escapeHtml(post.body ?? '')
      const videoUrl = escapeHtml(post['video-link'] || post.video_link || '')
      const categoryLabel = escapeHtml(
        categories.find(category => category.value === post.category)?.label || 'Other'
      )

      return `
        <article class="post-card">
          <h2>${title}</h2>
          <h4>By: ${author}</h4>
          <p><strong>Category:</strong> ${categoryLabel}</p>
          <p>${body}</p>
          ${videoUrl ? `<video width="320" height="240" controls><source src="${videoUrl}" type="video/mp4">Your browser does not support video.</video>` : ''}
          <p></p>
          <button class="like" onclick="likePost(${post.id})">Like! (${post.likes ?? 0})</button>
          <a href="indiv-post.html?id=${post.id}">View Post</a>
        </article>
      `
    })
    .join('')
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

  loadPopularPosts()
}

async function loadPopularPosts() {
  const selectedCategory = categoryFilter.value
  let query = supabase
    .from('Posts')
    .select('*')
    .order('likes', { ascending: false })
    .limit(50)

  if (selectedCategory) {
    query = query.eq('category', selectedCategory)
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase error loading newest posts:', error)
    postsContainer.textContent = 'Unable to load newest posts.'
    return
  }

  renderPosts(data)
}

window.likePost = likePost

loadPopularPosts()
