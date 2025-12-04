// Simple TMDb + Wikipedia helpers (no bundler required)
const TMDB_BASE = 'https://api.themoviedb.org/3';
const WIKI_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

function getKey(){
  return window.TMDB_API_KEY || '';
}

export async function fetchTrending(){
  const key = getKey();
  const res = await fetch(`${TMDB_BASE}/trending/movie/week?api_key=${key}`);
  return res.ok ? res.json() : {results:[]};
}

export async function searchMovies(query){
  if (!query) return [];
  const key = getKey();
  const res = await fetch(`${TMDB_BASE}/search/movie?api_key=${key}&query=${encodeURIComponent(query)}`);
  const json = await res.json();
  return json.results || [];
}

export async function getMovieDetails(id){
  const key = getKey();
  const [m, credits] = await Promise.all([
    fetch(`${TMDB_BASE}/movie/${id}?api_key=${key}`).then(r=>r.json()),
    fetch(`${TMDB_BASE}/movie/${id}/credits?api_key=${key}`).then(r=>r.json()).catch(()=>({cast:[]}))
  ]);
  m.cast = (credits.cast||[]).slice(0,5).map(c=>c.name);
  return m;
}

export async function wikiSummary(title){
  if (!title) return null;
  try{
    const slug = encodeURIComponent(title.replace(/\s+\(.+\)$/,'').trim());
    const res = await fetch(WIKI_API + slug);
    if (!res.ok) return null;
    return res.json();
  } catch(e){return null}
}
