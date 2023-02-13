import React from "react";

function Form() {
  const form = document.querySelector("form");
  const input = document.querySelector("input");

  // Now you can use the inputValue in an API call

  return (
    <div>
      <form>
        <input
          style={{ width: "18rem" }}
          type="number"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
        />
        <div id="emailHelp" className="form-text">
          Type in the number of your favorite Pokemon.
        </div>
        <button
          // onClick={() => handleSubmit}
          type="submit"
          className="btn btn-primary"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Form;
