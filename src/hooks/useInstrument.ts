import { useEffect, useState} from "react";
import { OPTION_INSTRUMENTS } from "../constants/optionInstruments";

function useInstrument () {
  const [optionsMenu, setOptionsMenu] = useState([]);

  useEffect(() => {
    setOptionsMenu(OPTION_INSTRUMENTS); 
  }, []);

  useEffect(() => {
    console.log(optionsMenu)
  }, [optionsMenu])
  

  return optionsMenu
}

export default useInstrument