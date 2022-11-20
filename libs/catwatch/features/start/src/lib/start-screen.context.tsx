import { createContext, FC, PropsWithChildren, useContext } from 'react';

export interface IStartScreenContext {
  JoinRoomFormContainer: FC;
  CreateRoomContainer: FC;
}

export const StartScreenContext = createContext<IStartScreenContext | null>(
  null
);

export interface StartScreenContextProviderProps {
  value: IStartScreenContext;
}

export const StartScreenContextProvider = ({
  value,
  children,
}: PropsWithChildren<StartScreenContextProviderProps>) => {
  return (
    <StartScreenContext.Provider value={value}>
      {children}
    </StartScreenContext.Provider>
  );
};

export const useStartScreenProvider = () => {
  const context = useContext(StartScreenContext);

  if (!context) throw new Error('No start screen containers found');

  return context;
};
