export function el(tag, props={}, ...children){
  const e = document.createElement(tag);
  Object.entries(props).forEach(([k,v])=>{ if(k.startsWith('on') && typeof v==='function'){ e.addEventListener(k.slice(2).toLowerCase(), v)} else if(k==='html'){ e.innerHTML = v } else { e.setAttribute(k,v) }});
  children.flat().forEach(c=>{ if(typeof c === 'string') e.appendChild(document.createTextNode(c)); else if (c) e.appendChild(c) });
  return e;
}

export function showToast(msg, timeout=2400){
  const t = document.getElementById('toast'); if(!t) return; t.textContent = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), timeout);
}

export function createCard(movie, onClick, onAdd){
  const img = el('img',{src: movie.poster_path? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '', alt: movie.title});
  const meta = el('div',{class:'meta'}, el('strong',{}, movie.title || 'Untitled'), el('div',{}, `Rating: ${movie.vote_average||'N/A'}`));
  const addBtn = el('button',{onClick:(e)=>{ e.stopPropagation(); onAdd(movie) }}, 'Add');
  const card = el('div',{class:'card', role:'button', onClick:()=>onClick(movie)}, img, meta, addBtn);
  return card;
}
