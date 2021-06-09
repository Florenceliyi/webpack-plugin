/*
import $ from 'jquery';

const oBtn = document.querySelector('button');
oBtn.onclick = function() {
    const $div = getComponment();
    document.body.appendChild($div[0]);
};
function getComponment() {
    const $div = $('<div>我是div</div>');
    return $div;
}
*/

const oBtn = document.querySelector('button');
console.log(oBtn);
oBtn.onclick = function() {
    getComponment().then(($div) => {
        document.body.appendChild($div[0]);
    });
};
/*
function getComponment() {
    return import('jquery').then(({ default: $ }) => {
        const $div = $('<div>我是div</div>');
        return $div;
    });
}
 */
async function getComponment() {
    const { default: $ } = await import('jquery');
    const $div = $('<div>我是div</div>');
    return $div;
}
