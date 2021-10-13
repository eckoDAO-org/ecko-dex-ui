import React, { createContext, useState } from "react";

export const GameEditionContext = createContext(null);


export const GameEditionProvider = (props) => {

    const [gameEditionView, setGameEditionView] = useState(false);
    

  return (
    <GameEditionContext.Provider value={{gameEditionView, setGameEditionView}}>
      {props.children}
    </GameEditionContext.Provider>
  );
};