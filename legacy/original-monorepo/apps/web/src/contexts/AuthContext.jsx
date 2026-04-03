
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchMemberData = async (userId) => {
    try {
      const members = await pb.collection('members').getList(1, 1, {
        filter: `userId = "${userId}"`,
        $autoCancel: false
      });

      if (members.items.length > 0) {
        setMemberData(members.items[0]);
        return members.items[0];
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch member data:', error);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (pb.authStore.isValid && pb.authStore.model) {
        setCurrentUser(pb.authStore.model);
        await fetchMemberData(pb.authStore.model.id);
      }
      setInitialLoading(false);
    };

    initAuth();

    const unsubscribe = pb.authStore.onChange(async (token, model) => {
      setCurrentUser(model);
      if (model) {
        await fetchMemberData(model.id);
      } else {
        setMemberData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
    setCurrentUser(authData.record);
    const member = await fetchMemberData(authData.record.id);
    return { user: authData.record, member };
  };

  const signup = async (userData) => {
    const user = await pb.collection('users').create({
      email: userData.email,
      password: userData.password,
      passwordConfirm: userData.passwordConfirm,
      role: 'member'
    }, { $autoCancel: false });

    const member = await pb.collection('members').create({
      userId: user.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      gender: userData.gender,
      date_of_birth: userData.date_of_birth,
      marital_status: userData.marital_status,
      spouse_name: userData.spouse_name,
      marriage_date: userData.marriage_date,
      member_category: userData.member_category || 'General Member',
      approval_status: 'pending',
      directory_visible: true
    }, { $autoCancel: false });

    return { user, member };
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setMemberData(null);
  };

  const refreshUser = async () => {
    if (pb.authStore.isValid && pb.authStore.model?.id) {
      try {
        const updated = await pb.collection('users').getOne(pb.authStore.model.id, { $autoCancel: false });
        setCurrentUser(updated);
        await fetchMemberData(updated.id);
      } catch (error) {
        console.error('Failed to refresh user:', error);
      }
    }
  };

  const value = {
    currentUser,
    memberData,
    login,
    signup,
    logout,
    refreshUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isMemberManager: currentUser?.role === 'member_manager' || currentUser?.role === 'admin',
    isApproved: memberData?.approval_status === 'approved',
    isPending: memberData?.approval_status === 'pending'
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
