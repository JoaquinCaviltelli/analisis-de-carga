import { Link } from "react-router-dom";

const TipoDeAnalisis = () => {
  return (
    <div className="m-10">
      <h2 className="mb-8 text-4xl font-semibold text-barbieriBlue">
        Analisis de carga
      </h2>
      <div className="flex  w-full flex-wrap gap-2 text-2xl  text-gray">
        <Link  to="/tipo-de-analisis/vigas">
          <div className="flex w-56 flex-col items-center justify-between rounded border-2">
            <img
              src="https://barbieriuruguay.com.uy/blog/wp-content/uploads/2015/05/DSC04382-1024x768.jpg"
              alt=""
            />
            <p className="p-5">Vigas</p>
          </div>
        </Link>
        <Link
          
          to="/tipo-de-analisis/vigas-tubo"
        >
          <div className="flex w-56 flex-col items-center justify-between rounded border-2">
            <img
              src="https://barbieriuruguay.com.uy/blog/wp-content/uploads/2015/05/DSC04382-1024x768.jpg"
              alt=""
            />
            <p className="p-5">Vigas Tubo</p>
          </div>
        </Link>
        <Link
          
          to="/tipo-de-analisis/montantes"
        >
          <div className="flex w-56 flex-col items-center justify-between rounded border-2">
            <img
              src="https://barbieriuruguay.com.uy/blog/wp-content/uploads/2015/05/DSC04382-1024x768.jpg"
              alt=""
            />
            <p className="p-5">Montantes</p>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default TipoDeAnalisis;
