import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserType, Client } from '@/types/user';
import { mockClients } from '@/data/mockClients';

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
    clientId: 'cascais',
    createdAt: new Date(),
  },
  {
    id: 'get2c-admin',
    name: 'Get2C Admin',
    email: 'admin@get2c.pt',
    userType: 'get2c',
    createdAt: new Date(),
  },
];

// Chave para persistir cliente ativo no localStorage
const ACTIVE_CLIENT_KEY = 'dash2zero_active_client';

interface UserContextType {
  user: User;
  userType: UserType;
  setUserType: (type?: UserType) => void;
  isEmpresa: boolean;
  isMunicipio: boolean;
  isGet2C: boolean;

  // Gestão de clientes (apenas para Get2C)
  clients: Client[];
  activeClient: Client | null;
  setActiveClient: (client: Client | null) => void;

  // Permissões efetivas (do cliente ativo ou todas se Get2C sem cliente)
  effectivePermissions: Client['permissions'] | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [clients] = useState<Client[]>(mockClients.filter(c => !c.isArchived));
  const [activeClient, setActiveClientState] = useState<Client | null>(null);

  // Restaurar cliente ativo do localStorage ao iniciar
  useEffect(() => {
    const savedClientId = localStorage.getItem(ACTIVE_CLIENT_KEY);
    if (savedClientId && currentUser.userType === 'get2c') {
      const client = mockClients.find(c => c.id === savedClientId && !c.isArchived);
      if (client) {
        setActiveClientState(client);
      }
    }
  }, [currentUser.userType]);

  const isEmpresa = currentUser.userType === 'empresa';
  const isMunicipio = currentUser.userType === 'municipio';
  const isGet2C = currentUser.userType === 'get2c';

  // Mudar tipo de utilizador - aceita tipo direto ou faz cycle
  const setUserTypeDirectly = (type?: UserType) => {
    let newUser: User;

    if (type) {
      // Selecionar diretamente o tipo especificado
      const targetUser = mockUsers.find(u => u.userType === type);
      if (targetUser) {
        newUser = targetUser;
      } else {
        return; // Tipo não encontrado
      }
    } else {
      // Cycle entre os mock users (empresa → município → get2c → empresa)
      const currentIndex = mockUsers.findIndex(u => u.id === currentUser.id);
      const nextIndex = (currentIndex + 1) % mockUsers.length;
      newUser = mockUsers[nextIndex];
    }

    setCurrentUser(newUser);

    // Limpar cliente ativo se não for Get2C
    if (newUser.userType !== 'get2c') {
      setActiveClientState(null);
      localStorage.removeItem(ACTIVE_CLIENT_KEY);
    }
  };

  // Definir cliente ativo (com persistência)
  const setActiveClient = (client: Client | null) => {
    setActiveClientState(client);
    if (client) {
      localStorage.setItem(ACTIVE_CLIENT_KEY, client.id);
    } else {
      localStorage.removeItem(ACTIVE_CLIENT_KEY);
    }
  };

  // Permissões efetivas
  const effectivePermissions = activeClient?.permissions ?? null;

  return (
    <UserContext.Provider value={{
      user: currentUser,
      userType: currentUser.userType,
      setUserType: setUserTypeDirectly,
      isEmpresa,
      isMunicipio,
      isGet2C,
      clients,
      activeClient,
      setActiveClient,
      effectivePermissions,
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
