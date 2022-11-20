import { createContext, FC, PropsWithChildren, useContext } from 'react';

export interface IMainLayoutContext {
  UserProfileContainer: FC;
}

export const MainLayoutContext = createContext<IMainLayoutContext | null>(null);

export interface MainLayoutProviderProps {
  value: IMainLayoutContext;
}

export const MainLayoutProvider = ({
  value,
  children,
}: PropsWithChildren<MainLayoutProviderProps>) => {
  return (
    <MainLayoutContext.Provider value={value}>
      {children}
    </MainLayoutContext.Provider>
  );
};

export const useMainLayoutContext = () => {
  const context = useContext(MainLayoutContext);

  if (!context) throw new Error('No main layout context found!');

  return context;
};
