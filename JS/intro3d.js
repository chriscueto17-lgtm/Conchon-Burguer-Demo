
(() => {
  'use strict';

  // ==========================================
  // CONCHON BURGUER - VIDEO DE INTRODUCCIÓN
  // ==========================================

  const VIDEO_URL = 'Videos/intro-conchon.mp4';
  const MENU_URL = 'paginas/principal.html';

  const btn = document.getElementById('btnEntrar');

  // Evita registrar el evento más de una vez.
  if (!btn || btn.dataset.videoIntroBound === '1') return;
  btn.dataset.videoIntroBound = '1';

  let reproduciendo = false;

  // Ir al menú.
  function irAlMenu() {
    window.location.href = MENU_URL;
  }

  // Crear y reproducir la introducción.
  function iniciarVideo(evento) {
    evento.preventDefault();
    evento.stopPropagation();
    evento.stopImmediatePropagation();

    if (reproduciendo) return;
    reproduciendo = true;

    // Fondo de la reproducción.
    const intro = document.createElement('div');
    intro.id = 'videoIntroConchon';

    intro.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: #000;
      opacity: 0;
      transition: opacity .35s ease;
    `;

    // Video de Runway.
    const video = document.createElement('video');
    video.src = VIDEO_URL;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.controls = false;
    video.disablePictureInPicture = true;

    video.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #000;
    `;

    // Botón para saltar la animación.
    const saltar = document.createElement('button');
    saltar.type = 'button';
    saltar.textContent = 'SALTAR ↗';

    saltar.style.cssText = `
      position: absolute;
      top: 22px;
      right: 24px;
      z-index: 10;
      padding: 12px 20px;
      border: 1px solid #ff1737;
      border-radius: 30px;
      color: #fff;
      background: rgba(8, 8, 8, .85);
      font-family: Arial, sans-serif;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 1px;
      cursor: pointer;
      transition: background .2s ease, transform .2s ease;
    `;

    saltar.addEventListener('mouseenter', () => {
      saltar.style.background = '#ed1032';
      saltar.style.transform = 'scale(1.05)';
    });

    saltar.addEventListener('mouseleave', () => {
      saltar.style.background = 'rgba(8, 8, 8, .85)';
      saltar.style.transform = 'scale(1)';
    });

    // Mostrar el menú si termina o se omite el video.
    let terminado = false;

    function finalizar() {
      if (terminado) return;
      terminado = true;
      video.pause();
      irAlMenu();
    }

    saltar.addEventListener('click', finalizar);
    video.addEventListener('ended', finalizar);

    // Si el archivo no existe o no se puede reproducir.
    video.addEventListener('error', () => {
      if (terminado) return;

      terminado = true;
      intro.remove();
      reproduciendo = false;

      alert(
        'No se pudo cargar el video. Revisa que exista ' +
        'Videos/intro-conchon.mp4 y vuelve a intentarlo.'
      );
    });

    // Añadir elementos a la pantalla.
    intro.appendChild(video);
    intro.appendChild(saltar);
    document.body.appendChild(intro);

    // Mostrar el video.
    requestAnimationFrame(() => {
      intro.style.opacity = '1';
    });

    // Reproducir después del clic del usuario.
    video.play().catch(() => {
      if (terminado) return;

      intro.remove();
      reproduciendo = false;

      alert(
        'No se pudo iniciar el video. Comprueba el archivo MP4 ' +
        'y vuelve a pulsar ENTRAR.'
      );
    });
  }

  // Capturar el clic antes que el script original de la portada.
  btn.addEventListener('click', iniciarVideo, true);

})();
