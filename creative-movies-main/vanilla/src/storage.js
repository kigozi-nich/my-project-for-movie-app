export const WATCHLIST_KEY = 'vanilla_watchlist';
export const PREFS_KEY = 'vanilla_prefs';
export const LASTSEARCH_KEY = 'vanilla_lastsearch';

export function getWatchlist(){
  try{return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]')}catch(e){return[]}
}
export function saveWatchlist(list){
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}
export function addToWatchlist(movie){
  const cur = getWatchlist(); if (!cur.find(m=>m.id===movie.id)){cur.push(movie); saveWatchlist(cur)}
}
export function removeFromWatchlist(id){
  const cur = getWatchlist().filter(m=>m.id!==id); saveWatchlist(cur)
}

export function savePrefs(p){ localStorage.setItem(PREFS_KEY, JSON.stringify(p||{})) }
export function getPrefs(){ try{return JSON.parse(localStorage.getItem(PREFS_KEY)||'{}')}catch(e){return{}} }

export function saveLastSearch(q){ localStorage.setItem(LASTSEARCH_KEY, q||'') }
export function getLastSearch(){ return localStorage.getItem(LASTSEARCH_KEY) || '' }
