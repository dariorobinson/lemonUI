import router from '../../app.js';

const NAVBAR_ELEMENT = document.getElementById('navbar');

function NavbarComponent() {

    let templateHolder = '';
    let frag = `components/navbar/navbar`;

    function injectTemplate (cb) {
        if (templateHolder) {
            NAVBAR_ELEMENT.innerHTML = templateHolder;
        } else {
            fetch(`${frag}.html`)
                .then(resp => resp.text())
                .then(body => {
                    templateHolder = body
                    NAVBAR_ELEMENT.innerHTML = templateHolder;
                    cb();
                })
                .catch(err => console.error(err))
        }

    }

    function injectStylesheet() {
        let stylesheet = document.getElementById('dynamic-css');
        if (stylesheet) stylesheet.remove();
        stylesheet = document.createElement('link');
        stylesheet.id = 'dynamic-css'
        stylesheet.rel = 'stylesheet';
        stylesheet.href = `${frag}.css`;
        document.head.appendChild(stylesheet);
    }
    
    this.render = function() {
        injectStylesheet();
        injectTemplate();
    }

}

export default new NavbarComponent();