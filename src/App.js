import { useEffect, useState, useRef } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import 'reactjs-popup/dist/index.css'
import { fetchMovies } from './data/moviesSlice'
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER, ENDPOINT, API_KEY } from './constants'
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import YouTubePlayer from './components/YoutubePlayer'
import useInfiniteScroll from './uses/useInfiniteScroll'
import Modal from './components/Modal'
import './app.scss'
import { Fragment } from 'react'

const App = () => {
  const state = useSelector((state) => state)
  const { movies } = state
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const [videoKey, setVideoKey] = useState()
  const [isOpen, setOpen] = useState(false)
  const navigate = useNavigate()
  const handleClose = () => setOpen(false)
  const closeCard = () => {}
  const loaderRef = useRef(null)
  const [page, setPage] = useState(0)
  const [haveMoreItems, setHaveMoreItems] = useState(true)

  const getSearchResults = (query) => {
    if (query !== '') {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+query))
      setSearchParams(createSearchParams({ search: query }))
    } else {
      dispatch(fetchMovies(ENDPOINT_DISCOVER))
      setSearchParams()
    }
  }

  const searchMovies = (query) => {
    navigate('/')
    getSearchResults(query)
  }

  const getMovies = () => {
    if (searchQuery) {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+searchQuery))
    } else if (page){
      const discoverParams = createSearchParams({ page, sort_by: 'vote_count.desc' });
      dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&${discoverParams.toString()}`))
    }
  }

  const viewTrailer = (movie) => {
    getMovie(movie.id)
    if (!videoKey) setOpen(true)
    setOpen(true)
  }

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`

    setVideoKey(null)
    const videoData = await fetch(URL)
      .then((response) => response.json())

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(vid => vid.type === 'Trailer')
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key)
    }
  }

  useInfiniteScroll({
    ref: loaderRef,
    haveMoreItems,
    loadMoreItems: () => setPage((prevPage) => prevPage + 1)
  })

  useEffect(() => {
    const fetchMoreItems = async () => {
      getMovies()
      const moreItems = state.movies.totalPages > page || state.movies.totalPages === null
      setHaveMoreItems(moreItems)
    }

    fetchMoreItems()
  }, [page])

  return (
    <div className="App">
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />

      <div className="container">
        <div>Showing { page } page of { state.movies.totalPages }</div>
        <Routes>
          <Route path="/" element={(
              <Fragment>
                <Movies movies={movies} viewTrailer={viewTrailer} closeCard={closeCard} />
                <div ref={loaderRef}></div>
              </Fragment>
            )}
          />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
      { isOpen && (
        <Modal handleClose={handleClose}>
          {videoKey ? (
              <YouTubePlayer
                  videoKey={videoKey}
              />
          ) : (
              <div style={{padding: "30px"}}><h6>no trailer available. Try another movie</h6></div>
          )}
        </Modal>
      )}
    </div>
  )
}

export default App
