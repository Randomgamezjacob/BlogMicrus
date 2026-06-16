import { supabase } from './auth.js'

const displayNameInput = document.getElementById('display-name')
const blogInitiateBtn = document.getElementById('blog-initiate')
const blogResults = document.getElementById('blog-results')
const styleLink = document.getElementById('style')

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function likePost(postId) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    alert('Please log in to like posts')
    return
  }

  const userId = session.user.id

  const { data: existingLike, error: checkError } = await supabase
    .from('PostLikes')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single()

  if (checkError) {
    console.error('Error checking likes:', checkError)
    return
  }

  if (existingLike) {
    alert('You already liked this post')
    return
  }

  const { error: insertError } = await supabase
    .from('PostLikes')
    .insert({ user_id: userId, post_id: postId })

  if (insertError) {
    console.error('Error adding like:', insertError)
    alert('Error liking post')
    return
  }

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

  loadUserBlog()
}

window.likePost = likePost

function renderPosts(displayName, posts) {
  if (!posts || posts.length === 0) {
    blogResults.innerHTML = `
      <h2>Blog for ${escapeHtml(displayName)}</h2>
      <p>No posts found for this user.</p>
    `
    return
  }

  const postsHtml = posts
    .map(post => {
      const title = escapeHtml(post.title ?? 'Untitled')
      const author = escapeHtml(post.author ?? 'Unknown')
      const body = escapeHtml(post.body ?? '')
      const videoUrl = escapeHtml(post['video-link'] || post.video_link || '')

      return `
        <article class="post-card">
          <h2>${title}</h2>
          <h4>By: ${author}</h4>
          <p>${body}</p>
          ${videoUrl ? `<video width="320" height="240" controls><source src="${videoUrl}" type="video/mp4">Your browser does not support video.</video>` : ''}
          <p></p>
          <button class="like" onclick="likePost(${post.id})">Like! (${post.likes ?? 0})</button>
        </article>
      `
    })
    .join('')

  blogResults.innerHTML = `
    <h2>Blog for ${escapeHtml(displayName)}</h2>
    <div id="posts">${postsHtml}</div>
  `
}

async function loadUserBlog() {
  const displayName = displayNameInput.value?.trim()

  if (!displayName) {
    blogResults.innerHTML = '<p>Please enter a display name.</p>'
    return
  }

  blogResults.innerHTML = '<p>Loading blog...</p>'

  const { data: posts, error } = await supabase
    .from('Posts')
    .select('*')
    .eq('author', displayName)
    .order('id', { ascending: false })

  if (error) {
    console.error('Error loading user blog:', error)
    blogResults.innerHTML = '<p>Unable to load the requested blog.</p>'
    return
  }

  renderPosts(displayName, posts)

  const blogCss = posts?.[0]?.profile_css || posts?.[0]?.site_css
  if (blogCss) {
    styleLink.href = blogCss
  }
}

blogInitiateBtn.addEventListener('click', loadUserBlog)
