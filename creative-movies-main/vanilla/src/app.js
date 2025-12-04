import { fetchTrending, searchMovies, getMovieDetails, wikiSummary } from './api.js';
import { getWatchlist, addToWatchlist, removeFromWatchlist, saveLastSearch, getLastSearch } from './storage.js';
import { createCard, showToast, el } from './ui.js';

const trendingList = document.getElementById('trendingList');
const resultsGrid = document.getElementById('resultsGrid');
const watchlistEl = document.getElementById('watchlist');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

async function loadTrending(){
  trendingList.innerHTML = '';
  const data = await fetchTrending();
  (data.results||[]).slice(0,12).forEach(m=>{
    const card = createCard(m, async ()=> await openDetails(m.id), (movie)=>{ addToWatchlist(movie); renderWatchlist(); showToast('Added to watchlist') });
    trendingList.appendChild(card);
  })
}

function renderResults(items){
  resultsGrid.innerHTML='';
  items.forEach(m=>{
    const card = createCard(m, async ()=> await openDetails(m.id), (movie)=>{ addToWatchlist(movie); renderWatchlist(); showToast('Added to watchlist') });
    resultsGrid.appendChild(card);
  })
}

function renderWatchlist(){
  const list = getWatchlist(); watchlistEl.innerHTML='';
  list.forEach(m=>{
    const li = el('li',{}, `${m.title}` , el('button',{onClick:()=>{ removeFromWatchlist(m.id); renderWatchlist(); showToast('Removed') }}, 'Remove'));
    watchlistEl.appendChild(li);
  })
}

async function openDetails(id){
  const m = await getMovieDetails(id);
  const wiki = await wikiSummary(m.title);
  const modal = el('div',{class:'section'}, el('h3',{}, m.title), el('p',{}, m.overview||''), el('p',{}, `Cast: ${ (m.cast||[]).join(', ') }`), el('p',{}, wiki && wiki.extract ? wiki.extract : 'No wiki summary'));
  const win = window.open('','_blank','width=700,height=800');
  win.document.body.style.background='#081025'; win.document.body.style.color='#fff'; win.document.body.appendChild(modal);
}

async function doSearch(q){
  const results = await searchMovies(q);
  saveLastSearch(q);
  renderResults(results);
}

searchBtn.addEventListener('click', ()=> doSearch(searchInput.value.trim()));
searchInput.addEventListener('keypress', (e)=>{ if(e.key==='Enter'){ doSearch(searchInput.value.trim()) }});

// init
searchInput.value = getLastSearch();
loadTrending(); renderWatchlist();
