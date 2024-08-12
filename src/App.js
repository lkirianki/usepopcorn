import { useEffect, useState } from 'react'
import StarRating from './StarRating'

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    title: "Inception",
    Year: "2010",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    title: "Back to the Future",
    Year: "1985",
    poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = 'ce5593bd'

function App() {

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState('')
  const [selectedId, setIsSelectedId] = useState(null);

  // const Tempquery = 'interstellar'

  const handleMovieSelection = (id) => {
    setIsSelectedId(selectedid => id === selectedId ? null : id);
  }

  function handleWatchedMovie(movie) {
    setWatched(watched => [...watched, movie])
  }

  const handleCloseMovie = () => {
    setIsSelectedId(null);
  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }

  useEffect(function () {

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true)
        setError('');
        const res = await (fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal }));

        if (!res.ok) throw new Error('something went wrong when fetching Movies');

        const data = await res.json();

        if (data.Response === 'False') throw new Error('Movie not found!!')
        setMovies(data.Search);
        setError('');
        // console.log(data.Search);

      }
      catch (e) {
        // 
        if (e.name !== "AbortError") {
          setError(e.message)
          console.log(e.message)
        }
      }
      finally {
        setIsLoading(false)
      }

    }
    if (query.length < 3) {
      setMovies(tempMovieData);
      setError('')
      return;
    }

    handleCloseMovie();

    fetchMovies();
    return function () {
      controller.abort();
    }

  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar >
      <Main>

        {/* <Box element={<MovieItem movies={movies} />} />
        <Box element={<>
          <Summary watched={watched} />
          <WatchedListItem watched={watched} />
        </>} /> */}

        <Box>
          {/* {isloading ? <Loader /> : <MovieItem movies={movies} />} */}
          {isloading && <Loader />}
          {!isloading && !error && <MovieItem movies={movies} onMovieSelection={handleMovieSelection} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? <MovieDetail selectedId={selectedId}
            onCloseMovie={handleCloseMovie}
            onAddwatched={handleWatchedMovie} watched={watched}
          />
            : <>
              <Summary watched={watched} />
              <WatchedListItem watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>
          }

        </Box>

      </Main>
    </>

  );
}

function Loader() {
  return <p className='loader'>Loading....</p>
}

function ErrorMessage({ message }) {
  return <p className='error'><span>⛔</span>{message}</p>
}

function MovieDetail({ selectedId, onCloseMovie, onAddwatched, watched }) {

  const [movie, setMovie] = useState({});
  const [Loading, setIsLoading] = useState(false);
  const [rating, setRating] = useState('')

  const iswatched = watched.map((movie) => movie.imdbID).includes(selectedId)
  const watchedRating = watched.find(movie => movie.imdbID === selectedId)?.rating;

  function handleaddMovieDetails() {

    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      rating

    }
    onAddwatched(newWatchedMovie)
    onCloseMovie();
  }

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre
  } = movie;


  useEffect(function () {
    const event = function (e) {
      if (e.code === 'Escape') {
        onCloseMovie();
        // console.log('closing')
      }
    }
    document.addEventListener('keydown', event)

    return function () {
      document.removeEventListener('keydown', event)
    }

  }, [onCloseMovie]);

  useEffect(function () {
    async function getMovieDetails() {
      setIsLoading(true)
      const res = await (fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`));
      const data = await res.json();
      setMovie(data);
      setIsLoading(false)
    }
    getMovieDetails();
  }, [selectedId])

  useEffect(function () {
    if (!title) return;
    document.title = `MOVIE | ${title}`
    return function () {
      document.title = "USE POPCORN"
    }
  }, [title])

  return <div className='details' >
    {Loading ? <Loader /> :
      <>
        <header>
          <button className='btn-back' onClick={onCloseMovie}>⬅</button>
          <img src={poster} alt='poster of the movie' />
          <div className='details-overview'>
            <h2>{title}</h2>
            <p>{released} &bull; {runtime}</p>
            <p>{genre}</p>
            <p><span>⭐</span>{imdbRating} IMDB Rating</p>
          </div>
        </header>
        <section>
          {!iswatched ? <div className='rating'>
            <StarRating size={24} starNum={10} onSetRating={setRating} />
            {rating > 0 && <button className='btn-add' onClick={handleaddMovieDetails}>+ add to watched List</button>}
          </div> :
            <p> you rated this movie <span>⭐</span>{watchedRating}</p>
          }

          <p><em>{plot}</em></p>
          <p>staring: {actors}</p>
          <p>Directed by:{director}</p>
        </section>
      </>
    }
  </div>
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      {children}

    </nav>
  )
}
// NAV_ BAR
function Logo() {
  return <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
}

function Search({ query, setQuery }) {

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}

function NumResults({ movies }) {
  return <p className="num-results">
    Found <strong>{movies.length}</strong> results

  </p>
}

// NAV_BAR

// MAIN

function Main({ children }) {
  return (
    <main className='main'>

      {children}

    </main>
  )
}

// movie List

function Box({ children }) {

  const [isOpen, setIsOpen] = useState(true);
  return <div className="box">
    <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)} > {isOpen ? "–" : "+"} </button>
    {isOpen && (
      children
    )}
  </div>
}

function MovieItem({ movies, onMovieSelection }) {

  return <ul className="list list-movies">
    {movies?.map((movie) => (
      <li key={movie.imdbID} onClick={() => onMovieSelection(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>

    ))
    }
  </ul>
}


// Movie List

// watched List

// function WatchedList({ children }) {

//   const [isOpen2, setIsOpen2] = useState(true);

//   return <div className="box">
//     <button className="btn-toggle" onClick={() => setIsOpen2((open) => !open)} >  {isOpen2 ? "–" : "+"}</button>
//     {isOpen2 && (
//       children
//     )}
//   </div>
// }

function Summary({ watched }) {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.rating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating.toFixed(2)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime.toFixed(2)} min</span>
      </p>
    </div>
  </div>
}

function WatchedListItem({ watched, onDeleteWatched }) {
  return <ul className="list">
    {watched.map((Wmovie) => (
      <li key={Wmovie.imdbID}>
        <img src={Wmovie.poster} alt={`${Wmovie.title} poster`} />
        <h3>{Wmovie.title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{Wmovie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{Wmovie.rating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{Wmovie.runtime} min</span>
          </p>

          <button className='btn-delete' onClick={() => onDeleteWatched(Wmovie.imdbID)}>X</button>

        </div>
      </li>
    ))}
  </ul>

}

export default App;
