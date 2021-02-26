var $li;

const deleteTabWindow = document.getElementsByClassName('modal')[1];

window.addEventListener('click', function(event) {
    if (event.target == deleteTabWindow) {
        deleteTabWindow.style.display = 'none';
    }
})

const deleteHandler = event => {
    $li = event.target.parentElement;
    const title = $li.innerText;
    const text = document.querySelector('#delete span');
    text.innerHTML = 'Are you sure you want to delete \'' + title + '\' tab?';
    deleteTabWindow.style.display = 'block';
};

const editHandler = event => {
    $li = event.target.parentElement;
    const title = $li.innerText;
    console.log(title);
    fetch('../php/changeTitle.php', {
        method: 'POST',
        body: JSON.stringify({title: title}),
    })
    .then(response => {
        document.location.assign('../html/edit-tab.html');
    })
};

// const playHandler = event => {
//     $li = event.target.parentElement;
//     const title = $li.innerText;
//     fetch('../php/changeTitle.php', {
//         method: 'POST',
//         body: JSON.stringify({title: title}),
//     })
//     .then(response => {
//         fetch('../php/titleAndTab.php')
//             .then(response => response.json())
//             .then(response => {
//                 TAB = Tab.fromJSON(JSON.parse(response['tab']));
//                 playTab(TAB);
//             });
//     })
// }

const deleteForm = document.getElementById('delete-form');
deleteForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const submitter = event.submitter;
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    if (submitter == noBtn) {
        deleteTabWindow.style.display = 'none';
        return false;
    } else if (submitter == yesBtn) {
        const title = $li.innerText;
        fetch(event.target.getAttribute('action'), {
            method: 'POST',
            body: JSON.stringify({title: title}),
        })
        .then(response => response.json())
        .then(({success}) => {
            if (success) {
                document.location.reload();
            }
        })
    }
});

fetch('../php/tabsByUser.php')
.then(response => response.json())
.then(tabs => {
    const tabsSection = document.getElementById('tabs-section');
    const orderedList = document.createElement('ol');
    tabsSection.appendChild(orderedList);
    for (let i = 1; i <= tabs.length; i++) {
        setTimeout (function(){
            const editIco = document.createElement('img');
            editIco.src = "../edit.svg";
            const deleteIco = document.createElement('img');
            deleteIco.src = "../delete.png";
            // const playIco = document.createElement('img');
            // playIco.src = "../play.png";
            const li = document.createElement('li');
            const tabName = document.createTextNode(tabs[i-1]['title']);
            
            deleteIco.addEventListener('click', deleteHandler);
            editIco.addEventListener('click', editHandler);
            // playIco.addEventListener('click', playHandler);

            li.appendChild(tabName);
            li.appendChild(deleteIco);
            li.appendChild(editIco);
            // li.appendChild(playIco);
            orderedList.appendChild(li);

            li.style.display = 'block';
    
            if (i < tabs.length) {
                li.style.borderBottom = '2px solid #f0f0f0';
            }
        }, i*100);
    }

    if (tabs.length == 0) {
        const div = document.createElement('div');
        div.id = 'msg';
        div.style.display = 'block';
        const msg = document.createTextNode('You still have no tabs!');
        div.appendChild(msg);
        tabsSection.appendChild(div);
    }
})

