// Media button
document.querySelectorAll('button.media').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('play');
        button.classList.toggle('pause');
    });
});

// Tab elements
document.querySelectorAll('div.tab').forEach(div => {
    let selected = null;
    for(let i = 0; i < div.children.length; i++) {
        const tabElement = div.children.item(i);
        tabElement.classList.add('unselected');

        tabElement?.addEventListener('click', () => {
            if(selected) {
                selected.classList.remove('selected');
                selected.classList.add('unselected');
            }

            tabElement.classList.remove('unselected');
            tabElement.classList.add('selected');
            selected = tabElement;
        });
    }
});