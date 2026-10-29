/* =====================================================
   ENTRAR DESDE INDEX
   ===================================================== */

const btnEntrar =
    document.getElementById("btnEntrar");


if (btnEntrar) {

    btnEntrar.addEventListener(
        "click",
        function () {

            document.body.style.transition =
                "opacity .2s ease";

            document.body.style.opacity =
                "0";


            setTimeout(
                function () {

                    window.location.href =
                        "paginas/principal.html";

                },
                200
            );

        }
    );

}


/* =====================================================
   VOLVER AL INICIO
   ===================================================== */

const volverInicio =
    document.querySelector(
        ".volver-inicio"
    );


if (volverInicio) {

    volverInicio.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            const destino =
                volverInicio.getAttribute(
                    "href"
                );


            document.body.style.transition =
                "opacity .2s ease";

            document.body.style.opacity =
                "0";


            setTimeout(
                function () {

                    window.location.href =
                        destino;

                },
                200
            );

        }
    );

}


/* =====================================================
   VARIABLES DEL CARRITO
   ===================================================== */

let carrito = [];


const contador =
    document.querySelector(
        ".contador"
    );


const carritoIcono =
    document.querySelector(
        ".carrito"
    );


const carritoFondo =
    document.getElementById(
        "carritoFondo"
    );


const cerrarCarrito =
    document.getElementById(
        "cerrarCarrito"
    );


const listaCarrito =
    document.getElementById(
        "listaCarrito"
    );


const totalCarrito =
    document.getElementById(
        "totalCarrito"
    );


const finalizarCompra =
    document.getElementById(
        "finalizarCompra"
    );


/* =====================================================
   DETALLE
   ===================================================== */

const detalleFondo =
    document.getElementById(
        "detalleFondo"
    );


const cerrarDetalle =
    document.getElementById(
        "cerrarDetalle"
    );


const detalleImagen =
    document.getElementById(
        "detalleImagen"
    );


const detalleNombre =
    document.getElementById(
        "detalleNombre"
    );


const detalleDescripcion =
    document.getElementById(
        "detalleDescripcion"
    );


const detallePrecio =
    document.getElementById(
        "detallePrecio"
    );


const cantidadDetalle =
    document.getElementById(
        "cantidadDetalle"
    );


const sumarDetalle =
    document.getElementById(
        "sumarDetalle"
    );


const restarDetalle =
    document.getElementById(
        "restarDetalle"
    );


const agregarDetalle =
    document.getElementById(
        "agregarDetalle"
    );


/* =====================================================
   VARIABLES DEL PRODUCTO
   ===================================================== */

let productoDetalle = null;


let cantidadProducto = 1;


let precioBase = 0;


let extraTamanio = 0;


let nombreTamanio = "Regular";


let extraBebida = 0;


let nombreBebida = "Sin bebida";


let salsasSeleccionadas = [];


/* =====================================================
   AGREGAR PRODUCTO AL CARRITO
   ===================================================== */

function agregarProductoCarrito(

    nombre,
    precio,
    imagen,
    cantidad,
    tamanio,
    bebida,
    salsas

) {

    const existente =
        carrito.find(
            function (producto) {

                return (

                    producto.nombre === nombre &&

                    producto.tamanio === tamanio &&

                    producto.bebida === bebida &&

                    JSON.stringify(
                        producto.salsas
                    ) ===

                    JSON.stringify(
                        salsas
                    )

                );

            }
        );


    if (existente) {

        existente.cantidad += cantidad;

        // Actualizar la imagen si el producto
        // ya estaba guardado sin imagen
        if (imagen) {
            existente.imagen = imagen;
        }

    } else {

        carrito.push({

            nombre: nombre,

            precio: precio,

            imagen: imagen,

            cantidad: cantidad,

            tamanio: tamanio,

            bebida: bebida,

            salsas: [...salsas]

        });

    }


    actualizarCarrito();

}

/* =====================================================
   ACTUALIZAR CARRITO
   ===================================================== */

function actualizarCarrito() {


    let cantidadTotal = 0;

    let precioTotal = 0;


    carrito.forEach(
        function (producto) {

            cantidadTotal +=
                producto.cantidad;


            precioTotal +=

                producto.precio *
                producto.cantidad;

        }
    );


    if (contador) {

        contador.textContent =
            cantidadTotal;

    }


    if (totalCarrito) {

        totalCarrito.textContent =

            "S/ " +
            precioTotal.toFixed(2);

    }


    if (!listaCarrito) {
        return;
    }


    if (carrito.length === 0) {

        listaCarrito.innerHTML = `

            <div class="carrito-vacio">

                <div class="icono-vacio">
                    🛒
                </div>

                <h3>
                    Tu carrito está vacío
                </h3>

                <p>
                    Agrega una hamburguesa para comenzar.
                </p>

            </div>

        `;

        return;

    }


    listaCarrito.innerHTML = "";


    carrito.forEach(
        function (
            producto,
            indice
        ) {


            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "producto-carrito";


            const salsasTexto =

                producto.salsas.length > 0

                    ? producto.salsas.join(
                        ", "
                    )

                    : "Ninguna";


            elemento.innerHTML = `

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >


                <div class="info-producto">

                    <h3>
                        ${producto.nombre}
                    </h3>


                    <div class="precio-producto">

                        S/
                        ${producto.precio.toFixed(2)}

                    </div>


                    <p class="detalle-carrito">

                        Tamaño:
                        ${producto.tamanio}

                    </p>


                    <p class="detalle-carrito">

                        Bebida:
                        ${producto.bebida}

                    </p>


                    <p class="detalle-carrito">

                        Salsas:
                        ${salsasTexto}

                    </p>


                    <div class="controles-cantidad">


                        <button
                            onclick="disminuirCantidad(${indice})"
                        >
                            −
                        </button>


                        <span class="cantidad">

                            ${producto.cantidad}

                        </span>


                        <button
                            onclick="aumentarCantidad(${indice})"
                        >
                            +
                        </button>


                    </div>

                </div>


                <button
                    class="eliminar-producto"
                    onclick="eliminarProducto(${indice})"
                >
                    ✕
                </button>

            `;


            listaCarrito.appendChild(
                elemento
            );

        }
    );

}


/* =====================================================
   AUMENTAR CANTIDAD DEL CARRITO
   ===================================================== */

function aumentarCantidad(
    indice
) {

    if (!carrito[indice]) {
        return;
    }


    carrito[indice].cantidad++;


    actualizarCarrito();

}


/* =====================================================
   DISMINUIR CANTIDAD
   ===================================================== */

function disminuirCantidad(
    indice
) {

    if (!carrito[indice]) {
        return;
    }


    carrito[indice].cantidad--;


    if (
        carrito[indice].cantidad <= 0
    ) {

        carrito.splice(
            indice,
            1
        );

    }


    actualizarCarrito();

}


/* =====================================================
   ELIMINAR
   ===================================================== */

function eliminarProducto(
    indice
) {

    if (!carrito[indice]) {
        return;
    }


    carrito.splice(
        indice,
        1
    );


    actualizarCarrito();

}


/* =====================================================
   ABRIR CARRITO
   ===================================================== */

if (
    carritoIcono &&
    carritoFondo
) {

    carritoIcono.addEventListener(
        "click",
        function () {

            carritoFondo.classList.add(
                "abierto"
            );

        }
    );

}


/* =====================================================
   CERRAR CARRITO
   ===================================================== */

if (
    cerrarCarrito &&
    carritoFondo
) {

    cerrarCarrito.addEventListener(
        "click",
        function () {

            carritoFondo.classList.remove(
                "abierto"
            );

        }
    );

}


if (carritoFondo) {

    carritoFondo.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                carritoFondo
            ) {

                carritoFondo.classList.remove(
                    "abierto"
                );

            }

        }
    );

}


/* =====================================================
   FINALIZAR COMPRA
   ===================================================== */

if (finalizarCompra) {

    finalizarCompra.addEventListener(
        "click",
        function () {

            if (carrito.length === 0) {

                alert("Tu carrito está vacío.");
                return;

            }

            abrirCheckout();

        }
    );

}


/* =====================================================
   FAVORITOS
   ===================================================== */

const favoritos =
    document.querySelectorAll(
        ".favorito"
    );


favoritos.forEach(
    function (corazon) {

        corazon.addEventListener(
            "click",
            function (evento) {

                evento.stopPropagation();


                if (
                    corazon.textContent.trim()
                    === "♡"
                ) {

                    corazon.textContent =
                        "♥";

                } else {

                    corazon.textContent =
                        "♡";

                }

            }
        );

    }
);


/* =====================================================
   TARJETAS DE HAMBURGUESAS
   ===================================================== */

const tarjetas =
    document.querySelectorAll(
        ".hamburguesa"
    );


/* =====================================================
   ABRIR DETALLE
   ===================================================== */

function abrirDetalle(
    tarjeta
) {


    if (!tarjeta) {
        return;
    }


    const nombre =
        tarjeta
            .querySelector("h2")
            .textContent
            .trim();


    const descripcion =
        tarjeta
            .querySelector("p")
            .textContent
            .trim();


    const precio =
        parseFloat(

            tarjeta
                .querySelector(".precio")
                .textContent
                .replace("S/", "")
                .trim()

        );


    const imagen =
        tarjeta
            .querySelector("img")
            .getAttribute("src");


    productoDetalle = {

        nombre:
            nombre,

        descripcion:
            descripcion,

        precio:
            precio,

        imagen:
            imagen

    };


    cantidadProducto = 1;


    precioBase =
        precio;


    extraTamanio =
        0;


    nombreTamanio =
        "Regular";


    extraBebida =
        0;


    nombreBebida =
        "Sin bebida";


    salsasSeleccionadas =
        [];


    /* DATOS */

    detalleNombre.textContent =
        nombre;


    detalleDescripcion.textContent =
        descripcion;


    detalleImagen.src =
        imagen;


    cantidadDetalle.textContent =
        "1";


    /* =================================================
       REINICIAR TAMAÑO
       ================================================= */

    document
        .querySelectorAll(
            ".opcion"
        )
        .forEach(
            function (opcion) {

                opcion.classList.remove(
                    "activo"
                );

            }
        );


    const regular =
        document.querySelector(
            '.opcion[data-tamanio="Regular"]'
        );


    if (regular) {

        regular.classList.add(
            "activo"
        );

    }


    /* =================================================
       REINICIAR BEBIDAS
       ================================================= */

    document
        .querySelectorAll(
            ".bebida-opcion"
        )
        .forEach(
            function (bebida) {

                bebida.classList.remove(
                    "activo"
                );

            }
        );


    const sinBebida =
        document.querySelector(
            '.bebida-opcion[data-bebida="Sin bebida"]'
        );


    if (sinBebida) {

        sinBebida.classList.add(
            "activo"
        );

    }


    /* =================================================
       REINICIAR SALSAS
       ================================================= */

    document
        .querySelectorAll(
            ".salsa-opcion"
        )
        .forEach(
            function (salsa) {

                salsa.classList.remove(
                    "activo"
                );

            }
        );


    /* PRECIO */

    actualizarPrecioDetalle();


    /* =================================================
       ABRIR VENTANA
       ================================================= */

    detalleFondo.classList.add(
        "abierto"
    );


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CLICK EN LAS TARJETAS
   ===================================================== */

tarjetas.forEach(
    function (tarjeta) {

        tarjeta.addEventListener(
            "click",
            function (evento) {


                if (
                    evento.target.closest(
                        ".comprar"
                    )
                ) {

                    return;

                }


                if (
                    evento.target.closest(
                        ".favorito"
                    )
                ) {

                    return;

                }


                abrirDetalle(
                    tarjeta
                );

            }
        );

    }
);


/* =====================================================
   BOTONES COMPRAR
   ===================================================== */

const botonesComprar =
    document.querySelectorAll(
        ".comprar"
    );


botonesComprar.forEach(
    function (boton) {

        boton.addEventListener(
            "click",
            function (evento) {

                evento.stopPropagation();


                const tarjeta =
                    boton.closest(
                        ".hamburguesa"
                    );


                abrirDetalle(
                    tarjeta
                );

            }
        );

    }
);


/* =====================================================
   CERRAR DETALLE
   ===================================================== */

function cerrarVentanaDetalle() {

    if (!detalleFondo) {
        return;
    }


    detalleFondo.classList.remove(
        "abierto"
    );


    document.body.style.overflow =
        "";

}


if (cerrarDetalle) {

    cerrarDetalle.addEventListener(
        "click",
        function () {

            cerrarVentanaDetalle();

        }
    );

}


if (detalleFondo) {

    detalleFondo.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                detalleFondo
            ) {

                cerrarVentanaDetalle();

            }

        }
    );

}


/* =====================================================
   TAMAÑO
   ===================================================== */

const opciones =
    document.querySelectorAll(
        ".opcion"
    );


opciones.forEach(
    function (opcion) {

        opcion.addEventListener(
            "click",
            function () {


                opciones.forEach(
                    function (item) {

                        item.classList.remove(
                            "activo"
                        );

                    }
                );


                opcion.classList.add(
                    "activo"
                );


                extraTamanio =
                    parseFloat(
                        opcion.dataset.extra
                    ) || 0;


                nombreTamanio =
                    opcion.dataset.tamanio
                    || "Regular";


                actualizarPrecioDetalle();

            }
        );

    }
);


/* =====================================================
   BEBIDAS
   ===================================================== */

const bebidasOpciones =
    document.querySelectorAll(
        ".bebida-opcion"
    );


bebidasOpciones.forEach(
    function (bebida) {

        bebida.addEventListener(
            "click",
            function () {


                bebidasOpciones.forEach(
                    function (item) {

                        item.classList.remove(
                            "activo"
                        );

                    }
                );


                bebida.classList.add(
                    "activo"
                );


                extraBebida =
                    parseFloat(
                        bebida.dataset.extraBebida
                    ) || 0;


                nombreBebida =
                    bebida.dataset.bebida;


                actualizarPrecioDetalle();

            }
        );

    }
);


/* =====================================================
   SALSAS
   ===================================================== */

const salsasOpciones =
    document.querySelectorAll(
        ".salsa-opcion"
    );


salsasOpciones.forEach(
    function (salsa) {

        salsa.addEventListener(
            "click",
            function () {


                const nombreSalsa =
                    salsa.dataset.salsa;


                if (
                    salsa.classList.contains(
                        "activo"
                    )
                ) {


                    salsa.classList.remove(
                        "activo"
                    );


                    salsasSeleccionadas =
                        salsasSeleccionadas.filter(
                            function (item) {

                                return (
                                    item !==
                                    nombreSalsa
                                );

                            }
                        );


                } else {


                    salsa.classList.add(
                        "activo"
                    );


                    salsasSeleccionadas.push(
                        nombreSalsa
                    );

                }

            }
        );

    }
);


/* =====================================================
   ACTUALIZAR PRECIO DEL DETALLE
   ===================================================== */

function actualizarPrecioDetalle() {

    if (!detallePrecio) {
        return;
    }


    const precioUnitario =

        precioBase +

        extraTamanio +

        extraBebida;


    const total =

        precioUnitario *
        cantidadProducto;


    detallePrecio.textContent =

        "S/ " +
        total.toFixed(2);

}


/* =====================================================
   SUMAR CANTIDAD
   ===================================================== */

if (sumarDetalle) {

    sumarDetalle.addEventListener(
        "click",
        function () {


            cantidadProducto++;


            cantidadDetalle.textContent =
                cantidadProducto;


            actualizarPrecioDetalle();

        }
    );

}


/* =====================================================
   RESTAR CANTIDAD
   ===================================================== */

if (restarDetalle) {

    restarDetalle.addEventListener(
        "click",
        function () {


            if (
                cantidadProducto > 1
            ) {

                cantidadProducto--;


                cantidadDetalle.textContent =
                    cantidadProducto;


                actualizarPrecioDetalle();

            }

        }
    );

}


/* =====================================================
   AGREGAR AL CARRITO
   ===================================================== */

if (agregarDetalle) {

    agregarDetalle.addEventListener(
        "click",
        function () {


            if (!productoDetalle) {
                return;
            }


            const precioUnitario =

                productoDetalle.precio +

                extraTamanio +

                extraBebida;


            agregarProductoCarrito(

                productoDetalle.nombre,

                precioUnitario,

                productoDetalle.imagen,

                cantidadProducto,

                nombreTamanio,

                nombreBebida,

                salsasSeleccionadas

            );


            agregarDetalle.textContent =
                "✓ AGREGADO";


            setTimeout(
                function () {


                    agregarDetalle.textContent =
                        "🛒 AGREGAR AL CARRITO";


                    cerrarVentanaDetalle();


                },
                500
            );

        }
    );

}


/* =====================================================
   BUSCADOR
   ===================================================== */

const btnBuscar =
    document.getElementById(
        "btnBuscar"
    );


const buscador =
    document.getElementById(
        "buscador"
    );


const inputBuscar =
    document.getElementById(
        "inputBuscar"
    );


if (btnBuscar) {

    btnBuscar.addEventListener(
        "click",
        function () {


            if (buscador) {

                buscador.classList.toggle(
                    "visible"
                );

            }


            if (inputBuscar) {

                inputBuscar.focus();

            }

        }
    );

}


if (inputBuscar) {

    inputBuscar.addEventListener(
        "input",
        function () {


            const texto =

                inputBuscar.value
                    .toLowerCase()
                    .trim();


            tarjetas.forEach(
                function (tarjeta) {


                    const nombre =

                        tarjeta
                            .querySelector("h2")
                            .textContent
                            .toLowerCase();


                    if (
                        nombre.includes(
                            texto
                        )
                    ) {

                        tarjeta.style.display =
                            "grid";

                    } else {

                        tarjeta.style.display =
                            "none";

                    }

                }
            );

        }
    );

}


/* =====================================================
   CONTACTO
   ===================================================== */

const btnMensaje =
    document.getElementById(
        "btnMensaje"
    );


if (btnMensaje) {

    btnMensaje.addEventListener(
        "click",
        function () {


            const nombre =
                document.getElementById(
                    "nombreContacto"
                ).value.trim();


            const correo =
                document.getElementById(
                    "correoContacto"
                ).value.trim();


            const mensaje =
                document.getElementById(
                    "mensajeContacto"
                ).value.trim();


            if (

                nombre === "" ||

                correo === "" ||

                mensaje === ""

            ) {

                alert(
                    "Completa todos los campos antes de enviar."
                );

                return;

            }


            alert(

                "¡Gracias " +
                nombre +
                "! 🍔\n\n" +
                "Tu mensaje fue recibido por Conchon Burguer."

            );


            document.getElementById(
                "nombreContacto"
            ).value = "";


            document.getElementById(
                "correoContacto"
            ).value = "";


            document.getElementById(
                "mensajeContacto"
            ).value = "";

        }
    );

}


/* =====================================================
   NAV
   ===================================================== */

const enlaces =
    document.querySelectorAll(
        "nav a"
    );


enlaces.forEach(
    function (enlace) {

        enlace.addEventListener(
            "click",
            function () {


                enlaces.forEach(
                    function (item) {

                        item.classList.remove(
                            "activo"
                        );

                    }
                );


                enlace.classList.add(
                    "activo"
                );

            }
        );

    }
);


/* =====================================================
   INICIAR
   ===================================================== */

actualizarCarrito();

/* =====================================================
   CHECKOUT - PROCESO DE COMPRA
   ===================================================== */

const checkoutFondo = document.getElementById("checkoutFondo");
const cerrarCheckout = document.getElementById("cerrarCheckout");
const checkoutSteps = document.querySelectorAll(".checkout-step");
const checkoutPasos = document.querySelectorAll(".checkout-paso");
const checkoutTotalPago = document.getElementById("checkoutTotalPago");
const resumenCheckout = document.getElementById("resumenCheckout");
const checkoutResultado = document.getElementById("checkoutResultado");
const resultadoIcono = document.getElementById("resultadoIcono");
const resultadoTitulo = document.getElementById("resultadoTitulo");
const resultadoTexto = document.getElementById("resultadoTexto");
const cuentaMensaje = document.getElementById("cuentaMensaje");
const pagoMensaje = document.getElementById("pagoMensaje");
const entregaMensaje = document.getElementById("entregaMensaje");
const volverCuenta = document.getElementById("volverCuenta");
const volverPago = document.getElementById("volverPago");
const volverEntrega = document.getElementById("volverEntrega");
const cerrarResultado = document.getElementById("cerrarResultado");

let checkoutPasoActual = 1;
let usuarioActual = null;
let metodoPagoActual = "tarjeta";
let marcaTarjetaActual = "Visa";
let tipoEntregaActual = "tienda";
let propinaActual = 0;
let qrYapeGenerado = false;
let qrPlinGenerado = false;
let pagoDigitalConfirmado = false;

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("conchonUsuarios") || "[]");
}

function guardarUsuarios(usuarios) {
    localStorage.setItem("conchonUsuarios", JSON.stringify(usuarios));
}

function obtenerSubtotalCheckout() {
    let subtotal = 0;

    carrito.forEach(function (producto) {
        subtotal += producto.precio * producto.cantidad;
    });

    return subtotal;
}

function obtenerDescuentoUsuario() {
    if (!usuarioActual) {
        return 0;
    }

    if (usuarioActual.descuentoDisponible === true) {
        return obtenerSubtotalCheckout() * 0.10;
    }

    return 0;
}

function obtenerCostoDelivery() {
    return tipoEntregaActual === "delivery" ? 5 : 0;
}

function obtenerTotalCheckout() {
    const subtotal = obtenerSubtotalCheckout();
    const descuento = obtenerDescuentoUsuario();
    const delivery = obtenerCostoDelivery();

    return Math.max(0, subtotal - descuento + delivery + propinaActual);
}

function actualizarTotalCheckout() {
    if (checkoutTotalPago) {
        checkoutTotalPago.textContent =
            "S/ " + obtenerTotalCheckout().toFixed(2);
    }
}

function mostrarPasoCheckout(numero) {

    checkoutPasoActual = numero;

    checkoutSteps.forEach(function (paso) {
        paso.classList.remove("activo");
    });

    const pasoActual = document.getElementById("checkoutStep" + numero);

    if (pasoActual) {
        pasoActual.classList.add("activo");
    }

    checkoutPasos.forEach(function (paso) {
        const numeroPaso = parseInt(paso.dataset.step);

        paso.classList.toggle(
            "activo",
            numeroPaso === numero
        );
    });

    if (checkoutResultado) {
        checkoutResultado.classList.remove("activo");
    }

    actualizarTotalCheckout();
}

function abrirCheckout() {

    if (!checkoutFondo) {
        return;
    }

    checkoutFondo.classList.add("abierto");
    document.body.style.overflow = "hidden";

    const usuarioGuardado = localStorage.getItem("conchonUsuarioActual");

    if (usuarioGuardado) {
        try {
            usuarioActual = JSON.parse(usuarioGuardado);
        } catch (error) {
            usuarioActual = null;
        }
    }

    mostrarPasoCheckout(1);
    actualizarTotalCheckout();
}

function cerrarCheckoutVentana() {

    if (!checkoutFondo) {
        return;
    }

    checkoutFondo.classList.remove("abierto");
    document.body.style.overflow = "";
}


function crearCuenta() {
    const nombre = document.getElementById("cuentaNombre").value.trim();
    const correo = document.getElementById("cuentaCorreo").value.trim().toLowerCase();
    const clave = document.getElementById("cuentaClave").value;

    if (!nombre || !correo || !clave) {
        cuentaMensaje.textContent = "Completa todos los campos.";
        cuentaMensaje.className = "checkout-mensaje error";
        return;
    }

    if (!correo.includes("@") || !correo.includes(".")) {
        cuentaMensaje.textContent = "Ingresa un correo válido.";
        cuentaMensaje.className = "checkout-mensaje error";
        return;
    }

    if (clave.length < 6) {
        cuentaMensaje.textContent = "La contraseña debe tener al menos 6 caracteres.";
        cuentaMensaje.className = "checkout-mensaje error";
        return;
    }

    const usuarios = obtenerUsuarios();

    const correoExiste = usuarios.some(function (usuario) {
        return usuario.correo.toLowerCase() === correo;
    });

    if (correoExiste) {
        cuentaMensaje.textContent =
            "Este correo ya tiene una cuenta. Inicia sesión.";
        cuentaMensaje.className = "checkout-mensaje error";
        return;
    }

    const nuevoUsuario = {
        nombre: nombre,
        correo: correo,
        clave: clave,
        compras: 0,
        descuentoDisponible: false
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    // CORRECCIÓN: asignar el usuario que acabamos de crear.
    usuarioActual = nuevoUsuario;

    localStorage.setItem(
        "conchonUsuarioActual",
        JSON.stringify(usuarioActual)
    );

    cuentaMensaje.textContent =
        "Cuenta creada correctamente. ¡Bienvenido " + nombre + "!";

    cuentaMensaje.className = "checkout-mensaje exito";

    setTimeout(function () {
        mostrarPasoCheckout(2);
    }, 500);
}
  

function iniciarSesion() {

    const correo = document.getElementById("loginCorreo").value.trim().toLowerCase();
    const clave = document.getElementById("loginClave").value;

    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(function (item) {
        return item.correo === correo && item.clave === clave;
    });

    if (!usuario) {
        cuentaMensaje.textContent = "Correo o contraseña incorrectos.";
        cuentaMensaje.className = "checkout-mensaje error";
        return;
    }

    usuarioActual = usuario;

    localStorage.setItem(
        "conchonUsuarioActual",
        JSON.stringify(usuarioActual)
    );

    cuentaMensaje.textContent =
        "Sesión iniciada. Bienvenido " + usuario.nombre + "!";
    cuentaMensaje.className = "checkout-mensaje exito";

    setTimeout(function () {
        mostrarPasoCheckout(2);
    }, 500);
}

const crearCuentaCheckout = document.getElementById("crearCuentaCheckout");
const usarCuentaCheckout = document.getElementById("usarCuentaCheckout");
const loginCheckout = document.getElementById("loginCheckout");
const iniciarCuentaCheckout = document.getElementById("iniciarCuentaCheckout");

if (crearCuentaCheckout) {
    crearCuentaCheckout.addEventListener("click", crearCuenta);
}

if (usarCuentaCheckout) {
    usarCuentaCheckout.addEventListener("click", function () {
        loginCheckout.classList.toggle("oculto");
    });
}

if (iniciarCuentaCheckout) {
    iniciarCuentaCheckout.addEventListener("click", iniciarSesion);
}

/* METODOS DE PAGO */

const metodosPago = document.querySelectorAll(".metodo-pago");
const panelesPago = document.querySelectorAll(".pago-panel");

metodosPago.forEach(function (boton) {

    boton.addEventListener("click", function () {

        metodosPago.forEach(function (item) {
            item.classList.remove("activo");
        });

        panelesPago.forEach(function (panel) {
            panel.classList.remove("activo");
        });

        boton.classList.add("activo");
        metodoPagoActual = boton.dataset.pago;

        const panel = document.getElementById(
            "pago" +
            metodoPagoActual.charAt(0).toUpperCase() +
            metodoPagoActual.slice(1)
        );

        if (panel) {
            panel.classList.add("activo");
        }

        pagoDigitalConfirmado = false;
        pagoMensaje.textContent = "";
    });
});

/* MARCA DE TARJETA */

const marcasTarjeta = document.querySelectorAll(".marca-tarjeta");

marcasTarjeta.forEach(function (marca) {

    marca.addEventListener("click", function () {

        marcasTarjeta.forEach(function (item) {
            item.classList.remove("activo");
        });

        marca.classList.add("activo");
        marcaTarjetaActual = marca.dataset.marca;
    });
});

function validarTarjetaDemo() {

    const numero = document.getElementById("numeroTarjetaDemo").value.replace(/\s/g, "");
    const titular = document.getElementById("titularTarjetaDemo").value.trim();
    const vencimiento = document.getElementById("vencimientoTarjetaDemo").value.trim();
    const cvv = document.getElementById("cvvTarjetaDemo").value.trim();
    const saldo = parseFloat(document.getElementById("saldoTarjetaDemo").value);

   if (!numero) {
    pagoMensaje.textContent = "Ingresa un número de tarjeta.";
    pagoMensaje.className = "checkout-mensaje error";
    return false;
}

 if (!vencimiento || !cvv) {
    pagoMensaje.textContent = "Completa los datos de la tarjeta.";
    pagoMensaje.className = "checkout-mensaje error";
    return false;
}

    if (isNaN(saldo) || saldo < 0) {
        pagoMensaje.textContent = "Ingresa un saldo disponible para la DEMO.";
        pagoMensaje.className = "checkout-mensaje error";
        return false;
    }

    if (saldo < obtenerTotalCheckout()) {
        pagoMensaje.textContent =
            "El saldo disponible no alcanza para pagar S/ " +
            obtenerTotalCheckout().toFixed(2) + ".";
        pagoMensaje.className = "checkout-mensaje error";
        return false;
    }

    pagoMensaje.textContent =
        marcaTarjetaActual + " seleccionada. Saldo suficiente para la DEMO.";

    pagoMensaje.className = "checkout-mensaje exito";

   return true;
}
// GENERAR NÚMERO DE TARJETA DEMO
function generarNumeroTarjetaDemo() {

    const campo = document.getElementById("numeroTarjetaDemo");

    if (!campo) {
        return;
    }

    let numero = "";

    for (let i = 0; i < 16; i++) {
        numero += Math.floor(Math.random() * 10);
    }

    campo.value = numero;
}
const generarTarjetaDemo = document.getElementById("generarTarjetaDemo");

if (generarTarjetaDemo) {
    generarTarjetaDemo.addEventListener("click", function () {
        generarNumeroTarjetaDemo();
    });
}   

// FORMATO AUTOMÁTICO DEL VENCIMIENTO
const vencimientoTarjetaDemo =
    document.getElementById("vencimientoTarjetaDemo");

if (vencimientoTarjetaDemo) {

    vencimientoTarjetaDemo.addEventListener("input", function () {

        let valor = this.value
            .replace(/\D/g, "")
            .slice(0, 4);

        if (valor.length > 2) {

            valor =
                valor.slice(0, 2) +
                "/" +
                valor.slice(2);

        }

        this.value = valor;

    });

}


const continuarPago = document.getElementById("continuarPago");

if (continuarPago) {

    continuarPago.addEventListener("click", function () {

        if (metodoPagoActual === "tarjeta") {
            if (!validarTarjetaDemo()) {
                return;
            }
        } else {
            if (!pagoDigitalConfirmado) {
                pagoMensaje.textContent =
                    "Genera el QR y confirma que realizaste el pago.";
                pagoMensaje.className = "checkout-mensaje error";
                return;
            }
        }

        mostrarPasoCheckout(3);
    });
}

/* QR DEMO */

function generarQrDemo(elementoId, tipo) {

    const elemento = document.getElementById(elementoId);

    if (!elemento) {
        return false;
    }

    // Obtener el total actual del pedido
    const monto = obtenerTotalCheckout().toFixed(2);

    // Crear número de pedido DEMO
    const numeroPedido =
        "CB-" + Math.floor(100000 + Math.random() * 900000);

    // Información que tendrá el QR
    const informacionQR =
        "CONCHON BURGUER | " +
        tipo +
        " DEMO | " +
        "PEDIDO: " +
        numeroPedido +
        " | " +
        "MONTO: S/ " +
        monto +
        " | " +
        "NO ES UN PAGO REAL";

    // Limpiar QR anterior

    elemento.innerHTML = "";
    elemento.style.display = "flex";
    elemento.style.flexDirection = "column";
    elemento.style.alignItems = "center";
    elemento.style.justifyContent = "center";
    elemento.style.gap = "8px";

    // Crear QR real y escaneable
    const qr = document.createElement("img");

    qr.src =
        "https://api.qrserver.com/v1/create-qr-code/?" +
        "size=220x220" +
        "&margin=10" +
        "&data=" +
        encodeURIComponent(informacionQR);

    qr.alt = "QR DEMO de " + tipo;

    qr.width = 220;
    qr.height = 220;

    qr.style.display = "block";
    qr.style.margin = "10px auto";
    qr.style.background = "#ffffff";
    qr.style.padding = "8px";
    qr.style.boxSizing = "border-box";

    // Texto debajo del QR
    const texto = document.createElement("small");

    texto.textContent =
        tipo +
        " DEMO | Pedido " +
        numeroPedido +
        " | S/ " +
        monto;

    texto.style.display = "block";
    texto.style.textAlign = "center";

    // Aviso
    const aviso = document.createElement("small");

    aviso.textContent =
        "QR DEMO - No realiza pagos reales.";

    aviso.style.display = "block";
    aviso.style.textAlign = "center";

    // Mostrar todo
    elemento.appendChild(qr);
    elemento.appendChild(texto);
    elemento.appendChild(aviso);

    return true;
}

const generarQrYape = document.getElementById("generarQrYape");
const generarQrPlin = document.getElementById("generarQrPlin");
const confirmarYape = document.getElementById("confirmarYape");
const confirmarPlin = document.getElementById("confirmarPlin");

if (generarQrYape) {
    generarQrYape.addEventListener("click", function () {
        generarQrDemo("qrYape", "YAPE");
        qrYapeGenerado = true;
        pagoMensaje.textContent = "QR DEMO de Yape generado.";
        pagoMensaje.className = "checkout-mensaje exito";
    });
}

if (generarQrPlin) {
    generarQrPlin.addEventListener("click", function () {
        generarQrDemo("qrPlin", "PLIN");
        qrPlinGenerado = true;
        pagoMensaje.textContent = "QR DEMO de Plin generado.";
        pagoMensaje.className = "checkout-mensaje exito";
    });
}

if (confirmarYape) {
    confirmarYape.addEventListener("click", function () {
        if (!qrYapeGenerado) {
            pagoMensaje.textContent = "Primero genera el QR de Yape.";
            pagoMensaje.className = "checkout-mensaje error";
            return;
        }
        pagoDigitalConfirmado = true;
        pagoMensaje.textContent = "Pago de Yape marcado como realizado para la DEMO.";
        pagoMensaje.className = "checkout-mensaje exito";
    });
}

if (confirmarPlin) {
    confirmarPlin.addEventListener("click", function () {
        if (!qrPlinGenerado) {
            pagoMensaje.textContent = "Primero genera el QR de Plin.";
            pagoMensaje.className = "checkout-mensaje error";
            return;
        }
        pagoDigitalConfirmado = true;
        pagoMensaje.textContent = "Pago de Plin marcado como realizado para la DEMO.";
        pagoMensaje.className = "checkout-mensaje exito";
    });
}

/* ENTREGA */

const entregaOpciones = document.querySelectorAll(".entrega-opcion");
const deliveryDatos = document.getElementById("deliveryDatos");
const propinaOpciones = document.querySelectorAll(".propina-opcion");
const propinaOtro = document.getElementById("propinaOtro");

entregaOpciones.forEach(function (opcion) {

    opcion.addEventListener("click", function () {

        entregaOpciones.forEach(function (item) {
            item.classList.remove("activo");
        });

        opcion.classList.add("activo");
        tipoEntregaActual = opcion.dataset.entrega;

        if (tipoEntregaActual === "delivery") {
            deliveryDatos.classList.remove("oculto");
        } else {
            deliveryDatos.classList.add("oculto");
            propinaActual = 0;
        }

        actualizarTotalCheckout();
    });
});

propinaOpciones.forEach(function (opcion) {

    opcion.addEventListener("click", function () {

        propinaOpciones.forEach(function (item) {
            item.classList.remove("activo");
        });

        opcion.classList.add("activo");

        const valor = opcion.dataset.propina;

        if (valor === "otro") {
            propinaOtro.classList.remove("oculto");
            propinaActual = 0;
        } else {
            propinaOtro.classList.add("oculto");
            propinaActual = parseFloat(valor) || 0;
        }

        actualizarTotalCheckout();
    });
});

if (propinaOtro) {
    propinaOtro.addEventListener("input", function () {
        propinaActual = Math.max(0, parseFloat(propinaOtro.value) || 0);
        actualizarTotalCheckout();
    });
}

const continuarEntrega = document.getElementById("continuarEntrega");

if (continuarEntrega) {

    continuarEntrega.addEventListener("click", function () {

        if (tipoEntregaActual === "delivery") {

            const direccion = document.getElementById("direccionDelivery").value.trim();
            const telefono = document.getElementById("telefonoDelivery").value.trim();

            if (!direccion || !telefono) {
                entregaMensaje.textContent = "Completa la dirección y el teléfono para delivery.";
                entregaMensaje.className = "checkout-mensaje error";
                return;
            }
        }

        generarResumenCheckout();
        mostrarPasoCheckout(4);
    });
}

function generarResumenCheckout() {

    const subtotal = obtenerSubtotalCheckout();
    const descuento = obtenerDescuentoUsuario();
    const delivery = obtenerCostoDelivery();
    const total = obtenerTotalCheckout();

    let html = "";

    html += "<div class='resumen-fila'><span>Subtotal</span><strong>S/ " + subtotal.toFixed(2) + "</strong></div>";

    if (descuento > 0) {
        html += "<div class='resumen-fila descuento'><span>Descuento 10%</span><strong>- S/ " + descuento.toFixed(2) + "</strong></div>";
    }

    html += "<div class='resumen-fila'><span>Entrega</span><strong>" + (tipoEntregaActual === "delivery" ? "Delivery S/ 5.00" : "Recoger en tienda") + "</strong></div>";
    html += "<div class='resumen-fila'><span>Propina</span><strong>S/ " + propinaActual.toFixed(2) + "</strong></div>";
    html += "<div class='resumen-fila'><span>Pago</span><strong>" + metodoPagoActual.toUpperCase() + "</strong></div>";
    html += "<div class='resumen-fila total'><span>TOTAL</span><strong>S/ " + total.toFixed(2) + "</strong></div>";

    if (usuarioActual && usuarioActual.descuentoDisponible) {
        html += "<p class='beneficio-resumen'>🎁 Se aplicó tu descuento de cliente frecuente.</p>";
    }

    resumenCheckout.innerHTML = html;
}


/* CONFIRMAR COMPRA */

/* FUNCIÓN PARA MOSTRAR EL RESULTADO */



/* ==========================================
   MOSTRAR RESULTADO DE LA COMPRA
========================================== */

function mostrarResultado(exito, mensaje) {
    if (!checkoutResultado) {
        console.error("No se encontró la pantalla de resultado del checkout.");
        alert(mensaje);
        return;
    }

    if (checkoutSteps) {
        checkoutSteps.forEach(function (paso) {
            paso.classList.remove("activo");
        });
    }

    if (checkoutPasos) {
        checkoutPasos.forEach(function (paso) {
            paso.classList.remove("activo");
        });
    }

    checkoutResultado.classList.add("activo");

    if (resultadoIcono) {
        resultadoIcono.textContent = exito ? "✓" : "!";
        resultadoIcono.className = exito
            ? "resultado-exito"
            : "resultado-error";
    }

    if (resultadoTitulo) {
        resultadoTitulo.textContent = exito
            ? "TU COMPRA FUE UN ÉXITO"
            : "OH OH 😕 ALGO OCURRIÓ";
    }

    if (resultadoTexto) {
        resultadoTexto.textContent = mensaje;
    }
}

/* ==========================================
   CONFIRMAR COMPRA EN MODO DEMO
========================================== */

const confirmarCompra = document.getElementById("confirmarCompra");

if (confirmarCompra) {
    confirmarCompra.addEventListener("click", async function () {

        if (!usuarioActual) {
            mostrarPasoCheckout(1);
            return;
        }

        if (!Array.isArray(carrito) || carrito.length === 0) {
            mostrarResultado(false, "Tu carrito está vacío.");
            return;
        }

        const usuarios = obtenerUsuarios();

        const usuarioGuardado = usuarios.find(function (item) {
            return item.correo === usuarioActual.correo;
        });

        if (!usuarioGuardado) {
            mostrarResultado(
                false,
                "No se encontró tu cuenta. Inicia sesión nuevamente."
            );
            return;
        }

        const boton = this;
        const subtotal = Number(obtenerSubtotalCheckout());
        const total = Number(obtenerTotalCheckout());
        const delivery = tipoEntregaActual === "delivery" ? 5 : 0;
        const propina = Number(propinaActual || 0);

        if (
            !Number.isFinite(subtotal) ||
            !Number.isFinite(total) ||
            subtotal < 0 ||
            total < 0
        ) {
            mostrarResultado(false, "No se pudo calcular el total.");
            return;
        }

        const direccion =
            document.getElementById("direccionDelivery")?.value?.trim() || "";

        if (tipoEntregaActual === "delivery" && !direccion) {
            mostrarResultado(
                false,
                "Ingresa tu dirección para recibir el pedido."
            );
            return;
        }

        const textoOriginal = boton.textContent;

        boton.disabled = true;
        boton.textContent = "CONFIRMANDO COMPRA...";

        try {
            const numeroPedidoDemo = Date.now().toString().slice(-6);

            const datosPedidoDemo = {
                cliente: {
                    nombre: usuarioGuardado.nombre || usuarioGuardado.nombres || "",
                    apellidos: usuarioGuardado.apellidos || "",
                    correo: usuarioGuardado.correo,
                    telefono:
                        document.getElementById("telefonoDelivery")?.value?.trim() ||
                        usuarioGuardado.telefono ||
                        ""
                },
                tipo_entrega:
                    tipoEntregaActual === "delivery" ? "Delivery" : "Recojo",
                direccion_entrega:
                    tipoEntregaActual === "delivery" ? direccion : null,
                subtotal: subtotal,
                delivery: delivery,
                propina: propina,
                total: total,
                metodo_pago: metodoPagoActual || "tarjeta",
                productos: carrito.map(function (producto) {
                    return {
                        nombre: producto.nombre,
                        cantidad: Number(producto.cantidad),
                        precio: Number(producto.precio),
                        tamanio: producto.tamanio || "",
                        bebida: producto.bebida || "",
                        salsas: Array.isArray(producto.salsas)
                            ? producto.salsas
                            : []
                    };
                })
            };

            console.log("Compra de demostración:", datosPedidoDemo);

            usuarioActual = usuarioGuardado;

            localStorage.setItem(
                "conchonUsuarioActual",
                JSON.stringify(usuarioActual)
            );

            carrito = [];
            actualizarCarrito();

            mostrarResultado(
                true,
                "¡GRACIAS POR COMPRAR EN CONCHON BURGUER! 🍔 " +
                "Tu compra de demostración se confirmó correctamente. " +
                "Número de pedido: #" +
                numeroPedidoDemo +
                ". Total: S/ " +
                total.toFixed(2) +
                ". ¡Gracias por elegirnos!"
            );

        } catch (error) {
            console.error("Error al confirmar la compra:", error);

            mostrarResultado(
                false,
                "No se pudo confirmar la compra. " +
                "Por favor, inténtalo nuevamente."
            );

        } finally {
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }
    });
}

/* ==========================================
   CORREGIR BOTONES DE CIERRE DEL CHECKOUT
========================================== */

// Botón X
if (cerrarCheckout) {
    cerrarCheckout.addEventListener("click", function () {
        cerrarCheckoutVentana();
    });
}

// Cerrar desde la pantalla de resultado
if (cerrarResultado) {
    cerrarResultado.addEventListener("click", function () {
        cerrarCheckoutVentana();
    });
}

// Botón VOLVER AL INICIO
if (checkoutResultado) {
    checkoutResultado.addEventListener("click", function (evento) {
        const boton = evento.target.closest("button, a");

        if (
            boton &&
            boton.textContent.trim().toUpperCase().includes("VOLVER AL INICIO")
        ) {
            evento.preventDefault();
            cerrarCheckoutVentana();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
}