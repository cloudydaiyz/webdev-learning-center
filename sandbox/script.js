const btn =  document.getElementById('btn-to-click');
const p = document.getElementById('p-to-hide');

btn.addEventListener('click', event => {
    p.classList.toggle('hidden')
});