const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const redirect_uri = 'http://127.0.0.1:3000/callback';

app.get('/login', (req, res) => {
  const scopes = 'playlist-modify-public playlist-modify-private';
  res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    scope: scopes,
    redirect_uri
  })}`);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  const response = await axios.post('https://accounts.spotify.com/api/token',
    querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri
    }),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  res.redirect(`http://localhost:5173/?access_token=${response.data.access_token}`);
});

app.post('/create-playlist', async (req, res) => {
  const { token, phrase } = req.body;

  try {
    const user = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const search = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: phrase, type: 'track', limit: 10 }
    });

    const trackUris = search.data.tracks.items.map(track => track.uri);

    const playlist = await axios.post(
      `https://api.spotify.com/v1/users/${user.data.id}/playlists`,
      { name: `Playlist: ${phrase}`, public: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlist.data.id}/tracks`,
      { uris: trackUris },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json({ message: 'Playlist created!' });
  } catch (error) {
    res.status(500).send('Error creating playlist');
  }
});

app.listen(3000, () => console.log('Backend running on port 3000'));
