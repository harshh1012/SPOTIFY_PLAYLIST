import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(null);
  const [phrase, setPhrase] = useState('');
  const [message, setMessage] = useState('');

  const login = () => {
    window.location.href = 'http://127.0.0.1:3000/login';
  };

  const createPlaylist = async () => {
    const res = await axios.post('http://127.0.0.1:3000/create-playlist', { token, phrase });
    setMessage(res.data.message);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('access_token');
    if (t) setToken(t);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Spotify Playlist Manager</h1>
      {!token ? (
        <button onClick={login}>Login with Spotify</button>
      ) : (
        <>
          <input
            placeholder="Enter phrase (e.g. Top 10 Hindi songs)"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
          />
          <button onClick={createPlaylist}>Create Playlist</button>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
