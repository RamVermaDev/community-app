import postModel from '../models/postModel.mjs'

const populatePost = (query) =>
  query.populate('userId', 'name email profilePicture occupation')

export const createPost = async (req, res) => {
  try {
    const {
      postType = 'post',
      content = '',
      visibility = 'public',
      location = '',
      jobTitle = '',
      jobCompany = '',
      jobLocation = '',
      jobEmploymentType = '',
    } = req.body

    if (postType === 'post' && !content.trim() && !req.file) {
      return res.status(400).json({ message: 'Write something or add media before posting' })
    }

    if (postType === 'job' && (!jobTitle.trim() || !jobCompany.trim())) {
      return res.status(400).json({ message: 'Job title and company are required' })
    }

    let media = ''
    let mediaType = ''

    if (req.file) {
      media = req.file.path.replace(/\\/g, '/')
      mediaType = req.file.mimetype.startsWith('image/')
        ? 'image'
        : req.file.mimetype.startsWith('video/')
          ? 'video'
          : ''
    }

    const newPost = await postModel.create({
      userId: req.user.id,
      postType,
      content,
      visibility,
      location,
      media,
      mediaType,
      ...(postType === 'job'
        ? {
            job: {
              title: jobTitle,
              company: jobCompany,
              location: jobLocation,
              employmentType: jobEmploymentType,
            },
          }
        : {}),
    })

    const post = await populatePost(postModel.findById(newPost._id))

    return res.status(201).json({
      message: 'Post created successfully',
      post,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Failed to create post',
    })
  }
}

export const getPosts = async (req, res) => {
  try {
    const posts = await populatePost(
      postModel.find({ status: 'active' }).sort({ createdAt: -1 })
    )

    return res.status(200).json({ posts })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to load posts' })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const posts = await populatePost(
      postModel
        .find({ userId: req.params.userId, status: 'active' })
        .sort({ createdAt: -1 })
    )

    return res.status(200).json({ posts })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to load posts' })
  }
}

export const toggleLike = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const likedIndex = post.likedBy.findIndex(
      (id) => id.toString() === req.user.id
    )

    if (likedIndex >= 0) {
      post.likedBy.splice(likedIndex, 1)
    } else {
      post.likedBy.push(req.user.id)
    }

    post.likes = post.likedBy.length
    await post.save()

    const updatedPost = await populatePost(postModel.findById(post._id))
    return res.status(200).json({ post: updatedPost })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Like failed' })
  }
}

export const addComment = async (req, res) => {
  try {
    const text = req.body.text?.trim()

    if (!text) {
      return res.status(400).json({ message: 'Comment cannot be empty' })
    }

    const post = await postModel.findById(req.params.postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    post.comments.push({ userId: req.user.id, text })
    post.commentsCount = post.comments.length
    await post.save()

    const updatedPost = await populatePost(postModel.findById(post._id))
    return res.status(201).json({ post: updatedPost })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Comment failed' })
  }
}
