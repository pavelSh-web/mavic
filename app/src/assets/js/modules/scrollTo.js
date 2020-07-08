// общая функция

function scrollTo(elem) {
    window.scroll({
        left: 0,
        top: elem.offsetTop,
        behavior: 'smooth'
    });
}


//скролл к секциям из ссылок меню

let scrollTriggers = document.querySelectorAll('.header-menu__item');
scrollTriggers.forEach(item => {
    item.addEventListener('click', (e) => {
        event.preventDefault();
        const   scrollHash = e.target.hash,
                scrollElementTo = document.querySelector(scrollHash);
        scrollTo(scrollElementTo);
    });
});


//скролл к следующей секции по кнопке вниз

const scrollNext = document.querySelectorAll('[data-scroll-next]'); // АТРИБУТЫ У ТРИГГЕРОВ!!!!
const sections = document.querySelectorAll('.page-section'); // секции
scrollNext.forEach(item => {
    item.addEventListener('click', (e) => {
        event.preventDefault();
        const   closestSection = e.target.closest('.page-section'), // поиск ближайшей секции с id-указателем
                thisSectionId = closestSection.id;

        function searchNextSection() {
            for (let i = 0; i < sections.length; i++) {
                if (sections[i].id == thisSectionId) {
                    const nextSection = document.querySelector('#' + sections[i + 1].id);
                    return nextSection;
                }
            }
        }
        scrollTo(searchNextSection());
    });
});