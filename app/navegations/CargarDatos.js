import React, { useState, useEffect } from "react";
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

const database_name = "CotzulBD.db";
const database_version = "1.0";
const database_displayname = "CotzulBD";
const database_size = 200000;

const STORAGE_KEY = "@save_data";
const STORAGE_DB = "@login_data";
let conta = 0;

export default function CargarDatos(props) {
  const [dataUser, setdataUser] = useState(defaultValueUser());
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [loading5, setLoading5] = useState(false);
  const [loading6, setLoading6] = useState(false);
  const [loading7, setLoading7] = useState(false);
  const [loading8, setLoading8] = useState(false);
  const [loading9, setLoading9] = useState(false);
  const [loading10, setLoading10] = useState(false);
  const [loading11, setLoading11] = useState(false);
  const [loading12, setLoading12] = useState(false);
  const [loading13, setLoading13] = useState(false);

  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState(false);
  const [user, setUser] = useState(false);
  const [textIndicador, settextIndicador] = useState("Cargando...");
  const [actdb, setActDB] = useState(0);
  const [actreg, setActREG] = useState(-1);
  const [actcli, setActCLI] = useState(-1);
  const [actcat, setActCAT] = useState(-1);
  const [actfam, setActFAM] = useState(-1);
  const [acthueso, setActHueso] = useState(-1);
  const [catpromo, setCatPromo] = useState(-1);
  const [actliq, setActLiq] = useState(-1);
  const [actxllegar, setActxLlegar] = useState(-1);
  const [catliqui, setCatLiqui] = useState(-1);
  const [catxllegar, setCatxLlegar] = useState(-1);

  const [estado, setEstado] = useState({ data: "", isLoaded: false });
  const [catalogos, setCatalogos] = useState({ data: "", isLoaded: false });
  const { signIn } = React.useContext(AuthContext);
  let db = null;
  /* FUNCIONES RECURSIVAS */
  const getDataUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      setdataUser(JSON.parse(jsonValue));
      setUsuario(true);
      console.log(dataUser.us_nombre);
    } catch (e) {
      // console.log(e)
    }
  };

  const setDB = async (value) => {
    try {
      await AsyncStorage.setItem(STORAGE_DB, value);
    } catch (e) {
      console.log(e);
    }
  };

  if (dataUser) {
    if (!usuario) {
      getDataUser();
    }

    const createTable2 = async () => {
      getData();
    };

    const createTable = async () => {
      db.transaction(
        (tx) => {
          {
            actdb == 1
              ? tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS " +
                    "Producto1 " +
                    "(pr_codigo INTEGER, pr_codprod TEXT, pr_referencia TEXT, pr_descorta TEXT, pr_deslarga TEXT, pr_marca TEXT, " +
                    "pr_codfamilia INTEGER, pr_codnivel1 INTEGER, pr_codnivel2 INTEGER, pr_familia TEXT," +
                    "pr_nivel1 TEXT, pr_nivel2 TEXT, pr_pvp DOUBLE, pr_preciosub DOUBLE, pr_contado DOUBLE," +
                    "pr_credito DOUBLE, pr_stock INTEGER, pr_rutaimg TEXT, pr_arrayimg TEXT);"
                )
              : actdb == 2
              ? tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS " +
                    "Catalogo " +
                    "(ct_codigo INTEGER, ct_idcliente INTEGER, ct_nomcata TEXT, ct_tipocli INTEGER, ct_fecha TEXT, ct_idvendedor INTEGER);"
                )
              : actdb == 3
              ? tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS " +
                    "Cliente " +
                    "(cl_codigo INTEGER, cl_cedula TEXT, cl_tipoid TEXT," +
                    "cl_cliente TEXT, cl_telefono TEXT, cl_direccion TEXT, cl_correo TEXT);"
                )
              : actdb == 4
              ? tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS " +
                    "Catproducto " +
                    "(cd_codigo INTEGER, cd_idcatalogo INTEGER, cd_idproducto INTEGER);"
                )
              : actdb == 5
              ? getData()
              : console.log("termino");
          }
        },
        () => {
          console.log("se registro correctamente");
        },
        (error) => {
          console.log(error);
        }
      );
    };

    getData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://app.cotzul.com/Catalogo/php/conect/db_getAllData.php"
        );

        const jsonResponse = await response.json();
        // console.log("My Products",jsonResponse);
        saveDbData(jsonResponse);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    saveDbData = async (myResponse) => {
      console.log("entro a la parte de grabacion");

      if (loading) {
        //SQLite.echoTest();
        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );
        var cont = 0;

        db.transaction((tx) => {
          tx.executeSql("DROP TABLE IF EXISTS Producto");
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "Producto " +
              "(pr_codigo INTEGER, pr_codprod VARCHAR(20), pr_referencia VARCHAR(20), pr_descorta TEXT, pr_deslarga TEXT, pr_marca VARCHAR(20), " +
              "pr_codfamilia INTEGER, pr_codnivel1 INTEGER, pr_codnivel2 INTEGER, pr_familia VARCHAR(20)," +
              "pr_nivel1 VARCHAR(20), pr_nivel2 VARCHAR(20), pr_pvp DOUBLE, pr_preciosub DOUBLE, pr_contado DOUBLE, pr_precioiva DOUBLE," +
              "pr_credito DOUBLE, pr_stock INTEGER, pr_rutaimg TEXT, pr_arrayimg TEXT, pr_sku INTEGER, pr_cm INTEGER, pr_ce INTEGER," +
              "pr_bod INTEGER, pr_alm INTEGER, pr_chi INTEGER, pr_rep INTEGER, pr_subseg DOUBLE, pr_contseg DOUBLE, pr_credseg DOUBLE, pr_pubseg DOUBLE);"
          );
          console.log("tx1: ", tx);
          myResponse?.productos.map((value, index) => {
            tx.executeSql(
              "INSERT INTO Producto VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)",
              [
                value.pr_codigo,
                value.pr_codprod,
                value.pr_referencia,
                value.pr_descorta,
                value.pr_deslarga,
                value.pr_marca,
                value.pr_codfamilia,
                value.pr_codnivel1,
                value.pr_codnivel2,
                value.pr_familia,
                value.pr_nivel1,
                value.pr_nivel2,
                value.pr_pvp,
                value.pr_preciosub,
                value.pr_contado,
                value.pr_precioiva,
                value.pr_credito,
                value.pr_stock,
                value.pr_rutaimg,
                value.pr_arrayimg,
                value.pr_sku,
                value.pr_cm,
                value.pr_ce,
                value.pr_bod,
                value.pr_alm,
                value.pr_chi,
                value.pr_rep,
                value.pr_subseg,
                value.pr_contseg,
                value.pr_credseg,
                value.pr_pubseg,
              ],
              (tx, results) => {
                // console.log('Productos:', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  cont++;
                  console.log("Producto_" + cont);
                }
              }
            );
          });
        });

        presentProductos();
      }
    };

    presentProductos = async () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM Producto LIMIT 10", [], (tx, results) => {
          console.log("Query completed");

          // Get rows with Web SQL Database spec compliance.

          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`Referencia : ${row.pr_referencia}`);
            console.log(`Codigo Producto: ${row.pr_codprod}`);
            console.log(`STOCK: ${row.pr_stock}`);
            console.log(`IMAGEN: ${row.pr_rutaimg}`);
            //this.setState({record: row});
          }

          setActREG(1);
          console.log("Productos Registrados con éxito");
        });
      });
    };

    getCatalogos = async () => {
      try {
        setLoading2(true);
        setActREG(2);
        const response2 = await fetch(
          "https://app.cotzul.com/Catalogo/php/conect/db_getCatalogosxidvendedor.php?id=" +
            dataUser.us_idvendedor
        );
        console.log(
          "https://app.cotzul.com/Catalogo/php/conect/db_getCatalogosxidvendedor.php?id=" +
            dataUser.us_idvendedor
        );
        const jsonResponse2 = await response2.json();

        //console.log("My Catalogos",jsonResponse2);
        saveDbDataCatalogo(jsonResponse2);
        setLoading2(false);
      } catch (error) {
        setLoading2(false);
        console.log("un error cachado");
        console.log(error);
      }
    };

    saveDbDataCatalogo = async (myResponse) => {
      if (loading2) {
        settextIndicador("Registro de Datos Catalogo ... ");

        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );
        if (db != null) {
          console.log("entro correctamente a la base de datos 2:");
        }
        var cont = 0;
        db.transaction((txn) => {
          txn.executeSql("DROP TABLE IF EXISTS Catalogo");
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "Catalogo " +
              "(ct_codigo INTEGER PRIMARY KEY, ct_codcliente INTEGER, ct_nomcliente VARCHAR(100), ct_nomcata VARCHAR(50), ct_tipocli INTEGER, ct_fecha VARCHAR(50), ct_codvendedor INTEGER, ct_descargado VARCHAR(10), ct_cantprod INTEGER, ct_cantpromo INTEGER, ct_cantliqui INTEGER, ct_cantprox INTEGER);"
          );

          console.log("tx2: ", txn);
          myResponse?.catalogos.map((value, index) => {
            //console.log("Catalogo: " + value.ct_nombcat);

            txn.executeSql(
              "INSERT INTO Catalogo VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                value.ct_codigo,
                value.ct_idcliente,
                value.ct_cliente,
                value.ct_nombcat,
                value.ct_tipocli,
                value.ct_fecha,
                value.ct_idvendedor,
                value.ct_descargado,
                value.ct_cantprod,
                value.ct_cantpromo,
                value.ct_cantliqui,
                value.ct_cantprox,
              ],
              (txn, results) => {
                console.log("Catalogos_afectados", results.rowsAffected);
                if (results.rowsAffected > 0) {
                  cont++;
                  console.log("Catalogo_" + cont);
                }
              }
            );
          });
        });

        console.log("termino el catalogo");
        presentCata();
      }
    };

    const presentCata = async () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM Catalogo LIMIT 10", [], (tx, results) => {
          console.log("Query completed");

          // Get rows with Web SQL Database spec compliance.

          var len = results.rows.length;
          console.log("cantidad de catalogos registrados : " + len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`NOMBRE CATALOGO : ${row.ct_nomcata}`);
            //this.setState({record: row});
          }
          setActCLI(1);
          console.log("Catalogos Registrados con éxito");
        });
      });
    };
    /**CLIENTES **/

    getClientes = async () => {
      try {
        setLoading3(true);
        setActCLI(2);
        const response2 = await fetch(
          "https://app.cotzul.com/Catalogo/php/conect/db_getClientexidvendedor.php?id=" +
            dataUser.us_idvendedor
        );
        console.log(
          "https://app.cotzul.com/Catalogo/php/conect/db_getClientexidvendedor.php?id=" +
            dataUser.us_idvendedor
        );
        const jsonResponse2 = await response2.json();

        //console.log("My Clientes",jsonResponse2);
        saveClientes(jsonResponse2);
        setLoading3(false);
      } catch (error) {
        setLoading3(false);
        console.log("un error cachado");
        console.log(error);
      }
    };

    saveClientes = async (myResponse) => {
      if (loading3) {
        settextIndicador("Registro de Datos Cliente ... ");

        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );

        var cont = 0;
        db.transaction((txn) => {
          txn.executeSql("DROP TABLE IF EXISTS Cliente");
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "Cliente " +
              "(cl_codigo INTEGER, cl_cedula VARCHAR(20), cl_tipoid VARCHAR(10)," +
              "cl_cliente VARCHAR(50), cl_telefono VARCHAR(50), cl_direccion VARCHAR(100), cl_correo VARCHAR(100));"
          );

          myResponse?.clientes.map((value, index) => {
            //console.log("Catalogo: " + value.ct_nombcat);

            txn.executeSql(
              "INSERT INTO Cliente VALUES (?, ?, ?, ?, ?, ?, ?)",
              [
                value.cl_codigo,
                value.cl_cedula,
                value.cl_tipoid,
                value.cl_cliente,
                value.cl_telefono,
                value.cl_direccion,
                value.cl_correo,
              ],
              (txn, results) => {
                console.log("Clientes_afectados", results.rowsAffected);
                if (results.rowsAffected > 0) {
                  cont++;
                  console.log("Clientes_" + cont);
                }
              }
            );
          });
        });
        presentCli();
        console.log("termino los clientes");
      }
    };

    const presentCli = async () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM Cliente", [], (tx, results) => {
          console.log("Query completed");

          // Get rows with Web SQL Database spec compliance.

          var len = results.rows.length;
          console.log("cantidad de clientes registrados : " + len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`NOMBRE CLIENTE : ${row.cl_cliente}`);
            //this.setState({record: row});
          }
          setActCAT(1);
          console.log("Clientes Registrados con éxito");
        });
      });
    };

    /**PRODUCTOS X CATALOGO **/
    getProductosxcatalogos = async () => {
      try {
        setLoading4(true);
        setActCAT(2);
        const response = await fetch(
          "https://app.cotzul.com/Catalogo/php/conect/db_getProductosxcatalogo.php?id=" +
            dataUser.us_idvendedor
        );
        const jsonResponse = await response.json();
        //console.log("My Catdetalle",jsonResponse);
        saveProdCatalogo(jsonResponse);
        setLoading4(false);
      } catch (error) {
        setLoading4(false);
        console.log("un error cachado");
        console.log(error);
      }
    };

    saveProdCatalogo = async (myResponse) => {
      if (loading4) {
        settextIndicador("Registro de Datos Producto/Catálogo ... ");

        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );

        var cont = 0;
        db.transaction((txn) => {
          txn.executeSql("DROP TABLE IF EXISTS Catproducto");
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "Catproducto " +
              "(cd_codigo INTEGER, cd_idcatalogo INTEGER, cd_idproducto INTEGER);"
          );

          myResponse?.Catproductos.map((value, index) => {
            txn.executeSql(
              "INSERT INTO Catproducto VALUES (?, ?, ?)",
              [value.cl_codigo, value.cl_idcatalogo, value.cl_idproducto],
              (txn, results) => {
                console.log("CatProducto", results.rowsAffected);
                if (results.rowsAffected > 0) {
                  cont++;
                  console.log("Catproducto_" + cont);
                }
              }
            );
          });
        });
        presentCatProd();
        console.log("termino los catalogos/productos");
      }
    };

    const presentCatProd = async () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM Catproducto", [], (tx, results) => {
          console.log("Query completed");

          // Get rows with Web SQL Database spec compliance.

          var len = results.rows.length;
          console.log("cantidad de catproducto registrados : " + len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`ID CATPRODUCTO : ${row.cd_idcatalogo}`);
            console.log(`ID PRODUCTO : ${row.cd_idproducto}`);
          }

          console.log("Catalogo/Producto registrados con éxito");
          setActFAM(1);
        });
      });
    };

    /*CARGAR LAS CATEGORIAS FAMILIAS*/

    getFamiliaCat = async () => {
      try {
        setLoading5(true);
        setActFAM(2);
        const response = await fetch(
          "https://app.cotzul.com/Catalogo/php/conect/db_getFamilia.php"
        );
        const jsonResponse = await response.json();
        saveFamCate(jsonResponse);
        setLoading5(false);
      } catch (error) {
        setLoading5(false);
        console.log("un error cachado");
        console.log(error);
      }
    };

    saveFamCate = async (myResponse) => {
      if (loading5) {
        settextIndicador("Registro de Datos Familia/Categoría ... ");

        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );

        var cont = 0;
        db.transaction((txn) => {
          txn.executeSql("DROP TABLE IF EXISTS Catfamilia");
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "Catfamilia " +
              "(fa_codigo INTEGER, fa_familia VARCHAR(50), fa_selected INTEGER);"
          );

          txn.executeSql("INSERT INTO Catfamilia VALUES (?, ?, ?)", [
            0,
            "TODOS",
            1,
          ]);

          myResponse?.familia.map((value, index) => {
            txn.executeSql(
              "INSERT INTO Catfamilia VALUES (?, ?, ?)",
              [value.fa_codigo, value.fa_familia, 0],
              (txn, results) => {
                console.log("Catfamilia", results.rowsAffected);
                if (results.rowsAffected > 0) {
                  cont++;
                  console.log("Catfamilia_" + cont);
                }
              }
            );
          });
        });
        presentFamilia();
        console.log("termino los familia");
      }
    };

    const presentFamilia = async () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM Catfamilia", [], (tx, results) => {
          console.log("Query completed");

          // Get rows with Web SQL Database spec compliance.

          var len = results.rows.length;
          console.log("cantidad de catproducto registrados : " + len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`ID CODIGO : ${row.fa_codigo}`);
            console.log(`ID FAMILIA : ${row.fa_familia}`);
          }

          console.log("Familia registrada con éxito");
          setActHueso(1);
        });
      });
    };

    /** CARGAR LOS PRODUCTOS EN PROMOCION */

    getProdHueso = async () => {
      console.log("getprodhueso");
      try {
        setLoading6(true);
        setActHueso(2);
        const response = await fetch(
          "https://app.cotzul.com/Catalogo/php/conect/db_getProdHueso.php"
        );
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        saveProdHueso(jsonResponse);
        setLoading6(false);
      } catch (error) {
        setLoading6(false);
        console.log("un error cachado");
        console.log(error);
      }
    };

    saveProdHueso = async (myResponse) => {
      if (loading6) {
        settextIndicador("Registro de Datos Productos/Promociones ... ");

        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );

        var cont = 0;
        db.transaction((txn) => {
          txn.executeSql("DROP TABLE IF EXISTS ProdHueso");
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "ProdHueso " +
              "(ph_codigo INTEGER, ph_codprod VARCHAR(50), ph_referencia VARCHAR(50)," +
              " ph_preciosub DOUBLE, ph_preciocont DOUBLE, ph_preciocred DOUBLE," +
              " ph_precioconiva DOUBLE, ph_dias INTEGER, ph_existencia INTEGER, ph_rutaimg TEXT, ph_arrayimg TEXT);"
          );

          myResponse?.phuesos.map((value, index) => {
            txn.executeSql(
              "INSERT INTO ProdHueso VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                value.ph_codigo,
                value.ph_codprod,
                value.ph_referencia,
                value.ph_preciosub,
                value.ph_preciocont,
                value.ph_preciocred,
                value.ph_precioconiva,
                value.ph_dias,
                value.ph_existencia,
                value.ph_rutaimg,
                value.ph_arrayimg,
              ],
              (txn, results) => {
                console.log("ProdHueso", results.rowsAffected);
                if (results.rowsAffected > 0) {
                  cont++;
                  console.log("ProdHueso_" + cont);
                }
              }
            );
          });
        });
        presentProdHueso();
        console.log("termino los Producto en Promocion");
      }
    };

    const presentProdHueso = async () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM ProdHueso", [], (tx, results) => {
          console.log("Query completed");

          // Get rows with Web SQL Database spec compliance.

          var len = results.rows.length;
          console.log("cantidad de productos promocion registrados : " + len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`ID CODIGO : ${row.ph_codigo}`);
            console.log(`ID REFERENCIA : ${row.ph_referencia}`);
          }

          console.log("ProdHueso registrada con éxito");
          setActLiq(1);
        });
      });
    };

    /** CARGAR LOS PRODUCTOS EN LIQUIDACION */

    getProdLiquidacion = async () => {
      console.log("getprodliquidacion");
      try {
        setLoading7(true);
        setActLiq(2);
        const response = await fetch(
          "https://app.cotzul.com/Catalogo/php/conect/db_getProdLiquidacion.php"
        );
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        saveProdLiq(jsonResponse);
        setLoading7(false);
      } catch (error) {
        setLoading7(false);
        console.log("un error cachado");
        console.log(error);
      }
    };

    saveProdLiq = async (myResponse) => {
      if (loading7) {
        settextIndicador("Registro de Datos Productos/Liquidaciones ... ");
        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );

        var cont = 0;
        db.transaction((txn) => {
          txn.executeSql("DROP TABLE IF EXISTS ProdLiquidacion");
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "ProdLiquidacion " +
              "(pl_codigo INTEGER, pl_codprod VARCHAR(50), pl_referencia VARCHAR(50)," +
              " pl_preciosub DOUBLE, pl_preciocont DOUBLE, pl_preciocred DOUBLE," +
              " pl_precioconiva DOUBLE, pl_preciosiniva DOUBLE, pl_dias INTEGER, " +
              " pl_existencia INTEGER, pl_rutaimg TEXT, pl_arrayimg TEXT);"
          );
          myResponse?.pliquidacion.map((value, index) => {
            txn.executeSql(
              "INSERT INTO ProdLiquidacion VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                value.pl_codigo,
                value.pl_codprod,
                value.pl_referencia,
                value.pl_preciosub,
                value.pl_preciocont,
                value.pl_preciocred,
                value.pl_precioconiva,
                value.pl_preciosiniva,
                value.pl_dias,
                value.pl_existencia,
                value.pl_rutaimg,
                value.pl_arrayimg,
              ],
              (txn, results) => {
                console.log("ProdLiquidacion", results.rowsAffected);
                if (results.rowsAffected > 0) {
                  cont++;
                  console.log("ProdLiquidacion_" + cont);
                }
              }
            );
          });
        });
        presentProdLiq();
        console.log("termino los Producto en Liquidaciones");
      }
    };

    const presentProdLiq = async () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM ProdLiquidacion", [], (tx, results) => {
          console.log("Query completed");
          var len = results.rows.length;
          console.log("cantidad de productos liquidacion registrados : " + len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`ID CODIGO : ${row.pl_codigo}`);
            console.log(`ID REFERENCIA : ${row.pl_referencia}`);
          }
          console.log("ProdLiquidacion registrada con éxito");
          setActxLlegar(1);
        });
      });
    };

    /** CARGAR LOS PRODUCTOS EN POR LLEGAR */

    getProdxLlegar = async () => {
      console.log("getProdxLlegar");
      try {
        setLoading8(true);
        setActxLlegar(2);
        const response = await fetch(
          "https://app.cotzul.com/Catalogo/php/conect/db_getProdFuturo.php"
        );
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        saveProdXLlegar(jsonResponse);
        setLoading8(false);
      } catch (error) {
        setLoading8(false);
        console.log("un error cachado");
        console.log(error);
      }
    };

    saveProdXLlegar = async (myResponse) => {
      if (loading8) {
        settextIndicador("Registro de Datos Productos/x LLegar ... ");
        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );

        var cont = 0;
        db.transaction((txn) => {
          txn.executeSql("DROP TABLE IF EXISTS ProdxLlegar");
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "ProdxLlegar " +
              "(sf_codigo INTEGER, sf_codped INTEGER, sf_codprod VARCHAR(50)," +
              " sf_referencia VARCHAR(50), sf_cantllega INTEGER," +
              " sf_fechallega VARCHAR(50), sf_rutaimg TEXT, sf_arrayimg TEXT);"
          );
          myResponse?.sfuturo.map((value, index) => {
            txn.executeSql(
              "INSERT INTO ProdxLlegar VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [
                value.sf_codigo,
                value.sf_codped,
                value.sf_codprod,
                value.sf_referencia,
                value.sf_cantllega,
                value.sf_fechallega,
                value.sf_rutaimg,
                value.sf_arrayimg,
              ],
              (txn, results) => {
                console.log("ProdxLlegar", results.rowsAffected);
                if (results.rowsAffected > 0) {
                  cont++;
                  console.log("ProdxLlegar_" + cont);
                }
              }
            );
          });
        });
        presentProdxLlegar();
        console.log("termino los Producto x Llegar");
      }
    };

    const presentProdxLlegar = async () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM ProdxLlegar", [], (tx, results) => {
          console.log("Query completed");
          var len = results.rows.length;
          console.log("cantidad de productos x llegar registrados : " + len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`ID CODIGO : ${row.sf_codigo}`);
            console.log(`ID REFERENCIA : ${row.sf_referencia}`);
          }
          console.log("Prodxllegar registrada con éxito");
          setCatPromo(1);
        });
      });
    };

    /** CARGAR LOS CATALOGO DE PROMOCIONES */

    getCatPromociones = async () => {
      console.log("getCatPromociones");
      try {
        setLoading9(true);
        setCatPromo(2);
        const response = await fetch(
          "https://app.cotzul.com/Catalogo/php/conect/db_getcatpromo.php"
        );
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        saveCatPromociones(jsonResponse);
        setLoading9(false);
      } catch (error) {
        setLoading9(false);
        console.log("un error cachado");
        console.log(error);
      }
    };

    saveCatPromociones = async (myResponse) => {
      if (loading9) {
        settextIndicador("Registro de Catalogos de promociones ... ");
        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );

        var cont = 0;
        db.transaction((txn) => {
          txn.executeSql("DROP TABLE IF EXISTS CatPromociones");
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "CatPromociones " +
              "(ch_codigo INTEGER, ch_idcatalogo INTEGER, ch_idproducto INTEGER);"
          );
          myResponse?.catapromo.map((value, index) => {
            txn.executeSql(
              "INSERT INTO CatPromociones VALUES (?, ?, ?)",
              [value.ch_codigo, value.ch_idcatalogo, value.ch_idproducto],
              (txn, results) => {
                console.log("CatPromociones", results.rowsAffected);
                if (results.rowsAffected > 0) {
                  cont++;
                  console.log("CatPromociones_" + cont);
                }
              }
            );
          });
        });
        presentCatPromociones();
        console.log("termino los Catalogos de promociones");
      }
    };

    const presentCatPromociones = async () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM CatPromociones", [], (tx, results) => {
          console.log("Query completed");
          var len = results.rows.length;
          console.log(
            "cantidad de Catalogo de promociones registrados : " + len
          );
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`ID CODIGO : ${row.ch_codigo}`);
            console.log(`ID IDPRODUCTO : ${row.ch_idproducto}`);
          }
          console.log("Catalogo promociones registrada con éxito");
          getCatLiquidaciones();
        });
      });
    };

    /** CARGAR LOS CATALOGO DE LIQUIDACIONES */

    getCatLiquidaciones = async () => {
      console.log("getCatLiquidaciones");
      try {
        setLoading10(true);
        setCatLiqui(2);
        const response = await fetch(
          "https://app.cotzul.com/Catalogo/php/conect/db_getcatliqui.php"
        );
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        saveCatLiquidacion(jsonResponse);
        setLoading10(false);
      } catch (error) {
        setLoading10(false);
        console.log("un error cachado");
        console.log(error);
      }
    };

    saveCatLiquidacion = async (myResponse) => {
      if (loading10) {
        settextIndicador("Registro de Catalogos de liquidaciones ... ");
        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );

        var cont = 0;
        db.transaction((txn) => {
          txn.executeSql("DROP TABLE IF EXISTS CatLiquidaciones");
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "CatLiquidaciones " +
              "(cl_codigo INTEGER, cl_idcatalogo INTEGER, cl_idproducto INTEGER);"
          );
          myResponse?.cataliqui.map((value, index) => {
            txn.executeSql(
              "INSERT INTO CatLiquidaciones VALUES (?, ?, ?)",
              [value.cl_codigo, value.cl_idcatalogo, value.cl_idproducto],
              (txn, results) => {
                console.log("CatLiquidaciones", results.rowsAffected);
                if (results.rowsAffected > 0) {
                  cont++;
                  console.log("CatLiquidaciones_" + cont);
                }
              }
            );
          });
        });
        presentCatLiquidaciones();
        console.log("termino los Catalogos de liquidaciones");
      }
    };

    const presentCatLiquidaciones = async () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM CatLiquidaciones", [], (tx, results) => {
          console.log("Query completed");
          var len = results.rows.length;
          console.log("cantidad de catalogo de liquidaciones : " + len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`ID CODIGO : ${row.cl_codigo}`);
            console.log(`ID IDPRODUCTO : ${row.cl_idproducto}`);
          }
          console.log("Catalogo de liquidaciones registrada con éxito");
          getCatxLlegar();
        });
      });
    };

    /** CARGAR LOS CATALOGO DE PRODUCTOS X LLEGAR */

    getCatxLlegar = async () => {
      console.log("getCatxLlegar");
      try {
        setLoading11(true);
        setCatxLlegar(2);
        const response = await fetch(
          "https://app.cotzul.com/Catalogo/php/conect/db_getcatprox.php"
        );
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        saveCatxLlegar(jsonResponse);
        setLoading11(false);
      } catch (error) {
        setLoading11(false);
        console.log("un error cachado");
        console.log(error);
      }
    };

    saveCatxLlegar = async (myResponse) => {
      if (loading11) {
        settextIndicador("Registro de Catalogos x Llegar ... ");
        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );

        var cont = 0;
        db.transaction((txn) => {
          txn.executeSql("DROP TABLE IF EXISTS CatxLlegar");
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "CatxLlegar " +
              "(cp_codigo INTEGER, cp_idcatalogo INTEGER, cp_idprox INTEGER);"
          );
          myResponse?.catafuturo.map((value, index) => {
            txn.executeSql(
              "INSERT INTO CatxLlegar VALUES (?, ?, ?)",
              [value.cp_codigo, value.cp_idcatalogo, value.cp_idprox],
              (txn, results) => {
                console.log("CatxLlegar", results.rowsAffected);
                if (results.rowsAffected > 0) {
                  cont++;
                  console.log("CatxLlegar_" + cont);
                }
              }
            );
          });
        });
        presentCatxLlegar();
        console.log("termino los Catalogos x llegar");
      }
    };

    const presentCatxLlegar = async () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM CatxLlegar", [], (tx, results) => {
          console.log("Query completed");
          var len = results.rows.length;
          console.log("cantidad de catalogo x llegar: " + len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`ID CODIGO : ${row.cp_codigo}`);
            console.log(`ID IDPRODUCTO : ${row.cp_idprox}`);
          }
          console.log("Catalogo x llegar registrada con éxito");
          getCombo();
        });
      });
    };

    /** CARGAR LOS COMBOS DE PRODUCTOS */

    getCombo = async () => {
      console.log("getCombo");
      try {
        setLoading13(true);
        const response = await fetch(
          "https://app.cotzul.com/Catalogo/php/conect/db_getCombo.php"
        );
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        saveCombo(jsonResponse);
        setLoading13(false);
      } catch (error) {
        setLoading13(false);
        console.log("un error cachado");
        console.log(error);
      }
    };

    saveCombo = async (myResponse) => {
      if (loading13) {
        settextIndicador("Registro Combos de productos ... ");
        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );

        var cont = 0;
        db.transaction((txn) => {
          txn.executeSql("DROP TABLE IF EXISTS Combos");
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "Combos " +
              "(cb_codigo INTEGER, cb_nombcombo VARCHAR(50), cb_imgcombo TEXT, cb_fechareg VARCHAR(50)," +
              " cb_cantllega VARCHAR(50), cb_subtotal DOUBLE, cb_chktransporte INTEGER, cb_chkseguro INTEGER," +
              " cb_chkiva INTEGER, cb_transporte DOUBLE, cb_seguro DOUBLE, cb_total DOUBLE, cb_tipoprecio INTEGER," +
              " cb_preciosiniva DOUBLE, cb_preciomasiva DOUBLE, cb_factor DOUBLE, cb_estatus INTEGER);"
          );
          myResponse?.combos.map((value, index) => {
            txn.executeSql(
              "INSERT INTO Combos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                value.cb_codigo,
                value.cb_nombcombo,
                value.cb_imgcombo,
                value.cb_fechareg,
                value.cb_cantllega,
                value.cb_subtotal,
                value.cb_chktransporte,
                value.cb_chkseguro,
                value.cb_chkiva,
                value.cb_transporte,
                value.cb_seguro,
                value.cb_total,
                value.cb_tipoprecio,
                value.cb_preciosiniva,
                value.cb_preciomasiva,
                value.cb_factor,
                value.cb_estatus,
              ],
              (txn, results) => {
                console.log("Combos", results.rowsAffected);
                if (results.rowsAffected > 0) {
                  cont++;
                  console.log("Combos_" + cont);
                }
              }
            );
          });
        });
        presentCombos();
        console.log("termino los Combos");
      }
    };

    const presentCombos = async () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM Combos", [], (tx, results) => {
          console.log("Query completed");
          var len = results.rows.length;
          console.log("cantidad de Combo: " + len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`ID CODIGO : ${row.cb_codigo}`);
          }
          console.log("Combos registrada con éxito");
          getcatcombo();
        });
      });
    };

    /* CAT COMBOS */

    getcatcombo = async () => {
      console.log("getCombo");
      try {
        setLoading12(true);
        const response = await fetch(
          "https://app.cotzul.com/Catalogo/php/conect/db_getcatcombo.php"
        );
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        savecatCombo(jsonResponse);
        setLoading12(false);
      } catch (error) {
        setLoading12(false);
        console.log("un error cachado");
        console.log(error);
      }
    };

    savecatCombo = async (myResponse) => {
      if (loading12) {
        settextIndicador("Registro Catálogo de Combos de productos ... ");
        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );

        var cont = 0;
        db.transaction((txn) => {
          txn.executeSql("DROP TABLE IF EXISTS Catcombos");
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "Catcombos " +
              "(cc_codigo INTEGER, cc_idcatalogo INTEGER, cc_idcombo INTEGER);"
          );
          myResponse?.catacombo.map((value, index) => {
            txn.executeSql(
              "INSERT INTO Catcombos VALUES (?, ?, ?)",
              [value.cc_codigo, value.cc_idcatalogo, value.cc_idcombo],
              (txn, results) => {
                console.log("Catcombos", results.rowsAffected);
                if (results.rowsAffected > 0) {
                  cont++;
                  console.log("Catcombos_" + cont);
                }
              }
            );
          });
        });
        presentCatCombos();
        console.log("termino los Combos");
      }
    };

    const presentCatCombos = async () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM Catcombos", [], (tx, results) => {
          console.log("Query completed");
          var len = results.rows.length;
          console.log("cantidad de Combo: " + len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`ID CODIGO : ${row.cc_codigo}`);
          }
          console.log("Combos registrada con éxito");
          setUser(true);
          setDB("SI");
          signIn();
        });
      });
    };

    useEffect(() => {
      if (actdb >= 0 && actdb < 6) {
        // createTable();
        setActDB(actdb + 1);
      }
      if (actdb == 1) {
        console.log("registro Producto");
        createTable2();
        settextIndicador("Tabla producto registrado correctamente ... ");
      } else if (actdb == 2) {
        console.log("registro Catalogo");
        settextIndicador("Tabla Catálogo registrado correctamente ... ");
      } else if (actdb == 3) {
        console.log("registro Cliente");
        settextIndicador("Tabla Cliente registrado correctamente ... ");
      } else if (actdb == 4) {
        console.log("registro Catproducto");
        settextIndicador("Tabla Catproducto registrado correctamente ... ");
      } else if (actdb == 5) {
        console.log("registro datos producto");
        settextIndicador("Registro de Datos productos ... ");
      }
    }, [actdb]);

    useEffect(() => {
      if (actreg == 1) {
        getCatalogos();
      }
    }, [actreg]);

    useEffect(() => {
      if (actcli == 1) {
        getClientes();
      }
    }, [actcli]);

    useEffect(() => {
      if (actcat == 1) {
        getProductosxcatalogos();
      }
    }, [actcat]);

    useEffect(() => {
      if (actfam == 1) {
        getFamiliaCat();
      }
    }, [actfam]);

    useEffect(() => {
      if (acthueso == 1) {
        getProdHueso();
      }
    }, [acthueso]);

    useEffect(() => {
      if (actliq == 1) {
        getProdLiquidacion();
      }
    }, [actliq]);

    useEffect(() => {
      if (actxllegar == 1) {
        getProdxLlegar();
      }
    }, [actxllegar]);

    useEffect(() => {
      if (catpromo == 1) {
        getCatPromociones();
      }
    }, [catpromo]);

    useEffect(() => {
      if (catliqui == 1) {
        getCatLiquidaciones();
      }
    }, [catliqui]);
  }

  return (
    <>
      <View style={styles.formContainer}>
        <Text style={styles.textTitulo}>Recopilando Datos</Text>
        <Image
          source={require("../../assets/img/logo_cotzul.jpeg")}
          resizeMode="contain"
          style={styles.image}
        />

        <ActivityIndicator style={styles.actInd} size="large" color="#0000ff" />
        <Text style={styles.textInd}>{textIndicador}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  textTitulo: {
    fontSize: 25,
    color: colors.textDark,
    marginTop: 150,
  },
  image: {
    height: 50,
    width: "50%",
    marginTop: 20,
    marginBottom: 10,
  },
  actInd: {
    marginTop: 50,
  },
  textInd: {
    marginTop: 20,
    fontSize: 15,
  },
});

function defaultValueUser() {
  return {
    us_codigo: "",
    us_idtipoadm: "",
    us_nombre: "",
    us_nomtipoadm: "",
  };
}
