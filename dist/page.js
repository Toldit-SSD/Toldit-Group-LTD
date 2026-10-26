// Proposed format selection updates only the user's draft inquiry links.
const inquiry=document.querySelector('.page-inquiry[data-product]');
const format=document.querySelector('#planned-format');
if(inquiry&&format){format.addEventListener('change',()=>{const product=inquiry.dataset.product;const message=`Hello Toldit Group, I’m interested in ${product}.${format.value?' Proposed format: '+format.value+'.':''} Could you share more information and expected availability?`;inquiry.querySelector('.contact-email').href=`mailto:tolditgroup@gmail.com?subject=${encodeURIComponent('Product inquiry: '+product)}&body=${encodeURIComponent(message)}`;inquiry.querySelector('.contact-whatsapp').href=`https://wa.me/256769199999?text=${encodeURIComponent(message)}`;});}
