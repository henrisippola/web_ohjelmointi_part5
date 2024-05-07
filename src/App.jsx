import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [type, setType] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // tehtävä 5.2
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  // tehtävä 5.3
  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })
      // 5.4
      setType('alert')
      setMessage(`blog ${blogObject.title} by ${blogObject.author} created`)
      setTimeout(() => {
        setMessage(null)
        setType('')
      }, 5000)
    
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      // 5.2
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      // 5.4
      setType('alert')
      setMessage('logged in succesfully')
      setTimeout(() => {
        setMessage(null)
        setType('')
      }, 5000)
    } catch (exception) {
      setType('error')
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
        setType('')
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h1>Log in</h1>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  // 5.3
  const blogForm = () => (
    <form onSubmit={addBlog}> Title:
      <input
        value={newTitle}
        onChange={handleTitleChange}
      /> <br/> Author:
      <input
        value={newAuthor}
        onChange={handleAuthorChange}
      /> <br/> Url:
      <input
        value={newUrl}
        onChange={handleUrlChange}
      /> <br/>
      <button type="submit">create</button>
    </form>  
  )

  // 5.2
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }

  const Blogs = () => {
    return (
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged in
          <button onClick={() => handleLogout()}>logout</button>
        </p>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  return (
    <div>
      <Notification message={message} type={type} />
      {!user && loginForm()}
      {user && <div>
          <Blogs />
          {blogForm()}
        </div>
      }
    </div>
  )
}

export default App