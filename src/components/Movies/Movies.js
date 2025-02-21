import "./Movies.css";
import React from "react";
import SearchForm from "../SearchForm/SearchForm";
import Preloader from "../Preloader/Preloader";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import api from "../../utils/MoviesApi";
import * as mainApi from "../../utils/MainApi";
import SavedMovies from "../SavedMovies/SavedMovies";

function Movies({ addMovies, visibleMoviesCount }) {
  const [filteredMovies, setFilteredMovies] = React.useState([]);
  const [savedMovies, setSavedMovies] = React.useState([]);
  const [showPreloader, setShowPreloader] = React.useState(false);
  const [isShortFilm, setIsShortFilm] = React.useState(false);
  const [searchData, setSearchData] = React.useState("");

  function isShortFilmCheck() {
    const shortFilm = localStorage.getItem("shortFilm");
    if (shortFilm === null) {
      setIsShortFilm(false);
    } else {
      setIsShortFilm(true);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setShowPreloader(true);
    const films = JSON.parse(localStorage.getItem("films"));
    if (films === null) {
      api
        .getMovies()
        .then((movies) => {
          localStorage.setItem("films", JSON.stringify(movies));
          filter();
        })
        .finally(() => setShowPreloader(false))
        .catch((err) => console.log(`Ошибка загрузки данных: ${err}`));
    }
    filter();
    setShowPreloader(false);
  }

  function filter() {
    const films = JSON.parse(localStorage.getItem("films"));
    const filteredMovies = films.filter((movie) => {
      return movie.nameRU.toLowerCase().includes(searchData);
    });
    if (isShortFilm) {
      const durationCheck = filteredMovies.filter((movie) => {
        return movie.duration < 40;
      });
      localStorage.setItem("searchedFilms", JSON.stringify(durationCheck));
      localStorage.setItem("shortFilm", true);
      setFilteredMovies(durationCheck);
      // numberOfFilms(durationCheck);
      return;
    }
    localStorage.setItem("searchedFilms", JSON.stringify(filteredMovies));
    localStorage.removeItem("shortFilm");
    setFilteredMovies(filteredMovies);
    // numberOfFilms(filteredMovies);
  }

  React.useEffect(() => {
    mainApi
      .getMovies()
      .then((savedMovies) => {setSavedMovies(savedMovies)})
      .catch((err) => console.log(`Ошибка загрузки данных: ${err}`))
    console.log(savedMovies)
  }, []);

  function filter() {
    const films = JSON.parse(localStorage.getItem("films"));
    localStorage.setItem("data", searchData);
    const filteredMovies = films.filter((movie) => {
      return movie.nameRU.toLowerCase().includes(searchData);
    });
    if (isShortFilm) {
      const durationCheck = filteredMovies.filter((movie) => {
        return movie.duration < 40;
      });
      localStorage.setItem("searchedFilms", JSON.stringify(durationCheck));
      localStorage.setItem("shortFilm", true);
      setFilteredMovies(durationCheck);
      return;
    }
    localStorage.setItem("searchedFilms", JSON.stringify(filteredMovies));
    localStorage.removeItem("shortFilm");
    setFilteredMovies(filteredMovies);
  }
 
  const [length, checkLength] = React.useState(true);

  React.useEffect(() => {
    const searchedFilms = JSON.parse(localStorage.getItem("searchedFilms"));
    setFilteredMovies(searchedFilms);
    isShortFilmCheck();
  }, []);

  React.useEffect(() => {
    const searchedFilms = JSON.parse(localStorage.getItem("searchedFilms"));
    if (searchedFilms === null || searchedFilms.length === 0) {
      checkLength(true);
    } else {
      checkLength(false);
    }
  }, [filteredMovies]);

  return (
    <div className="movies">
      <SearchForm
        onSubmit={handleSubmit}
        searchData={searchData}
        isShortFilm={isShortFilm}
        setIsShortFilm={setIsShortFilm}
        setSearchData={setSearchData}
      />
      {showPreloader ? (
        <Preloader />
      ) : (
        <MoviesCardList
          numberOfMovies={filteredMovies}
          addMovies={addMovies}
          visibleMoviesCount={visibleMoviesCount}
          length={length}
        />
      )}
    </div>
  );
}

export default Movies;
