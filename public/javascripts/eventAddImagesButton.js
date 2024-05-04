// TODO maybe not use it on layout, only for show page

const inputField = document.getElementById('imageAdder');
const addButton = document.getElementById('buttonAddImages');

if (inputField){
    inputField.addEventListener('change', function () {
        console.log(this.files.length);
        if (this.files.length){
            addButton.classList.remove('disabled')
        } else {
            addButton.classList.add('disabled')
        }
    })
}