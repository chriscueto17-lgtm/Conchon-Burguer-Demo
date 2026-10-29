
(function () {
    "use strict";

    // ==========================================
    // CONCHON BURGUER - INTRODUCCION 3D
    // ==========================================

    const CONFIG = {
        destino: "paginas/principal.html",
        colorRojo: 0xe4002b,
        duracion: 5.5,
        mostrarSaltar: true
    };

    const boton = document.getElementById("btnEntrar");

    // Si falta el boton o Three.js, no interrumpimos
    // el funcionamiento normal de la pagina.
    if (!boton || typeof THREE === "undefined") {
        console.warn(
            "Intro 3D: falta btnEntrar o la libreria Three.js."
        );
        return;
    }

    // Respetar la preferencia de reducir animaciones.
    if (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return;
    }

    // Evitar ejecutar dos veces la animacion.
    let iniciada = false;
    let terminado = false;
    let animacionId = 0;

    function limitar(valor, minimo, maximo) {
        return Math.max(minimo, Math.min(maximo, valor));
    }

    function interpolar(inicio, fin, progreso) {
        return inicio + (fin - inicio) * progreso;
    }

    function progresoTiempo(t, inicio, fin) {
        return limitar((t - inicio) / (fin - inicio), 0, 1);
    }

    function suavizar(x) {
        return x * x * (3 - 2 * x);
    }

    function irAlMenu() {
        if (terminado) return;

        terminado = true;

        window.location.href = CONFIG.destino;
    }

    
    // ==========================================
    // PARTE 2: ESCENA, LUCES, CAJA Y HAMBURGUESA
    // ==========================================

    let escena;
    let camara;
    let renderer;
    let overlay;
    let flash;
    let caja;
    let tapa;
    let burger;
    let capas = [];
    let chispas;
    let posicionesChispas;
    let velocidadesChispas = [];

    function crearMaterial(color, rugosidad = 0.65) {
        return new THREE.MeshStandardMaterial({
            color: color,
            roughness: rugosidad,
            metalness: 0.02
        });
    }

    function crearPieza(
        ancho, alto, fondo,
        x, y, z, material, padre
    ) {
        const geometria = new THREE.BoxGeometry(
            ancho, alto, fondo
        );

        const malla = new THREE.Mesh(
            geometria, material
        );

        malla.position.set(x, y, z);

        // Bordes rojos de la caja.
        const bordes = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometria),
            new THREE.LineBasicMaterial({
                color: CONFIG.colorRojo
            })
        );

        malla.add(bordes);
        padre.add(malla);

        return malla;
    }

    function agregarCapa(objeto, altura) {
        objeto.position.y = altura;
        burger.add(objeto);

        capas.push({
            objeto: objeto,
            altura: altura,
            x: objeto.position.x,
            z: objeto.position.z,
            rotacionX: objeto.rotation.x,
            rotacionZ: objeto.rotation.z
        });
    }

    function crearEscena() {
        // Fondo cinematográfico.
        overlay = document.createElement("div");
        overlay.id = "conchonIntro3D";

        Object.assign(overlay.style, {
            position: "fixed",
            inset: "0",
            zIndex: "99999",
            background:
                "radial-gradient(circle at 50% 40%, #351016, #100407 65%, #020202)",
            opacity: "0",
            transition: "opacity 0.5s ease",
            overflow: "hidden"
        });

        document.body.appendChild(overlay);

        // Destello rojo de la transición final.
        flash = document.createElement("div");

        Object.assign(flash.style, {
            position: "absolute",
            inset: "0",
            background: "#e4002b",
            opacity: "0",
            pointerEvents: "none"
        });

        overlay.appendChild(flash);

        // Escena y cámara.
        escena = new THREE.Scene();

        camara = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        camara.position.set(0, 2.4, 8);
        camara.lookAt(0, 0.4, 0);

        // Renderizador 3D.
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, 2)
        );

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.outputColorSpace = THREE.SRGBColorSpace;

        overlay.appendChild(renderer.domElement);

        // Luces ambientales y rojas.
        escena.add(
            new THREE.AmbientLight(0xffffff, 1.4)
        );

        const luzPrincipal = new THREE.DirectionalLight(
            0xffffff, 2.5
        );

        luzPrincipal.position.set(-3, 6, 5);
        escena.add(luzPrincipal);

        const luzRoja = new THREE.PointLight(
            CONFIG.colorRojo, 35, 20
        );

        luzRoja.position.set(-3, 2, 3);
        escena.add(luzRoja);

        const luzCalida = new THREE.PointLight(
            0xffc078, 22, 18
        );

        luzCalida.position.set(3, 4, 2);
        escena.add(luzCalida);

        // ======================================
        // CAJA PERSONALIZADA NEGRA Y ROJA
        // ======================================

        caja = new THREE.Group();
        caja.position.y = -1;
        escena.add(caja);

        const negro = crearMaterial(0x111111, 0.45);
        const rojo = crearMaterial(CONFIG.colorRojo, 0.4);

        // Base.
        crearPieza(
            3.4, 0.14, 3.1,
            0, -0.65, 0, negro, caja
        );

        // Paredes.
        crearPieza(
            3.4, 1.35, 0.12,
            0, 0, 1.5, negro, caja
        );

        crearPieza(
            3.4, 1.35, 0.12,
            0, 0, -1.5, negro, caja
        );

        crearPieza(
            0.12, 1.35, 2.9,
            1.65, 0, 0, negro, caja
        );

        crearPieza(
            0.12, 1.35, 2.9,
            -1.65, 0, 0, negro, caja
        );

        // Banda roja del frente.
        crearPieza(
            2.1, 0.2, 0.025,
            0, 0.15, 1.565, rojo, caja
        );

        // Tapa con bisagra.
        tapa = new THREE.Group();
        tapa.position.set(0, 0.68, -1.5);
        caja.add(tapa);

        crearPieza(
            3.4, 0.12, 3.1,
            0, 0, 1.5, negro, tapa
        );

        // ======================================
        // HAMBURGUESA 3D
        // ======================================

        burger = new THREE.Group();
        caja.add(burger);

        // Pan inferior.
        agregarCapa(
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.92, 0.85, 0.28, 48
                ),
                crearMaterial(0xd99038)
            ),
            -0.43
        );

        // Carne.
        agregarCapa(
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.98, 0.98, 0.25, 48
                ),
                crearMaterial(0x542819, 0.9)
            ),
            -0.17
        );

        // Queso.
        const queso = new THREE.Mesh(
            new THREE.BoxGeometry(2.05, 0.07, 2.05),
            crearMaterial(0xffbd25, 0.45)
        );

        queso.rotation.y = Math.PI / 4;
        agregarCapa(queso, 0.02);

        // Tomate.
        agregarCapa(
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.87, 0.87, 0.12, 40
                ),
                crearMaterial(0xd72b20)
            ),
            0.13
        );

        // Lechuga.
        const lechuga = new THREE.Mesh(
            new THREE.TorusGeometry(
                0.78, 0.14, 12, 48
            ),
            crearMaterial(0x45a83c)
        );

        lechuga.rotation.x = Math.PI / 2;
        lechuga.scale.set(1.15, 1.15, 1);
        agregarCapa(lechuga, 0.25);

        // Pan superior redondeado.
        const panSuperior = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.94, 40, 24, 0,
                Math.PI * 2, 0, Math.PI / 2
            ),
            crearMaterial(0xe5a044)
        );

        panSuperior.scale.y = 0.8;
        agregarCapa(panSuperior, 0.43);

        // Semillas visibles en el pan.
        const materialSemillas = crearMaterial(0xfff0c4);
        const geometriaSemilla = new THREE.SphereGeometry(
            0.045, 8, 6
        );

        for (let i = 0; i < 18; i++) {
            const semilla = new THREE.Mesh(
                geometriaSemilla,
                materialSemillas
            );

            const angulo = Math.random() * Math.PI * 2;
            const radio = 0.25 + Math.random() * 0.58;

            semilla.position.set(
                Math.cos(angulo) * radio,
                0.43 + Math.sqrt(
                    Math.max(0, 1 - radio * radio)
                ) * 0.68,
                Math.sin(angulo) * radio
            );

            burger.add(semilla);
        }

        // ======================================
        // PARTÍCULAS ROJAS
        // ======================================

        const cantidad = 180;

        posicionesChispas = new Float32Array(
            cantidad * 3
        );

        for (let i = 0; i < cantidad; i++) {
            posicionesChispas[i * 3] =
                (Math.random() - 0.5) * 10;

            posicionesChispas[i * 3 + 1] =
                (Math.random() - 0.5) * 7;

            posicionesChispas[i * 3 + 2] =
                (Math.random() - 0.5) * 5;

            velocidadesChispas[i] =
                0.2 + Math.random() * 0.5;
        }

        const geometriaChispas = new THREE.BufferGeometry();

        geometriaChispas.setAttribute(
            "position",
            new THREE.BufferAttribute(posicionesChispas, 3)
        );

        chispas = new THREE.Points(
            geometriaChispas,
            new THREE.PointsMaterial({
                color: 0xff334d,
                size: 0.055,
                transparent: true,
                opacity: 0.85,
                depthWrite: false
            })
        );

        escena.add(chispas);

        // Mostrar la intro.
        requestAnimationFrame(() => {
            overlay.style.opacity = "1";
        });
    }

    // ==========================================
    // PARTE 3: ANIMACION CINEMATOGRAFICA
    // ==========================================

    function animar(ahora) {
        if (terminado) return;

        if (typeof animar.inicio === "undefined") {
            animar.inicio = ahora;
        }

        const t = (ahora - animar.inicio) / 1000;
        const dt = Math.min(
            (ahora - (animar.anterior || ahora)) / 1000,
            0.05
        );

        animar.anterior = ahora;

        // Fases de la animacion.
        const subida = suavizar(
            progresoTiempo(t, 0, 1)
        );

        const separacion =
            suavizar(progresoTiempo(t, 1, 2.1)) *
            (1 - suavizar(progresoTiempo(t, 2.7, 3.5)));

        const regreso = suavizar(
            progresoTiempo(t, 3, 4)
        );

        const cierre = suavizar(
            progresoTiempo(t, 4, 4.6)
        );

        const acercamiento = suavizar(
            progresoTiempo(t, 4.6, CONFIG.duracion)
        );

        // La hamburguesa sale de la caja.
        burger.position.y = interpolar(
            -0.15,
            1.15,
            subida
        );

        burger.scale.setScalar(
            interpolar(0.75, 1, subida)
        );

        burger.rotation.y += dt * 0.7;

        // Los ingredientes se separan y flotan.
        capas.forEach(function (capa, i) {
            const direccion = i % 2 === 0 ? 1 : -1;

            const distancia = separacion * (0.5 + i * 0.09);

            capa.objeto.position.y =
                capa.altura +
                subida * 0.4 +
                distancia * (i + 1) * 0.35 -
                regreso * distancia * (i + 1) * 0.35;

            capa.objeto.position.x =
                capa.x +
                direccion * separacion * (0.3 + i * 0.12);

            capa.objeto.position.z =
                capa.z +
                Math.sin(t * 3 + i) * separacion * 0.25;

            capa.objeto.rotation.z =
                capa.rotacionZ +
                Math.sin(t * 2 + i) * separacion * 0.25;
        });

        // La tapa se abre y luego se cierra.
        tapa.rotation.x = interpolar(
            0,
            -1.9,
            suavizar(progresoTiempo(t, 0, 0.8))
        );

        tapa.rotation.x = interpolar(
            tapa.rotation.x,
            0,
            cierre
        );

        // La caja gira y se acerca al espectador.
        caja.rotation.y = acercamiento * Math.PI * 1.5;
        caja.rotation.x = acercamiento * 0.25;

        caja.position.z = acercamiento * 4;
        caja.position.y = -1 - acercamiento * 0.3;

        const escalaCaja = 1 + acercamiento * 0.35;
        caja.scale.setScalar(escalaCaja);

        // Las partículas rojas suben continuamente.
        const posiciones =
            chispas.geometry.attributes.position.array;

        for (let i = 0; i < velocidadesChispas.length; i++) {
            posiciones[i * 3 + 1] +=
                dt * velocidadesChispas[i];

            if (posiciones[i * 3 + 1] > 3.5) {
                posiciones[i * 3 + 1] = -3.5;
            }
        }

        chispas.geometry.attributes.position.needsUpdate = true;

        // Destello final.
        flash.style.opacity = String(
            progresoTiempo(t, 5, CONFIG.duracion)
        );

        // Renderizar cada fotograma.
        renderer.render(escena, camara);

        // Terminar y abrir el menú.
        if (t >= CONFIG.duracion) {
            irAlMenu();
            return;
        }

        animacionId = requestAnimationFrame(animar);
    }

    // Ajustar la escena al cambiar el tamaño de la ventana.
    function ajustarPantalla() {
        if (!renderer || !camara) return;

        camara.aspect =
            window.innerWidth / window.innerHeight;

        camara.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }

    // ==========================================
    // PARTE 4: BOTON ENTRAR, SALTAR Y ARRANQUE
    // ==========================================

    // Boton para omitir la animacion.
    function crearBotonSaltar() {
        if (!CONFIG.mostrarSaltar) return;

        const saltar = document.createElement("button");

        saltar.type = "button";
        saltar.textContent = "SALTAR  »";

        Object.assign(saltar.style, {
            position: "absolute",
            right: "24px",
            bottom: "24px",
            zIndex: "2",
            padding: "12px 20px",
            color: "#ffffff",
            background: "rgba(0,0,0,0.75)",
            border: "1px solid #e4002b",
            borderRadius: "6px",
            fontWeight: "bold",
            letterSpacing: "2px",
            cursor: "pointer"
        });

        saltar.addEventListener("click", function () {
            if (terminado) return;

            cancelAnimationFrame(animacionId);
            irAlMenu();
        });

        overlay.appendChild(saltar);
    }

    // Liberar recursos si ocurre un error.
    function limpiarEscena() {
        cancelAnimationFrame(animacionId);

        window.removeEventListener(
            "resize",
            ajustarPantalla
        );

        if (renderer) {
            renderer.dispose();
        }

        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }

    // Conectar el boton original de la portada.
    boton.addEventListener("click", function (evento) {
        if (iniciada || terminado) {
            evento.preventDefault();
            evento.stopImmediatePropagation();
            return;
        }

        evento.preventDefault();
        evento.stopImmediatePropagation();

        iniciada = true;

        try {
            crearEscena();
            crearBotonSaltar();

            window.addEventListener(
                "resize",
                ajustarPantalla
            );

            animacionId = requestAnimationFrame(animar);

        } catch (error) {
            console.error(
                "Error en la intro 3D de Conchon Burguer:",
                error
            );

            limpiarEscena();

            // Si falla el 3D, continuar al menu.
            irAlMenu();
        }
    });

})();

