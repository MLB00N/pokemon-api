import React, { Suspense, useState } from "react";
import useSWR from "swr";
import "./Body.css";

interface ApiData {
  count: number;
  next: string;
  previous: string | null;
  results: { name: string; url: string }[];
}

const PokemonCard = React.lazy(() => import("./PokemonCard"));

export function Body() {
  const [offset, setOffset] = useState(0);
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=8&offset=${offset}`;

  const { data, error } = useSWR<ApiData>(
    url,
    async (url: string) => {
      const response = await fetch(url);
      const result = await response.json();
      return {
        count: result.count,
        next: result.next,
        results: result.results,
        previous: result.previous,
      };
    },
    { revalidateOnFocus: false }
  );

  const currentPage = offset <= 8 ? 2 : offset / 8 + 1;
  const previousPage = offset <= 8 ? 1 : currentPage - 1;
  const nextPage = offset / 8 < 2 ? 3 : currentPage + 1;
  const goToNextPage = () => {
    setOffset(offset + 8);
  };

  const goToPreviousPage = () => {
    setOffset(offset - 8);
  };

  const goToPage = (targetPage: number) => {
    if (offset === 0) {
      setOffset((targetPage - 1) * 8);
    } else if (targetPage > currentPage) {
      setOffset(offset + (targetPage - currentPage) * 8);
    } else if (targetPage < currentPage) {
      setOffset(offset - (currentPage - targetPage) * 8);
    } else {
      setOffset(offset);
    }
  };

  const jumpToPage = (page: number) => {
    if (page > 0) {
      setOffset(page * 8 - 8);
    }
  };

  if (error) return <div>Failed to load Pokemon name</div>;
  if (!data) return <div>Loading...</div>;
  if (offset > 159 * 8)
    return (
      <div className="outOfScope">
        <div>
          <p className="h1">Oooops, you went too far!</p>
          <button
            onClick={() => {
              setOffset(0);
            }}
            className="btn btn-primary"
          >
            {" "}
            Go Back
          </button>{" "}
        </div>
      </div>
    );

  return (
    <div className="wrapper">
      <div className="container-sm text-center">
        <div className="row">
          {data.results.map((result) => (
            <div className="col">
              <Suspense fallback={<div>Loading...</div>}>
                <PokemonCard pokeName={result.name} />
              </Suspense>
            </div>
          ))}
        </div>
      </div>

      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className="page-item">
            <button
              disabled={offset === 0 ? true : false}
              onClick={goToPreviousPage}
              className={`page-link ${offset === 0 ? "disabled" : ""}`}
            >
              Previous
            </button>
          </li>
          <li className="page-item">
            <button
              onClick={() => goToPage(previousPage)}
              className={`page-link ${offset === 0 ? "page-item active" : ""}`}
            >
              {previousPage}
            </button>
          </li>
          <li className="page-item">
            <button
              onClick={() => goToPage(currentPage)}
              className={`page-link ${offset > 0 ? "page-item active" : ""}`}
            >
              {currentPage}
            </button>
          </li>
          <li className="page-item">
            <button onClick={() => goToPage(nextPage)} className="page-link">
              {nextPage}
            </button>
          </li>
          <li className="page-item">
            <button onClick={goToNextPage} className="page-link">
              Next
            </button>
          </li>
        </ul>
        <ul className="pagination">
          <li className="page-item">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const inputElement = event.currentTarget.elements.item(
                  0
                ) as HTMLInputElement;
                console.log("inputElement", inputElement);

                const inputValue = Number(inputElement.value);
                console.log("inputValue", inputValue);
                console.log("offset", offset);
                jumpToPage(inputValue);
              }}
            >
              <span className="form-group pageSelector">
                <label htmlFor="jumpToPage">Jump to page: </label>
                <input type="number" className="form-control" id="jumpToPage" />
              </span>
            </form>
          </li>
        </ul>
      </nav>
    </div>
  );
}
