const Result = ({ posiblesPerfiles, dataForm, valorMaximo }) => {
  return (
    <div className="w-full max-w-3xl text-center md:w-8/12">
      {posiblesPerfiles.length > 0 && (
        <>
          <h2 className=" mb-4 text-xl font-bold text-barbieriBlue">
            {posiblesPerfiles[0].perfil} mm
          </h2>
          <p className="text-gray-600">
            Para una luz de {dataForm.luz}m y una carga de {valorMaximo}kg/m2 se
            necesita un perfil de{" "}
            <b className="text-barbieriBlue">{posiblesPerfiles[0].perfil} mm</b>{" "}
            que tiene una deformacion de {posiblesPerfiles[0].deformacion} y una
            resistencia de {posiblesPerfiles[0].resistencia} segun la tabla del
            cirsoc para vigas
          </p>
        </>
      )}
    </div>
  );
};
export default Result;
