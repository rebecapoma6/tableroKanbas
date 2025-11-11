let tarjetaArrastrando = null;

function anadirTarjeta(container) {
    if (container.querySelector('.tarjetaDEdicion')) return;//evitaremos crear mas de una tarjeta editable a la vez 

    //paso 1 creamos nuestro article
    const articleElemente = document.createElement('article');
    articleElemente.classList.add('CardKanba', 'tarjetaDEdicion');

    //paso 2 creamos nuestros parrafos
    const parrafoElement = document.createElement('p');
    parrafoElement.classList.add('editable');        
    parrafoElement.setAttribute('data-placeholder', 'Nueva Tarjeta');
    parrafoElement.setAttribute('contenteditable', 'true');
    
    articleElemente.appendChild(parrafoElement);
    container.appendChild(articleElemente);

    parrafoElement.focus();


    const divBotones = document.createElement('div');
    divBotones.classList.add('botones-AddyCancel');

    const btnAnadirTarjeta = document.createElement('button');
    btnAnadirTarjeta.textContent = 'Añadir Tarjeta';
    btnAnadirTarjeta.classList.add('btn-add');
    
    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = '✖️';
    btnCancelar.setAttribute('aria-label', 'Cancelar tarjeta');
    btnCancelar.classList.add('btn-cancel');


    
    divBotones.appendChild(btnAnadirTarjeta);
    divBotones.appendChild(btnCancelar);
    container.appendChild(divBotones);
    articleElemente.setAttribute('draggable', 'true');


 


  //Empezamos con los eventos ////////////

    btnAnadirTarjeta.addEventListener('click',() => {
        const txtTarjtaNva = parrafoElement.textContent.trim();
        if(txtTarjtaNva === ''){alert('La tarjeta NO puede estar vacía.');return}
        articleElemente.classList.remove('tarjetaDEdicion');
        //parrafoElement.removeAttribute('contenteditable'); comente esto porq hacia que las tarejtas nuevas no sean editables
        divBotones.remove();


        const btnEliminarTarjeta = document.createElement('button');
        btnEliminarTarjeta.textContent = '🗑️';
        btnEliminarTarjeta.classList.add('delete-btn');
        btnEliminarTarjeta.addEventListener('click',() => articleElemente.remove());

        articleElemente.appendChild(btnEliminarTarjeta);
    });

    
    //nuestro boton para cancelar si ya no quiero crear la tarjeta
    btnCancelar.addEventListener('click', () =>{
        articleElemente.remove();
        divBotones.remove();
    });

    //uso esto mejor para saber si pierdo el foco en caso este vacio o SI le doy a cancelar
    parrafoElement.addEventListener('focusout', () =>{
        if(!parrafoElement.textContent.trim()){
            articleElemente.remove();
            divBotones.remove();
        }
    });
}

// Dragstart: cuando empiezo a arrastrar
document.addEventListener('dragstart', eventArraste => {
    const tarjetaKanba = eventArraste.target.closest('.CardKanba');
    if (!tarjetaKanba) return;
    tarjetaArrastrando = tarjetaKanba;
    eventArraste.dataTransfer.effectAllowed = 'move';
});

// Dragover: cuando paso por encima de una columna
document.querySelectorAll('.kanban-cards').forEach(columKanba => {
    columKanba.addEventListener('dragover', evntEncima => {
        evntEncima.preventDefault(); // necesario para poder soltar
        //columKanba.classList.add('resaltada'); // opcional: estilo visual
    });

    columKanba.addEventListener('dragleave', e => {
        columKanba.classList.remove('resaltada');
    });

    // Drop: soltar la tarjeta
    columKanba.addEventListener('drop', eventSoltar => {
        eventSoltar.preventDefault();
        columKanba.classList.remove('resaltada');
        if (!tarjetaArrastrando) return;

        // Insertar tarjeta al final
        columKanba.appendChild(tarjetaArrastrando);
        tarjetaArrastrando = null;
    });
});


////////////Añadimos las card///////////////
document.querySelectorAll('.add-btn').forEach(btnAnadir => {
    btnAnadir.addEventListener('click', () => {
        const columKanba = btnAnadir.closest('.kanban-column');
        const kanbaContainer = columKanba.querySelector('.kanban-cards');
        anadirTarjeta(kanbaContainer);
    });
});

////////////Eliminamos ///////////////
document.querySelectorAll('.kanban-cards').forEach(columna => {
  columna.addEventListener('click', e => {
    if (e.target.matches('.delete-btn')) {
      const tarjeta = e.target.closest('article');
      if (tarjeta) tarjeta.remove();
    }
  });
});








