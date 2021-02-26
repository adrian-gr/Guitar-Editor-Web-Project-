const logoutHandler = function(event) {
    fetch('../php/logout.php')
    .then(response => response.json())
    .then(isset => {
        if (isset) {
            document.location.assign('../html/homepage.html');
        }
    });
}

const logout = document.getElementById('logout');
logout.addEventListener('click', logoutHandler);

const myTabsHandler = function(event) {
    document.location.assign('../html/tabs.html');
}

const myTabs = document.getElementById('my-tabs');
myTabs.addEventListener('click', myTabsHandler);

const createNewTabWindow = document.getElementsByClassName('modal')[0];

window.addEventListener('click', function(event) {
    if (event.target == createNewTabWindow) {
        createNewTabWindow.style.display = 'none';
        document.getElementById('create-new-tab-error').style.visibility = 'hidden';
        document.getElementById('tab-title').value = '';
    }
});

document.getElementById('create-new-tab').addEventListener('click', function(event) {
    createNewTabWindow.style.display = 'block';
});

const createNewTabHandler = event => {
    event.preventDefault();
    const title = document.getElementById('tab-title').value;
    if (title.length == 0) {
        document.getElementById('create-new-tab-error').innerHTML = 'Tab title should be no empty!'
        document.getElementById('create-new-tab-error').style.visibility = 'visible';
        return false;
    } else {
        fetch(event.target.getAttribute('action'), {
            method: 'POST',
            body: JSON.stringify({title: title}),
        })
        .then(response => response.json())
        .then(({success}) => {
            if (success) {
                document.location.assign('../html/edit-tab.html');
            } else {
                document.getElementById('create-new-tab-error').innerHTML = 'Tab already exists!'
                document.getElementById('create-new-tab-error').style.visibility = 'visible';
                return false;
            }
        });
    }
    return true;
}

const createNewTabForm = document.getElementById('create-new-tab-form');
createNewTabForm.addEventListener('submit', createNewTabHandler);