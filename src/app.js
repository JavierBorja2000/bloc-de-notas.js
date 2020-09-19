const nuevoDocumento = () => {
  opcion = confirm("Desea guardar?");
  if (opcion === true) {
    console.log("estooy aqui");
    $contenido = document.querySelector("#contenido").value;
    console.log($contenido);
    dialog.showSaveDialog({}).then((path) => {
      console.log(path.filePath);
      fs.writeFile(path.filePath, $contenido, function (err) {});
    });
  } else {
    $contenido = document.querySelector("#contenido");
    $contenido.value = "";
  }
};

const guardarComo = () => {
  $contenido = document.querySelector("#contenido").value;
  console.log($contenido);
  dialog.showSaveDialog({}).then((path) => {
    console.log(path.filePath);
    fs.writeFile(path.filePath, $contenido, function (err) {});
  });
};

const abrir = () => {
  dialog.showOpenDialog({}).then((path) => {
    console.log("Estoy dentro de la funcion");
    const direccion = path.filePaths[0];
    fs.readFile(direccion, "utf-8", function (err, data) {
      $contenido = document.querySelector("#contenido");
      console.log($contenido);
      $contenido.value = data;
    });
  });
};

//AUTOMATA ASIGNACION DE VARIABLES
const validarAsignacionVariable = (contenido) => {
  let errores = [];
  let validacionDigito = /^[0-9]$/;
  let validacionLetra = /^[a-zA-Z]$/;
  contenido.forEach((palabra) => {
    let caracteres = palabra.split("");
    let estado = 1;
    for (let simbolo of caracteres) {
      switch (estado) {
        case 1:
          if (validacionLetra.test(simbolo)) estado = 2;
          if (simbolo === ":") estado = 3;
          if (validacionDigito.test(simbolo)) estado = 5;
          break;
        case 2:
          if (validacionLetra.test(simbolo)) estado = 2;
          if (validacionDigito.test(simbolo)) estado = 2;
          break;
        case 3:
          if (simbolo === "=") estado = 4;
          break;
        case 4:
          estado = 4;
          break;
        case 5:
          if (validacionDigito.test(simbolo)) estado = 5;
      }
    }
    if (estado === 1 || estado === 3) errores.push(palabra);
  });
  return errores;
};

//AUTOMATA NUMERO REAL
const validarNumeroEntero = (contenido) => {
  let errores = [];
  let validacion = /^[0-9]$/;
  contenido.forEach((palabra) => {
    let numeros = palabra.split("");
    let estado = 1;
    for (let simbolo of numeros) {
      switch (estado) {
        case 1:
          if (validacion.test(simbolo)) {
            estado = 2;
          }
          break;
        case 2:
          if (validacion.test(simbolo)) {
            estado = 2;
          } else if (simbolo == ".") {
            estado = 3;
          } else if (simbolo == "E" || simbolo == "e") {
            estado = 5;
          }
          break;
        case 3:
          if (validacion.test(simbolo)) {
            estado = 4;
          }
          break;
        case 4:
          if (validacion.test(simbolo)) {
            estado = 4;
          } else if (simbolo == "E" || simbolo == "e") {
            estado = 5;
          }
          break;
        case 5:
          if (validacion.test(simbolo)) {
            estado = 7;
          } else if (simbolo === "+" || simbolo === "-") {
            estado = 6;
          }
          break;
        case 6:
          if (validacion.test(simbolo)) {
            estado = 7;
          }
          break;
        case 7:
          if (validacion.test(simbolo)) {
            estado = 7;
          }
          break;
      }
    }
    if (
      estado === 1 ||
      estado === 2 ||
      estado === 3 ||
      estado === 5 ||
      estado === 6
    ) {
      errores.push(palabra);
    }
  });
  return errores;
};

//AUTOMATA DE EVALUACION DE NOMBRE DE VARIABLE
const validarNombreVariable = (contenido) => {
  let errores = [];
  let validacionDigito = /^[0-9]$/;
  let validacionLetra = /^[a-zA-Z]$/;
  contenido.forEach((palabra) => {
    let caracteres = palabra.split("");
    let estado = 1;
    for (let simbolo of caracteres) {
      switch (estado) {
        case 1:
          if (validacionDigito.test(simbolo)) estado = 2;
          if (validacionLetra.test(simbolo)) estado = 3;
          break;
        case 2:
          break;
        case 3:
          if (validacionLetra.test(simbolo)) estado = 3;
          if (validacionDigito.test(simbolo)) estado = 3;
          break;
      }
    }

    if (estado !== 3) errores.push(palabra);
  });
  return errores;
};

const evaluarErrores = (automata) => {
  $contenido = document.querySelector("#contenido").value;
  $consola = document.querySelector(".consola");
  let $mostrar = document.getElementById("info-consola");

  $contenido = $contenido.split("\n");
  $contenido = $contenido.filter((elemento) => elemento !== "");
  console.log($contenido);
  let errores = automata($contenido);
  console.log(errores);

  $consola.style.display = "block";
  let erroresAMostrar = "";
  $contenido.forEach((palabra, i) => {
    for (let palabra2 of errores) {
      if (palabra2 === palabra) {
        let repetida = `ERROR: Linea ${i + 1}. ${palabra}\n`;
        erroresAMostrar += repetida;
      }
    }
  });
  $mostrar.value = erroresAMostrar;
};

// const { dialog } = window.require("electron").remote;
// const { remote } = require("electron");
// const { dialog } = require("electron").remote;

const electron = window.require("electron");
const { remote } = electron;
const { dialog, Menu } = remote;
const fs = require("fs");

$consola = document.querySelector(".consola");
$consola.style.display = "none";

//PRUEBA DE MENUUU DAVID

// const remote = electron.remote;

Menu.setApplicationMenu(
  Menu.buildFromTemplate([
    {
      label: "Automatas",
      submenu: [
        {
          label: "Asignacion de variables",
          click() {
            $contenido = document.querySelector("#contenido").value;
            $consola = document.querySelector(".consola");
            let $mostrar = document.getElementById("info-consola");

            $contenido = $contenido.split("\n");
            $contenido = $contenido.filter((elemento) => elemento !== "");
            console.log($contenido);
            let errores = validarAsignacionVariable($contenido);
            console.log(errores);

            $consola.style.display = "block";
            let erroresAMostrar = "";
            $contenido.forEach((palabra, i) => {
              for (let palabra2 of errores) {
                if (palabra2 === palabra) {
                  let repetida = `ERROR: Linea ${i + 1}. ${palabra}\n`;
                  erroresAMostrar += repetida;
                }
              }
            });
            $mostrar.value = erroresAMostrar;
          },
        },
        {
          label: "Numeros enteros",
          click() {
            $contenido = document.querySelector("#contenido").value;
            $consola = document.querySelector(".consola");
            let $mostrar = document.getElementById("info-consola");

            $contenido = $contenido.split("\n");
            $contenido = $contenido.filter((elemento) => elemento !== "");
            console.log($contenido);
            let errores = validarNumeroEntero($contenido);
            console.log(errores);

            $consola.style.display = "block";
            let erroresAMostrar = "";
            $contenido.forEach((palabra, i) => {
              for (let palabra2 of errores) {
                if (palabra2 === palabra) {
                  let repetida = `ERROR: Linea ${i + 1}. ${palabra}\n`;
                  erroresAMostrar += repetida;
                }
              }
            });
            console.log(erroresAMostrar);
            $mostrar.value = erroresAMostrar;
          },
        },
        {
          label: "Evaluacion nombre de variable",
          click() {
            $contenido = document.querySelector("#contenido").value;
            $consola = document.querySelector(".consola");
            let $mostrar = document.getElementById("info-consola");

            $contenido = $contenido.split("\n");
            $contenido = $contenido.filter((elemento) => elemento !== "");
            console.log($contenido);
            let errores = validarNombreVariable($contenido);
            console.log(errores);

            $consola.style.display = "block";
            let erroresAMostrar = "";
            $contenido.forEach((palabra, i) => {
              for (let palabra2 of errores) {
                if (palabra2 === palabra) {
                  let repetida = `ERROR: Linea ${i + 1}. ${palabra}\n`;
                  erroresAMostrar += repetida;
                }
              }
            });
            console.log(erroresAMostrar);
            $mostrar.value = erroresAMostrar;
          },
        },
      ],
    },
  ])
);

//################# EVENTOS ##################
document.getElementById("nuevo").addEventListener("click", () => {
  nuevoDocumento();
});

document.getElementById("guardar").addEventListener(
  "click",
  () => {
    guardarComo();
  },
  false
);

document.getElementById("abrir").addEventListener(
  "click",
  () => {
    console.log("estoy dentro del click");
    abrir();
  },
  false
);

//EVENT. LIMPIAR CONSOLA
document.getElementById("limpiarCon").addEventListener(
  "click",
  () => {
    $consola = document.querySelector(".consola");
    let $mostrar = document.getElementById("info-consola");

    $mostrar.value = "";
    $consola.style.display = "none";
  },
  false
);
