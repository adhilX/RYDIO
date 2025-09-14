import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface ChatContextType {
  shouldRefetchSidebar: boolean;
  triggerSidebarRefetch: () => void;
  resetSidebarRefetch: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [shouldRefetchSidebar, setShouldRefetchSidebar] = useState(false);

  const triggerSidebarRefetch = () => {
    setShouldRefetchSidebar(true);
  };

  const resetSidebarRefetch = () => {
    setShouldRefetchSidebar(false);
  };

  return (
    <ChatContext.Provider value={{
      shouldRefetchSidebar,
      triggerSidebarRefetch,
      resetSidebarRefetch
    }}>
      {children}
    </ChatContext.Provider>
  );
};
