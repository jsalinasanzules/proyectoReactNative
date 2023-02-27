import React, { useState, useEffect, Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { colors } from "react-native-elements";
import * as SQLite from "expo-sqlite";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginForm from "./LoginForm";
import Navigation from "../navegations/Navegation";
import { AuthContext } from "../components/Context";
import moment from "moment";
import { Button } from "react-native-elements";

const APIfechaUltimaActualizacion =
  "https://app.cotzul.com/Pedidos/getPedidosVendedor.php?idvendedor=59037";
const APIpedidosvendedor =
  "https://app.cotzul.com/Pedidos/getPedidosVendedor.php?idvendedor=59037";
const APItransportes = "https://app.cotzul.com/Pedidos/pd_getTransporte.php";
const APIVendedores = "https://app.cotzul.com/Pedidos/getVendedoresList.php";
const APIClientes =
  "https://app.cotzul.com/Pedidos/getClientes.php?nombre=marc&idvendedor=59037";
const APITarifas =
  "https://app.cotzul.com/Pedidos/pd_getTarifa.php?ttcodigo=1&tarifa=1";
const APIPlazo = "https://app.cotzul.com/Pedidos/pd_getPlazo.php?notidplazo=1";
const APIItem = "https://app.cotzul.com/Pedidos/getItems.php?nombre=A";
const APIDatosPedidos =
  "https://app.cotzul.com/Pedidos/getDatosPedido.php?idpedido=59";

const database_name = "CotzulBD.db";
const database_version = "1.0";
const database_displayname = "CotzulBD";
const database_size = 200000;

export default function CargarInformacion() {
  const [loading, setLoading] = useState(false);
  const [actualizaFecha, setActualizaFecha] = useState(false);
  const [actualizaTablas, setActualizaTablas] = useState(false);
  const [pedidosVendedorAPI, setPedidosVendedorAPI] = useState(false);

  const [fechaUltimaActualizacion, setFechaUltimaActualizacion] = useState("");
  const [fechaUltimaActualizacionAPI, setFechaUltimaActualizacionAPI] =
    useState("");

  const [actParametros, setActParametros] = useState(-1);
  const [actfechaSQL, setActfechaSQL] = useState(-1);
  const [actfechaAPI, setActfechaAPI] = useState(-1);
  const [actValidacionFechas, setActValidacionFechas] = useState(-1);

  const [terminaHandle, setTerminaHandle] = useState(false);
  const [terminaPedidosVendedor, setTerminaPedidosVendedor] = useState(false);
  const [terminaTransporte, setTerminaTransporte] = useState(false);
  const [terminaVendedor, setTerminaVendedor] = useState(false);
  const [terminaCliente, setTerminaCliente] = useState(false);
  const [terminaPlazo, setTerminaPlazo] = useState(false);
  const [terminaTarifa, setTerminaTarifa] = useState(false);
  const [terminaItem, setTerminaItem] = useState(false);
  const [terminaDatosPedido, setTerminaDatosPedido] = useState(false);

  const fechaActual = {
    parametros: [
      {
        pa_codigo: "ACTFECHA",
        pa_valor: moment().format("DD-MM-yyyy HH:mm:ss").toString(),
      },
    ],
  };

  let db = null;

  useEffect(() => {
    if (terminaHandle) {
      terminarProceso();
    }
  }, [terminaHandle]);

  useEffect(() => {
    if (
      terminaPedidosVendedor &&
      terminaTransporte &&
      terminaVendedor &&
      terminaCliente &&
      terminaPlazo &&
      terminaTarifa &&
      terminaItem &&
      terminaDatosPedido
    ) {
      setTerminaHandle(true);
      terminarProceso();
    }
  }, [
    terminaPedidosVendedor,
    terminaTransporte,
    terminaVendedor,
    terminaCliente,
    terminaPlazo,
    terminaTarifa,
    terminaItem,
    terminaDatosPedido,
  ]);

  useEffect(() => {
    obtenerFechaActualizacionVisualizer();
    
    if (actParametros == 0) {
      tblparametros(1);
      obtenerFechaActualizacion();
    }

    if (actParametros == 1) {
      if (actualizaFecha) {
        tblparametros(2, fechaActual);
        //setActualizaTablas(true);
        //actualizarTablas(1);
        actualizarTablas();
      }
    }
  }, [actParametros]);

  useEffect(() => {
    if (actfechaSQL == 1) {
      obtenerFechaActualizacion();
    }
  }, [actfechaSQL]);

  useEffect(() => {
    if (actfechaAPI == 1) {
      obtenerFechaActualizacionAPI();
    }
  }, [actfechaAPI]);

  useEffect(() => {
    console.log("validaciones:"+fechaUltimaActualizacion);
    if (actValidacionFechas == 1) {
      if (fechaUltimaActualizacionAPI == "") {
        console.log("ERROR AL CONECTARSE AL WS");
      } else if (fechaUltimaActualizacion >= fechaUltimaActualizacionAPI) {
        console.log("NO ACTUALIZA");
      } else if (
        fechaUltimaActualizacion == "" ||
        fechaUltimaActualizacion < fechaUltimaActualizacionAPI
      ) {
        setActualizaTablas(true);
        console.log("ACTUALIZA DATOS");
      }
      setActParametros(1);
    }
  }, [actValidacionFechas]);

  useEffect(() => {
    if (actualizaTablas) {
      setActualizaTablas(true);
      actualizarTablas();
    }
  }, [actualizaTablas]);

  useEffect(() => {
    obtenerFechaActualizacionVisualizer();
  }, []);

  const sincronizarDatos = async () => {
    try {
      setLoading(true);
      setActParametros(0);
      //setActualizaTablas(false);
    } catch (error) {
      setLoading(false);
      console.log("un error cachado listar pedidos");
      console.log(error);
    }
  };

  const terminarLoader = async () => {
    try {
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("un error cachado listar pedidos");
      console.log(error);
    }
  };

  const terminarProceso = () => {
    if (terminaHandle) {
      obtenerFechaActualizacionVisualizer();
      terminarLoader();
    }
  };

  /** PARAMETROS**/

  const obtenerFechaActualizacionVisualizer = async () => {
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    console.log("obtenerFechaActualizacionVisualizer");

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT pa_valor, pa_codigo FROM parametros where pa_codigo = ? order by pa_valor desc limit 1",
        ["ACTFECHA"],
        (tx, results) => { 
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              setFechaUltimaActualizacion(row.pa_valor);
              console.log(
                "fechaUltimaActualizacionVisualizer :::" + fechaUltimaActualizacion
              );
            }
          } else {
            console.log("No se encontró registro de actualización");
          }
        }
      );
    });
  };

  const tblparametros = async (nextStatus: any, myResponse: any) => {
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    console.log("PARAMETROS Registro de Datos Parametros ... ");

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS parametros");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS parametros(pa_codigo VARCHAR(20) , pa_valor VARCHAR(50));"
      );

      myResponse?.parametros.map((value, index) => {
        txn.executeSql(
          "INSERT INTO parametros(pa_codigo,pa_valor) VALUES (?, ?); ",
          [value.pa_codigo, value.pa_valor],
          //["ACTFECHA","2037-03-04"],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    if (nextStatus === 1) {
      setActfechaSQL(1);
    } else if (nextStatus === 2) {
      setActfechaAPI(1);
    }
    console.log("PARAMETROS registros afectados:", cont);
  };

  const obtenerFechaActualizacion = async () => {
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    console.log("obtenerFechaActualizacion");

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT pa_valor, pa_codigo FROM parametros where pa_codigo = ? order by pa_valor desc limit 1",
        ["ACTFECHA"],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              setFechaUltimaActualizacion(row.pa_valor);
              console.log(
                "fechaUltimaActualizacion :::" + fechaUltimaActualizacion
              );
            }
          } else {
            console.log("No se encontró registro de actualización");
          }
          obtenerFechaActualizacionAPI();
        }
      );
    });
  };

  const obtenerFechaActualizacionAPI = async () => {
    console.log("obtenerFechaActualizacionAPI");
    try {
      //const responseFechaAPI = await fetch(APIfechaUltimaActualizacion);
      //const jsonResponseAPIFecha = await responseFechaAPI.json();

      const jsonResponseAPIFecha = {
        fecha: [{ fechaUltimaActualizacion: "27-02-2023 22:50:44" }],
      };
 
      jsonResponseAPIFecha?.fecha.map((value, index) => {
        setFechaUltimaActualizacionAPI(value.fechaUltimaActualizacion);
        //setFechaUltimaActualizacionAPI("");
        console.log(
          "fechaUltimaActualizacionAPI:::" + fechaUltimaActualizacionAPI
        );
      });
    } catch (error) {
      console.log("un error cachado");
      console.log(error);
    }

    setActValidacionFechas(1);
    console.log("validaciones:"+fechaUltimaActualizacion);
    if (actValidacionFechas == 1) {
      if (fechaUltimaActualizacionAPI === "") {
        setActualizaFecha(false);
        console.log("ERROR AL CONECTARSE AL WS");
      } else if (fechaUltimaActualizacion >= fechaUltimaActualizacionAPI) {
        setActualizaFecha(true);
        console.log("NO ACTUALIZA");
      } else if (
        fechaUltimaActualizacion == "" ||
        fechaUltimaActualizacion < fechaUltimaActualizacionAPI
      ) {
        //setActualizaTablas(true); //Aquí actualiza los datos de las tablas
        setActualizaFecha(true);
        console.log("ACTUALIZA DATOS");
      }
      setActParametros(1);
    }
  };

  /** FIN PARAMETROS**/

  /** TABLAS **/
  async function actualizarTablas() {
    const results = await Promise.allSettled([
      pedidosVendedor(),
      transportes(),
      vendedores(),
      clientes(),
      plazo(),
      tarifas(),
      items(),
      datospedidos(),
    ]);
  }
  /** FIN TABLAS **/

  /** PEDIDOS VENDEDOR **/
  const pedidosVendedor = async () => {
    console.log("GET API pedidovendedor");
    const response = await fetch(APIpedidosvendedor);
    const jsonResponse = await response.json();

    savePedidosVendedor(jsonResponse);
  };

  savePedidosVendedor = (myResponse) => {
    //if (pedidosVendedorAPI) {
    //console.log(myResponse);
    console.log("GUARDA REGISTROS pedidovendedor");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS pedidosvendedor");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "pedidosvendedor " +
          "(pv_codigo INTEGER, pv_codigovendedor INTEGER,  pv_vendedor VARCHAR(100), pv_codcliente INTEGER, pv_cliente VARCHAR(200)," +
          "pv_total VARCHAR(50), pv_estatus VARCHAR(50), pv_gngastos VARCHAR(100), pv_numpedido INTEGER);"
      );

      myResponse?.pedidovendedor.map((value, index) => {
        txn.executeSql(
          "INSERT INTO pedidosvendedor(pv_codigo,pv_codigovendedor,pv_vendedor,pv_codcliente,pv_cliente,pv_total,pv_estatus,pv_gngastos,pv_numpedido) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?); ",
          [
            Number(value.pv_codigo),
            Number(value.pv_codigovendedor),
            value.pv_vendedor,
            Number(value.pv_codcliente),
            value.pv_cliente,
            value.pv_total,
            value.pv_estatus,
            value.pv_gngastos,
            Number(value.pv_numpedido),
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });
    //console.log("pedidosclientes afectados: ", results.rowsAffected);

    listarPedidosVendedor();
    //setActualizaTablas(2);
    //actualizarTablas(2);
    //}
  };

  const listarPedidosVendedor = () => {
    console.log("LISTAR pedidovendedor");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM pedidosvendedor", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          //console.log(`PEDIDOS VENDEDOR: ` + JSON.stringify(row));
        }
        setTerminaPedidosVendedor(true);
        terminarProceso();
      });
    });
  };
  /** FIN PEDIDOS VENDEDOR **/

  /** TRANSPORTES **/
  const transportes = async () => {
    console.log("GET API transportes");
    const response = await fetch(APItransportes);
    const jsonResponse = await response.json();

    saveTransportes(jsonResponse);
  };

  saveTransportes = (myResponse) => {
    console.log("GUARDA REGISTROS transportes");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS transportes");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "transportes " +
          "(pl_codigo INTEGER, pl_razon VARCHAR(200)," +
          "pl_nombre VARCHAR(200), pl_visible VARCHAR(10));"
      );

      myResponse?.transporte.map((value, index) => {
        txn.executeSql(
          "INSERT INTO transportes(pl_codigo,pl_razon,pl_nombre,pl_visible) " +
            " VALUES (?, ?, ?, ?); ",
          [
            Number(value.pl_codigo),
            value.pl_razon,
            value.pl_nombre,
            value.pl_visible,
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });
    //console.log("pedidosclientes afectados: ", results.rowsAffected);

    listarTransportes();
    //actualizarTablas(3);
    //}
  };

  const listarTransportes = () => {
    console.log("LISTAR transportes");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM transportes", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          //console.log(`TRANSPORTE: ` + JSON.stringify(row));
        }
        setTerminaTransporte(true);
        terminarProceso();
      });
    });
  };
  /** FIN TRANSPORTES **/

  /** VENDEDORES **/
  const vendedores = async () => {
    console.log("GET API vendedores");
    const response = await fetch(APIVendedores);
    const jsonResponse = await response.json();

    saveVendedores(jsonResponse);
  };

  saveVendedores = (myResponse) => {
    console.log("GUARDA REGISTROS vendedores");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS vendedores");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "vendedores " +
          "(vd_codigo INTEGER, vd_vendedor VARCHAR(200));"
      );

      myResponse?.vendedores.map((value, index) => {
        txn.executeSql(
          "INSERT INTO vendedores(vd_codigo,vd_vendedor) " + " VALUES (?, ?); ",
          [Number(value.vd_codigo), value.vd_vendedor],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarVendedores();
  };

  const listarVendedores = () => {
    console.log("LISTAR vendedores");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM vendedores", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          //console.log(`VENDEDORES: ` + JSON.stringify(row));
        }
        setTerminaVendedor(true);
        terminarProceso();
      });
    });
  };
  /** FIN VENDEDORES **/

  /** CLIENTES **/
  const clientes = async () => {
    console.log("GET API clientes");
    const response = await fetch(APIClientes);
    const jsonResponse = await response.json();

    saveClientes(jsonResponse);
  };

  saveClientes = (myResponse) => {
    console.log("GUARDA REGISTROS Clientes");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS clientes");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "clientes " +
          "(ct_codigo INTEGER, ct_cedula VARCHAR(20), ct_tipoid VARCHAR(20)" +
          ", ct_cliente VARCHAR(200) , ct_telefono  VARCHAR(50), ct_direccion VARCHAR(200)  " +
          ", ct_correo VARCHAR(200) , ct_cupoasignado  VARCHAR(50), ct_cupodisponible VARCHAR(50)  " +
          ", ct_idplazo INTEGER , ct_plazo  VARCHAR(50), ct_tcodigo VARCHAR(50)  " +
          ", ct_idvendedor VARCHAR(10) , ct_usuvendedor  VARCHAR(10), ct_ubicacion VARCHAR(10)  " +
          ", ct_ciudad VARCHAR(50)   );"
      );

      myResponse?.clientes.map((value, index) => {
        txn.executeSql(
          "INSERT INTO clientes(ct_codigo,ct_cedula,ct_tipoid" +
            ", ct_cliente  , ct_telefono , ct_direccion   " +
            ", ct_correo  , ct_cupoasignado , ct_cupodisponible   " +
            ", ct_idplazo  , ct_plazo , ct_tcodigo   " +
            ", ct_idvendedor  , ct_usuvendedor , ct_ubicacion   " +
            ", ct_ciudad) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?); ",
          [
            Number(value.ct_codigo),
            value.ct_cedula,
            value.ct_tipoid,
            value.ct_cliente,
            value.ct_telefono,
            value.ct_direccion,
            value.ct_correo,
            value.ct_cupoasignado,
            value.ct_cupodisponible,
            value.ct_idplazo,
            value.ct_plazo,
            value.ct_tcodigo,
            value.ct_idvendedor,
            value.ct_usuvendedor,
            value.ct_ubicacion,
            value.ct_ciudad,
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarClientes();
  };

  const listarClientes = () => {
    console.log("LISTAR clientes");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM clientes", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          //console.log(`CLIENTES: ` + JSON.stringify(row));
        }
        setTerminaCliente(true);
        terminarProceso();
      });
    });
  };
  /** FIN CLIENTES **/

  /** PLAZO **/
  const plazo = async () => {
    console.log("GET API Plazo");
    const response = await fetch(APIPlazo);
    const jsonResponse = await response.json();

    savePlazos(jsonResponse);
  };

  savePlazos = (myResponse) => {
    console.log("GUARDA REGISTROS plazos");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS plazos");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "plazos " +
          "(pl_codigo INTEGER, pl_descripcion VARCHAR(20)" +
          ", pl_notaidplazo VARCHAR(10)  );"
      );

      myResponse?.plazo.map((value, index) => {
        txn.executeSql(
          "INSERT INTO plazos(pl_codigo,pl_descripcion" +
            ", pl_notaidplazo) " +
            " VALUES (?, ?, ?); ",
          [Number(value.pl_codigo), value.pl_descripcion, "1"],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarPlazos();
  };

  const listarPlazos = () => {
    console.log("LISTAR plazos");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM plazos", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          //console.log(`PLAZOS: ` + JSON.stringify(row));
        }
        setTerminaPlazo(true);
        terminarProceso();
      });
    });
  };
  /** FIN PLAZO **/

  /** TARIFA **/
  const tarifas = async () => {
    console.log("GET API Tarifa");
    const response = await fetch(APITarifas);
    const jsonResponse = await response.json();

    saveTarifas(jsonResponse);
  };

  saveTarifas = (myResponse) => {
    console.log("GUARDA REGISTROS tarifas");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS tarifas");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "tarifas " +
          "(pl_peso VARCHAR(10), pl_tarifa1 VARCHAR(20), pl_tarifa2 VARCHAR(20)" +
          ", pl_descripcion VARCHAR(100), ttcodigo INTEGER, tarifa INTEGER  );"
      );

      myResponse?.tarifa.map((value, index) => {
        txn.executeSql(
          "INSERT INTO tarifas(pl_peso,pl_tarifa1,pl_tarifa2" +
            ", pl_descripcion,ttcodigo,tarifa) " +
            " VALUES (?, ?, ?, ?, ?, ?); ",
          [
            value.pl_peso,
            value.pl_tarifa1,
            value.pl_tarifa2,
            value.pl_descripcion,
            1,
            1,
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarTarifas();
  };

  const listarTarifas = () => {
    console.log("LISTAR tarifas");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM tarifas", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          //console.log(`TARIFAS: ` + JSON.stringify(row));
        }
        setTerminaTarifa(true);
        terminarProceso();
      });
    });
  };
  /** FIN TARIFA **/

  /** ITEM **/
  const items = async () => {
    console.log("GET API Items");
    const response = await fetch(APIItem);
    const jsonResponse = await response.json();

    saveItems(jsonResponse);
  };

  saveItems = (myResponse) => {
    console.log("GUARDA REGISTROS items");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS items");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "items " +
          "(it_codigo VARCHAR(200), it_codprod VARCHAR(20), it_referencia VARCHAR(50)" +
          ", it_descripcion VARCHAR(200), it_precio VARCHAR(20), it_pvp VARCHAR(20) " +
          ", it_preciosub VARCHAR(20), it_contado VARCHAR(20), it_stock VARCHAR(20) " +
          ", it_marca VARCHAR(50), it_familia VARCHAR(50), it_costoprom VARCHAR(20) " +
          ", it_peso VARCHAR(50), it_sku VARCHAR(10) " +
          " );"
      );

      myResponse?.items.map((value, index) => {
        txn.executeSql(
          "INSERT INTO items(it_codigo , it_codprod , it_referencia " +
            ", it_descripcion , it_precio , it_pvp " +
            ", it_preciosub , it_contado , it_stock  " +
            ", it_marca , it_familia , it_costoprom  " +
            ", it_peso,it_sku) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ",
          [
            Number(value.it_codigo),
            value.it_codprod,
            value.it_referencia,
            value.it_descripcion,
            value.it_precio,
            value.it_pvp,
            value.it_preciosub,
            value.it_contado,
            value.it_stock,
            value.it_marca,
            value.it_familia,
            value.it_costoprom,
            value.it_peso,
            value.it_sku,
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarItems();
  };

  const listarItems = () => {
    console.log("LISTAR items");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM items", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          //console.log(`ITEMS: ` + JSON.stringify(row));
        }
        setTerminaItem(true);
        terminarProceso();
      });
    });
  };
  /** FIN ITEM **/

  /** DATOS PEDIDOS **/
  const datospedidos = async () => {
    console.log("GET API datospedidos");
    const response = await fetch(APIDatosPedidos);
    const jsonResponse = await response.json();

    saveDatosPedidos(jsonResponse);
    //console.log(JSON.stringify(jsonResponse));
  };

  saveDatosPedidos = (myResponse) => {
    console.log("GUARDA REGISTROS datospedidos");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS datospedidos");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "datospedidos " +
          "(dp_codigo VARCHAR(200), dp_codvendedor VARCHAR(20), dp_codcliente VARCHAR(50)" +
          ", dp_subtotal VARCHAR(200), dp_descuento VARCHAR(20), dp_transporte VARCHAR(20) " +
          ", dp_seguro VARCHAR(20), dp_iva VARCHAR(20), dp_total VARCHAR(20) " +
          ", dp_estatus VARCHAR(50), dp_codpedven VARCHAR(50), dp_numpedido VARCHAR(20) " +
          ", dp_idvendedor VARCHAR(50), dp_fecha VARCHAR(50), dp_empresa VARCHAR(20) " +
          ", dp_prioridad VARCHAR(50), dp_observacion VARCHAR(50), dp_idcliente VARCHAR(20) " +
          ", dp_tipodoc VARCHAR(50), dp_tipodesc VARCHAR(50), dp_porcdesc VARCHAR(50), dp_valordesc VARCHAR(20) " +
          ", dp_ttrans VARCHAR(50), dp_gnorden VARCHAR(50), dp_gnventas VARCHAR(20) " +
          ", dp_gngastos VARCHAR(50), item VARCHAR(500) " +
          " );"
      );
 
      myResponse?.pedido.map((value, index) => {
        txn.executeSql(
          "INSERT INTO datospedidos(dp_codigo , dp_codvendedor , dp_codcliente " +
            ", dp_subtotal , dp_descuento , dp_transporte  " +
            ", dp_seguro , dp_iva , dp_total  " +
            ", dp_estatus , dp_codpedven , dp_numpedido  " +
            ", dp_idvendedor , dp_fecha , dp_empresa  " +
            ", dp_prioridad , dp_observacion , dp_idcliente  " +
            ", dp_tipodoc , dp_tipodesc ,dp_porcdesc  " +
            ", dp_valordesc , dp_ttrans , dp_gnorden   " +
            ", dp_gnventas, dp_gngastos, item "+
            ") " +
            " VALUES (?, ?, ? " +
            ", ?, ? , ? " +
            ", ?, ? , ? " +
            ", ?, ? , ? " +
            ", ?, ? , ? " +
            ", ?, ? , ? " +
            ", ?, ? , ? " +
            ", ?, ? , ? " +
            ", ?, ? , ? " +
            "); ",
          [
            value.dp_codigo,
            value.dp_codvendedor,
            value.dp_codcliente,

            value.dp_subtotal,
            value.dp_descuento,
            value.dp_transporte,

            value.dp_seguro,
            value.dp_iva,
            value.dp_total,

            value.dp_estatus,
            value.dp_codpedven,
            value.dp_numpedido,

            value.dp_idvendedor,
            value.dp_fecha,
            value.dp_empresa,

            value.dp_prioridad,
            value.dp_observacion,
            value.dp_idcliente,
            
            value.dp_tipodoc,
            value.dp_tipodesc,
            value.dp_porcdesc,
            
            value.dp_valordesc,
            value.dp_ttrans,
            value.dp_gnorden,
            
            value.dp_gnventas,
            value.dp_gngastos,
            JSON.stringify(value.item),
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarDatosPedidos();
  };

  const listarDatosPedidos = () => {
    console.log("LISTAR datospedidos");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM datospedidos", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          //console.log(`DATOS PEDIDOS: ` + JSON.stringify(row));
        }
        setTerminaDatosPedido(true);
        terminarProceso();
      });
    });
  };
  /** FIN DATOS PEDIDOS **/

  return (
    <>
      <Text style={styles.titlesSubtitle}>Fecha Última Actualización:</Text>
      <Text style={styles.titlesSubtitle}>{fechaUltimaActualizacion}</Text>
      {loading ? (
        <View style={{ marginHorizontal: 20, marginTop: 10, height: 200 }}>
          <Text style={styles.titlesSubtitle}>cargando...</Text>
          <ActivityIndicator size="large" color="purple" />
        </View>
      ) : (
        <Button
          title="Sincronizar"
          containerStyle={styles.btnContainerLogin}
          buttonStyle={styles.btnLogin}
          onPress={sincronizarDatos}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  titlesWrapper: {
    marginTop: 5,
    paddingHorizontal: 20,
  },
  tabletitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tabletext: {
    fontSize: 10,
  },
  tableval: {
    fontSize: 10,
    textAlign: "right",
  },
  titlesSubtitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.textDark,
  },
  titlesTitle: {
    // fontFamily:
    fontSize: 35,
    color: colors.textDark,
  },
  titlesdetalle: {
    // fontFamily:
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textDark,
    paddingTop: 10,
  },
  titlespick: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textDark,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  titlespick2: {
    fontSize: 16,
    color: colors.textDark,
    paddingTop: 5,
  },
  btnContainerLogin: {
    marginTop: 10,
    width: "90%",
  },
  btnLogin: {
    backgroundColor: "#6f4993",
  },
  iconRight: {
    color: "#c1c1c1",
  },
  detallebody: {
    height: 75,
    width: "90%",
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
  },
  dividobody: {
    flexDirection: "row",
    paddingTop: 20,
    height: 75,
    width: "90%",
    marginHorizontal: 20,
    borderWidth: 1,
  },
  totalbody: {
    borderWidth: 1,
    height: 75,
    width: "90%",
    marginHorizontal: 20,
    paddingTop: 20,
  },
  labelcorta: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textDark,
    paddingHorizontal: 20,
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  search: {
    flex: 1,
    marginLeft: 0,
    borderBottomColor: colors.textLight,
    borderBottomWidth: 1,
  },
  searchText: {
    fontSize: 14,
    marginBottom: 5,
    color: colors.textLight,
  },
  productoWrapper: {
    marginTop: 10,
  },
  Searchbar: {
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  scrollview: {
    marginTop: 10,
    marginBottom: 50,
  },
  categoriaWrapper: {
    paddingHorizontal: 20,
  },
  categoriaWrapper1: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center", //Centered vertically
  },
  categoriaItemWrapper1: {
    marginTop: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: "#f5ca4b",
    borderRadius: 20,
    width: 120,
    height: 70,
    justifyContent: "center", //Centered horizontally
    alignItems: "center", //Centered vertically
    flex: 1,
  },
  categoriaItemWrapper2: {
    marginTop: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 120,
    height: 70,
    justifyContent: "center", //Centered horizontally
    alignItems: "center", //Centered vertically
    flex: 1,
  },
  textItem: {
    textAlign: "center",
    fontSize: 10,
  },
});

const pickerStyle = {
  inputIOS: {
    color: "white",
    paddingHorizontal: 20,
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: "#6f4993",
    borderRadius: 5,
    height: 30,
  },
  placeholder: {
    color: "white",
  },
  inputAndroid: {
    width: "85%",
    height: 20,
    color: "white",
    marginHorizontal: 20,
    paddingLeft: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
    marginTop: 10,
  },
  search: {
    flex: 1,
    marginLeft: 0,
    borderBottomColor: colors.textLight,
    borderBottomWidth: 1,
  },
};
