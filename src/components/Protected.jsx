import React from 'react';
import { supabase } from '../supabaseClient';

export default function Protected({ user, onLogout, children }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span>Welcome, {user.email}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div style={{marginTop: 24}}>
        {children}
      </div>
    </div>
  );
}
