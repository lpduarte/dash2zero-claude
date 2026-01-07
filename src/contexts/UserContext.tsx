import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserType } from '@/types/user';

// Mock users para prototipagem
const mockUsers: User[] = [
  {
    id: 'empresa-1',
    name: 'TechCorp',
    email: 'demo@techcorp.pt',
    userType: 'empresa',
    createdAt: new Date(),
  },
  {
    id: 'municipio-cascais',
    name: 'Câmara Municipal de Cascais',
    email: 'ambiente@cm-cascais.pt',
    userType: 'municipio',
    municipality: 'Cascais',
    createdAt: new Date(),
  },
];

interface UserContextType {
  user: User;
  userType: UserType;
  setUserType: () => void; // Toggle entre users
  isEmpresa: boolean;
  isMunicipio: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);

  const isEmpresa = currentUser.userType === 'empresa';
  const isMunicipio = currentUser.userType === 'municipio';

  // Toggle entre os dois mock users
  const toggleUserType = () => {
    const newUser = currentUser.userType === 'empresa' 
      ? mockUsers[1]  // Muda para Cascais
      : mockUsers[0]; // Muda para Empresa
    setCurrentUser(newUser);
  };

  return (
    <UserContext.Provider value={{ 
      user: currentUser,
      userType: currentUser.userType,
      setUserType: toggleUserType,
      isEmpresa, 
      isMunicipio 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
