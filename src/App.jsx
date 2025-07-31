import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Protected from './components/Protected';
import AdminPanel from './components/AdminPanel';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        // Fetch user metadata for role
        const { data } = await supabase.auth.getUser();
        setRole(data?.user?.user_metadata?.role || 'user');
      } else {
        setRole(null);
      }
    };
    fetchRole();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  // Animated header component
  const AnimatedHeader = () => (
    <h1 className="animated-header">Secure User Authentication</h1>
  );

  if (!user) {
    return (
      <div className="main-card">
        <AnimatedHeader />
        <Auth onAuth={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="main-card">
      <AnimatedHeader />
      <Protected user={user} onLogout={() => setUser(null)}>
        <p>Your email: {user.email}</p>
        <p>Your role: {role}</p>
        {role === 'admin' && <AdminPanel />}
        <p style={{marginTop: 32}}>This is a protected route. Only authenticated users can see this.</p>
      </Protected>
    </div>
  );
}

export default App;
