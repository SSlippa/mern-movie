import React, { FC, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Chips } from "primereact/chips";
import { InputNumber } from "primereact/inputnumber";

import "./movie-table.css";
import MovieService, { Movie } from "./movie-service";

interface IMovieTableProps {
  votedM: string[]
}

const MovieTable: FC = ({votedM} : IMovieTableProps) => {
  let emptyMovie = {
    id: "",
    name: "",
    release: new Date(),
    duration: null,
    actors: [],
    rating: 0,
  };

  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieDialog, setMovieDialog] = useState<boolean>(false);
  const [deleteMovieDialog, setDeleteMovieDialog] = useState<boolean>(false);
  const [deleteMoviesDialog, setDeleteMoviesDialog] = useState<boolean>(false);
  const [movie, setMovie] = useState<Movie>(emptyMovie);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [votedMovies, setVotedMovies] = useState<string[]>(votedM)
  const toast = useRef<Toast>(null);
  const movieService = new MovieService();

  useEffect(() => {
    movieService.getMovies().then((data) => {
      if (data.data.movies.length) {
        setMovies(data.data.movies);
      }
    });
  }, []);

  const openNew = () => {
    setMovie(emptyMovie);
    setSubmitted(false);
    setMovieDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setMovieDialog(false);
    setEditMode(false);
    setIsFormValid(false);
  };

  const hideDeleteMovieDialog = () => {
    setDeleteMovieDialog(false);
  };

  const hideDeleteMoviesDialog = () => {
    setDeleteMoviesDialog(false);
  };

  const saveMovie = async () => {
    setSubmitted(true);

    if (movie.name.trim()) {
      let _movie;
      if (isEditMode) {
        _movie = await movieService.updateMovie(movie);
      }
      else {
        _movie = await movieService.createMovie(movie);
      }
      if (_movie.errors) {
        toast.current.show({ severity: "error", summary: "Unsuccessful", detail: "Creation failed", life: 3000 });
        return;
      }
      const _movies = [...movies];
      _movie = _movie.data?.addMovie || _movie.data?.updateMovie;

      if (isEditMode) {
        const index = movies.findIndex(movie => movie.id === _movie.id)

        _movies[index] = _movie;
        toast.current.show({ severity: "success", summary: "Successful", detail: "Movie Updated", life: 3000 });
      } else {
        _movies.push(_movie);
        toast.current.show({ severity: "success", summary: "Successful", detail: "Movie Created", life: 3000 });
      }

      setMovies(_movies);
      setMovieDialog(false);
      setMovie(emptyMovie);
      setIsFormValid(false);
      setEditMode(false)
    }
  };

  const editMovie = (movie: Movie) => {
    setMovie({ ...movie });
    setMovieDialog(true);
    setEditMode(true);
  };

  const confirmDeleteMovie = (movie: Movie) => {
    setMovie(movie);
    setDeleteMovieDialog(true);
  };

  const deleteMovie = async () => {
    const resp = await movieService.deleteMovie(movie.id);

    if (!resp.errors) {
      const _movies = movies.filter(val => val.id !== movie.id);
      setMovies(_movies);
      setDeleteMovieDialog(false);
      setMovie(emptyMovie);
      toast.current.show({ severity: "success", summary: "Successful", detail: "Movie Deleted", life: 3000 });
    }
    else {
      toast.current.show({ severity: "error", summary: "Unsuccessful", detail: "Deletion failed", life: 3000 });
    }

  };

  const confirmDeleteSelected = () => {
    setDeleteMoviesDialog(true);
  };

  const deleteSelectedMovies = async () => {
    const ids = selectedMovies.map(movie => movie.id);
    const resp = await movieService.deleteMovies(ids);

    if (!resp.errors) {
      const _movies = movies.filter((val) => !selectedMovies.includes(val));
      setMovies(_movies);
      setDeleteMoviesDialog(false);
      setSelectedMovies([]);
      toast.current.show({ severity: "success", summary: "Successful", detail: "Movies Deleted", life: 3000 });
    }
    else {
      toast.current.show({ severity: "error", summary: "Unsuccessful", detail: "Deletion failed", life: 3000 });
    }
  };

  const onInputChange = (e, name: string) => {
    let val = (e.target && e.target.value) || e.value || "";
    if (name === "actors") {
      val = e;
    }
    if (name === 'rating') {
      setVotedMovies([...votedMovies, movie.id]);
    }
    let _movie = { ...movie };
    _movie[`${name}`] = val;

    checkIsValid(_movie);
    setMovie(_movie);
  };

  const checkIsValid = (movie: Movie) => {
    setIsFormValid(!!(movie.actors.length && movie.name && movie.duration));
  };

  const leftToolbarTemplate = () => {
    return (
      <>
        <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected}
                disabled={!selectedMovies?.length} />
      </>
    );
  };

  const ratingBodyTemplate = (rowData: Movie) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  const durationBodyTemplate = (rowData: Movie) => {
    return rowData.duration + " mins";
  };

  const actorsBodyTemplate = (rowData: Movie) => {
    return rowData.actors.join(" ");
  };

  const dateBodyTemplate = (rowData: Movie) => {
    const date = new Date(+rowData.release).toLocaleDateString();
    return date;
  };

  const actionBodyTemplate = (rowData: Movie) => {
    return (
      <>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2"
                onClick={() => editMovie(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"
                onClick={() => confirmDeleteMovie(rowData)} />
      </>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Manage Movies</h5>
      <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                           placeholder="Search..." />
            </span>
    </div>
  );
  const movieDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" disabled={!isFormValid} onClick={saveMovie} />
    </>
  );
  const deleteMovieDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMovieDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteMovie} />
    </>
  );
  const deleteMoviesDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMoviesDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedMovies} />
    </>
  );

  return (
    <div className="datatable">
      <Toast ref={toast} />

      <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>
        <DataTable value={movies} selection={selectedMovies} onSelectionChange={(e) => setSelectedMovies(e.value)}
                   dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} movies"
                   globalFilter={globalFilter}
                   stateKey="dt-state-session"
                   stateStorage="session"
                   header={header}>

          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column field="release" header="Release Date" body={dateBodyTemplate} sortable></Column>
          <Column field="duration" header="Duration" sortable body={durationBodyTemplate}></Column>
          <Column field="actors" header="Actors" body={actorsBodyTemplate} sortable></Column>
          <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable></Column>
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog visible={movieDialog} style={{ width: "450px" }} header="Product Details" modal className="p-fluid"
              footer={movieDialogFooter} onHide={hideDialog}>
        <div className="p-field">
          <label htmlFor="name">Name</label>
          <InputText id="name" value={movie.name} onChange={(e) => onInputChange(e, "name")} required autoFocus
                     className={classNames({ "p-invalid": submitted && !movie.name })} />
          {submitted && !movie.name && <small className="p-invalid">Name is required.</small>}
        </div>

        <div className="p-field">
          <label htmlFor="release">Release Date</label>
          <Calendar id="release"
                    value={new Date(+movie.release)}
                    view="month"
                    dateFormat="mm/yy"
                    yearNavigator
                    yearRange="1950:2021"
                    onChange={(e) => onInputChange(e, "release")}></Calendar>
        </div>

        <div className="p-field">
          <label htmlFor="duration">Duration</label>
          <InputNumber id="duration" value={movie.duration} onChange={(e) => onInputChange(e, "duration")} required
                       className={classNames({ "p-invalid": submitted && !movie.duration })} />
          {submitted && !movie.duration && <small className="p-invalid">Duration is required.</small>}
        </div>

        <div className="p-field">
          <label htmlFor="actors">Actors</label>
          <Chips value={movie.actors} onChange={(e) => onInputChange(e.value, "actors")}
                 className={classNames({ "p-invalid": submitted && !movie.actors })} />
          {submitted && !movie.actors && <small className="p-invalid">Actors is required.</small>}
        </div>

        {isEditMode?
          <div className="p-field">
            <label htmlFor="reviews">Reviews</label>
            <Rating id="reviews" value={movie.rating} cancel={false} onChange={(e) => onInputChange(e, "rating")} disabled={votedMovies.includes(movie.id)} />
          </div> : null}

      </Dialog>

      <Dialog visible={deleteMovieDialog} style={{ width: "450px" }} header="Confirm" modal
              footer={deleteMovieDialogFooter} onHide={hideDeleteMovieDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: "2rem" }} />
          {movie && <span>Are you sure you want to delete <b>{movie.name}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deleteMoviesDialog} style={{ width: "450px" }} header="Confirm" modal
              footer={deleteMoviesDialogFooter} onHide={hideDeleteMoviesDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: "2rem" }} />
          {movie && <span>Are you sure you want to delete the selected products?</span>}
        </div>
      </Dialog>
    </div>
  );
};

export default MovieTable;
