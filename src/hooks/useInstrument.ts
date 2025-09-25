import { useEffect , useState} from "react";
import { getInstruments } from "../services/instrumentService";


function useInstrument () {
  const [optionMenu, setOptionMenu] = useState([]);

  // traer instrumentos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInstruments();
        const objInstrument = data.map(item => ({
          instrumento: item.name,
          precipitacion: item.precipitacion.type,
        }));
        setOptionMenu(objInstrument);
      } catch (error) {
        console.error("Error al traer instrumentos:", error);
      }
    };
    fetchData();
  }, []);
  return optionMenu
}

export default useInstrument