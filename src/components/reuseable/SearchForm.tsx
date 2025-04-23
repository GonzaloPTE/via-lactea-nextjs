export default function SearchForm() {
  return (
    <form className="search-form">
      <div className="form-floating mb-0">
        <input 
          id="search-form" 
          type="text" 
          className="form-control" 
          placeholder="Buscar..." 
        />
        <label htmlFor="search-form">Buscar...</label>
        <button type="submit" className="btn btn-primary btn-sm position-absolute top-50 end-0 translate-middle-y me-3">
          <i className="uil uil-search"></i>
        </button>
      </div>
    </form>
  );
} 