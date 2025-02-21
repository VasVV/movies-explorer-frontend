import "./SearchForm.css";
import React from "react";

function SearchForm({
  onSubmit,
  searchData,
  isShortFilm,
  setIsShortFilm,
  setSearchData,
  savedMoviesCardList
}) {

  const onChangeSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchData(value);
  };

  const onChangeShortFilms = (e) => {
    setIsShortFilm(!isShortFilm);
  };

  const checkIsShort = (isShortFilm) => {
    const input = document.getElementById('short-films');
    if (isShortFilm === null) {
      input.checked = false;
    } else {
      input.checked = true;
    }
  };

  React.useEffect(() => {
    const input = document.getElementById('search');
    if (savedMoviesCardList) {
      const isShortFilm = localStorage.getItem("shortSaveFilm")
      checkIsShort(isShortFilm)
      const searchDataFilms = localStorage.getItem("save-data")
      if (searchDataFilms == null) {
        return;
      }
      setSearchData(searchDataFilms)
      input.value = searchDataFilms;
    } else {
      const isShortFilm = localStorage.getItem("shortFilm")
      checkIsShort(isShortFilm)
      const searchDataFilms = localStorage.getItem("data")
      if (searchDataFilms == null) {
        return;
      }
      setSearchData(searchDataFilms)
      input.value = searchDataFilms;
    }
  }, []);

  return (
    <form className="search-form" onSubmit={onSubmit}>
      <label className="search-form_switch_search">
        <input
          className="search-form_input"
          type="search"
          id="search"
          required
          placeholder="Фильм"
          value={searchData || ""}
          name="title"
          onChange={onChangeSearch}
        />
        <button className="search-form_button">Найти</button>
      </label>
      <label className="search-form_checkbox-label" for="short-films">
        Короткометражки
      </label>
      <label className="search-form_switch">
        <input
          onChange={onChangeShortFilms}
          className="search-form_switch-input"
          type="checkbox"
          id="short-films"
          name="short-films"
        />
        <span className="search-form_switch-slider" />
      </label>
    </form>
  );
}

export default SearchForm;