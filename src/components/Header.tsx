import "./Header.css";

export const Header = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="container text-center">
          <div className="row align-items-center">
            <div className="col">
              <img
                className="container"
                src="https://www.pngall.com/wp-content/uploads/13/Pokemon-Logo-Background-PNG.png"
                alt="test"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="fluid-container subheader"></div>
    </>
  );
};
