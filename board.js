'use strict';
// Der vorhandene Ablauf bleibt erhalten; nur die Präsentation wird in gut lesbare Seiten gegliedert.
(function(){
 const sourcePanel=document.querySelector('#panel'),speech=document.querySelector('#bubble');
 let pages=[],index=0,pager,body,notes=[],resizeTimer;
 document.body.classList.toggle('board-embedded',window.parent!==window);
 const nav=document.querySelector('header nav'),tools=document.querySelector('header .tools');
 if(nav&&tools){const b=document.createElement('button');b.textContent='Kapitel';b.onclick=()=>nav.classList.toggle('board-nav-open');tools.prepend(b);nav.addEventListener('click',()=>nav.classList.remove('board-nav-open'));}
 const info=document.createElement('dialog');info.className='board-info-dialog';document.body.append(info);
 function help(){info.replaceChildren();const h=document.createElement('h1');h.textContent='Weitere Gedanken';info.append(h);notes.forEach(n=>info.append(n.cloneNode(true)));const b=document.createElement('button');b.className='primary';b.textContent='Zurück zur Frage';b.onclick=()=>info.close();info.append(b);info.showModal();}
 function show(n){index=Math.max(0,Math.min(n,pages.length-1));pages.forEach((page,i)=>page.forEach(node=>node.hidden=i!==index));pager.hidden=pages.length<=1;pager.children[0].disabled=index===0;pager.children[1].textContent=(index+1)+' / '+pages.length;pager.children[2].disabled=index===pages.length-1;pager.children[2].textContent=index===pages.length-1?'Alles sichtbar':'Weiterlesen →';}
 function paginate(nodes){
  nodes.forEach(n=>{n.hidden=false;body.append(n);});
  function divide(){const available=Math.max(230,body.clientHeight-8);pages=[];let group=[],used=0;nodes.forEach(n=>{const st=getComputedStyle(n);const h=n.getBoundingClientRect().height+(parseFloat(st.marginTop)||0)+(parseFloat(st.marginBottom)||0);if(group.length&&used+h>available){pages.push(group);group=[];used=0;}group.push(n);used+=h;});if(group.length)pages.push(group);if(!pages.length)pages=[[]];}
  pager.hidden=true;divide();if(pages.length>1){pager.hidden=false;divide();}show(0);
 }
 function layout(){
  const nodes=[...sourcePanel.children];if(!nodes.length)return;
  notes=[];const title=document.createElement('div');title.className='board-title';body=document.createElement('div');body.className='board-body';const content=[];
  nodes.forEach(n=>{n.hidden=false;if(n.matches('.kicker,h1'))title.append(n);else if(n.matches('.note,details')&&!n.querySelector('textarea,button'))notes.push(n);else content.push(n);});
  const ar=!!document.querySelector('#landscape');
  // Die Handlung von Epikurs Figuren muss sichtbar bleiben, aber nur in der einen Lesefläche.
  if(!ar&&speech&&speech.querySelector('span')){const st=document.body.dataset.step;const plot=['gate','thirst','thirstResult','vain','vainResult','weigh','sort','feast'];if(plot.includes(st)){const d=document.createElement('div');d.className='board-speech';d.append(...[...speech.childNodes].map(n=>n.cloneNode(true)));content.unshift(d);}}
  // Aristoteles' Begriffsdefinitionen aus dem Bild stehen als freiwillige Vertiefung zur Verfügung.
  if(ar){document.querySelectorAll('#stage .thought').forEach(n=>notes.push(n));}
  const grouped=[];let options=null;content.forEach(n=>{if(n.matches('.object,.choice,.casecard')){if(!options){options=document.createElement('div');options.className='board-options';grouped.push(options);}options.append(n);}else{options=null;grouped.push(n);}});
  sourcePanel.replaceChildren(title);if(notes.length){const more=document.createElement('button');more.className='board-help';more.textContent='Weitere Gedanken öffnen';more.onclick=help;sourcePanel.append(more);}sourcePanel.append(body);
  pager=document.createElement('div');pager.className='board-pagination';const back=document.createElement('button'),count=document.createElement('span'),next=document.createElement('button');back.textContent='← Lesen';back.onclick=()=>show(index-1);next.onclick=()=>show(index+1);pager.append(back,count,next);sourcePanel.append(pager);paginate(grouped);
 }
 const previous=render;render=function(){previous();layout();};
 // Vorlesen liest die gerade sichtbare Seite, nicht die ausgeblendeten Folgeseiten.
 const read=document.querySelector('#read');if(read)read.onclick=()=>{if(!('speechSynthesis'in window)){alert('Dieser Browser unterstützt Vorlesen nicht.');return;}if(speechSynthesis.speaking){speechSynthesis.cancel();read.textContent='Vorlesen';return;}const text=sourcePanel.querySelector('.board-title').innerText+'. '+pages[index].map(n=>n.innerText).join('. ');const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.9;u.onend=()=>read.textContent='Vorlesen';speechSynthesis.speak(u);read.textContent='Stopp';};
 window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{const nodes=pages.flat();if(nodes.length)paginate(nodes);},150);});
 layout();
})();
