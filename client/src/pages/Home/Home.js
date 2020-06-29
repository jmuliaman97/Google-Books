import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CardHeader from '@material-ui/core/CardHeader'
import axios from 'axios'

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
  },
  media: {
    height: 200,
  },
})

const Home = () => {
  const classes = useStyles()

  const [bookState, setBookState] = useState({
    search: '',
    books: []
  })

  bookState.handleInputChange = event => {
    setBookState({ ...bookState, [event.target.name]: event.target.value })
  }

  bookState.handleSearchBook = event => {
    event.preventDefault()
    axios.get(`/api/google/${bookState.search}`)
      .then(({ data }) => {
        console.log(data)
        setBookState({ ...bookState, books: data })
      })
  }

  bookState.handleSaveBook = book => {
    axios.post('/api/books', {
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      description: book.volumeInfo.description,
      image: book.volumeInfo.imageLinks.thumbnail,
      link: book.volumeInfo.infoLink,
      bookId: book.volumeInfo.id
    })
      .then(() => {
        const books = bookState.books
        const booksFiltered = books.filter(volume => volume.id !== book.id)
        setBookState({ ...bookState, books: booksFiltered })
      })
      .catch(err => console.error(err))
  }

  return (
    <>
      <form onSubmit={bookState.handleSearchBook}>
        <TextField
          label="Search Book"
          name="search"
          value={bookState.search}
          onChange={bookState.handleInputChange} />
        <Button
          variant="outlined"
          color="primary"
          onClick={bookState.handleSearchBook}>
          Search
        </Button>
      </form>
      <div>
        {
          bookState.books.map(book => (
            <Card className={classes.root}>
              <CardHeader
                title={book.volumeInfo.title}
              />
              <CardMedia
                className={classes.media}
                image= {book.volumeInfo.imageLinks.thumbnail.length ? `${book.volumeInfo.imageLinks.thumbnail}` : 'Image unavailable'}
                title={book.volumeInfo.title}
              />
              <CardContent>
                <Typography variant="subtitle2" component="h4">
                  {book.volumeInfo.authors.length ? `Written by ${book.volumeInfo.authors}` : 'Author unknown'}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {book.volumeInfo.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => bookState.handleSaveBook(book)}>
                  Save
                </Button>
                <Button 
                  size="small" 
                  color="primary" 
                  href={book.volumeInfo.infoLink}>
                  View
                </Button>
              </CardActions>
            </Card>
          ))
        }
      </div>
    </>
  )
}

export default Home