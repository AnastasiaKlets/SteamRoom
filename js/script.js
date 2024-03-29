function slider({container, wrapper, field, slide, indicatorsSelector, elementsPerPage = 1, elementsPerPageMobile = 1, duration = 0, rowGap = 0}) {
    let slideIndex = 1,
        offset = 0,
        mobile = false,
        timer = 0,
        perPage = 1,
        templates = [],
        dots = [];
    const slider = document.querySelector(container),
        slidesWrapper = document.querySelector(wrapper),
        slidesField = document.querySelector(field),
        mediaQuery = window.matchMedia('(max-width: 768px)');

    if (mediaQuery.matches) {
        mobile = true;
        perPage = elementsPerPageMobile;
    } else {
        perPage = elementsPerPage;
    }

    let width = deleteNotDigits(window.getComputedStyle(slidesWrapper).width) / perPage + 'px';

    let indicators = document.createElement('ol');
    indicators.classList.add(indicatorsSelector);
    slider.append(indicators);

    let slides = document.querySelectorAll(slide);
    let baseSlides = slides;
    slidesField.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";  

    slides.forEach((slide, index) => {
        slide.style.width = width;
        if (index != 0) {
            slide.style.paddingLeft = rowGap + 'px';
        }
        templates[index] = slide;
    });

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        mobile ? dot.style.width = 100 / slides.length + "%" : dot.style.width = '';
        if (i == 0) {
            dot.classList.add('active');
        } 
        indicators.append(dot);
        dots.push(dot);
    }
    dots = document.querySelectorAll('.dot')

    for (let i = 0; i < (perPage - 1); i++) {
        slidesField.append(templates[i + 1].cloneNode(true));
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo;
            offset = deleteNotDigits(width) * (slideTo - 1);
            makeTimer(duration);
            changeActivity();
        });
    });

    window.addEventListener('resize', (e) => {
        if (mediaQuery.matches) {
            mobile = true;
            perPage = elementsPerPageMobile;
        } else {
            mobile = false;
            perPage = elementsPerPage;
        }
        
        width = deleteNotDigits(window.getComputedStyle(slidesWrapper).width) / perPage + 'px';
        
        while (slidesField.childElementCount > baseSlides.length) {
            slidesField.removeChild(slidesField.lastElementChild)
        }
        for (let i = 0; i < (perPage - 1); i++) {
            slidesField.append(templates[i + 1].cloneNode(true));
        }

        slidesField.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";  
        
        dots.forEach((dot) => {
            mobile ? dot.style.width = 100 / slides.length + "%" : dot.style.width = '';
        });
        
        let slidesNew = document.querySelectorAll(slide);
        slidesNew.forEach((slide, index) => {
            slide.style.width = width;
            if (index != 0) {
                slide.style.paddingLeft = rowGap + 'px';
            }
        });
        
        slideIndex = 1,
        offset = 0,
        changeActivity();
    }); 

    makeTimer(duration);

    function changeActivity() {
        slidesField.style.transform = `translateX(-${offset}px)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[slideIndex-1].classList.add('active');
    }

    function makeTimer(duration){
        if (duration == 0) {
            return;
        }
        clearInterval(timer)
        timer = setInterval(function(){
            if (offset == deleteNotDigits(width) * (slides.length - 1)) {
                offset = 0;
            } else {
                offset += deleteNotDigits(width);
            }
    
            if (slideIndex == slides.length) {
                slideIndex = 1;
            } else {
                slideIndex++;
            }
    
            changeActivity();
        },duration);
    }

    function deleteNotDigits(str) {
        return +str.replace(/[^\d\.]/g, '');
    }
}

function openModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function modal(triggerSelector, closeSelector, modalSelector) {
    const modalTrigger = document.querySelectorAll(triggerSelector),
        modal = document.querySelector(modalSelector);
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector));
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute(closeSelector) == '') {
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) { 
            closeModal(modalSelector);
        }
    });
}

slider({
    container: '.gallery_slider',
    wrapper: '.gallery_slider_wrapper',
    field: '.gallery_slider_inner',
    slide: '.gallery_slide',
    indicatorsSelector: 'gallery_slider_indicators',
    nextArrow: '.gallery_slider_next',
    prevArrow: '.gallery_slider_prev',
    elementsPerPage: 4,
    elementsPerPageMobile: 1.45,
    duration: 5000,
    rowGap: 15
});

modal('[data-modal]', 'data-close', '.consult');
