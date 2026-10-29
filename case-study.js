const viewer=document.querySelector('.image-viewer');
let trigger;
document.querySelectorAll('.artifact').forEach(button=>button.addEventListener('click',()=>{
 trigger=button;
 const source=button.querySelector('img');
 viewer.querySelector('img').src=button.dataset.image;
 viewer.querySelector('img').alt=source.alt;
 viewer.querySelector('p').textContent=source.alt;
 viewer.querySelector('.original-image').href=button.dataset.image;
 viewer.showModal();document.body.classList.add('viewer-open');
}));
viewer.querySelector('.close-viewer').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',event=>{if(event.target===viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();}});
viewer.addEventListener('close',()=>{document.body.classList.remove('viewer-open');trigger?.focus();});
