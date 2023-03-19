import Header from "../components/Header";

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="my-28 mx-10 ">
        <h2 className="text-gray pb-5 text-3xl font-black">
          Error 404 - Pagina no encontrada
        </h2>
        <a
          className="font-semibold text-barbieriBlue hover:text-barbieriRed"
          href="/"
        >
          {" "}
          Volve a la pagina principal
        </a>
      </div>
    </>
  );
};
export default NotFound;
