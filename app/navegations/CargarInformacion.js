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

const APIpedidosvendedor =
  "https://app.cotzul.com/Pedidos/getPedidosVendedor.php?idvendedor=59037";
const APItransporte = "https://app.cotzul.com/Pedidos/pd_getTransporte.php";

const database_name = "CotzulBD.db";
const database_version = "1.0";
const database_displayname = "CotzulBD";
const database_size = 200000;

export default function CargarInformacion({ terminarLoader }) {
  const [fechaUltimaActualizacion, setFechaUltimaActualizacion] = useState("");

  const valores = {
    parametros: [{ pa_codigo: "ACTFECHA", pa_valor: "2024-04-04" }],
  };

  let db = null;

  useEffect(() => {    
    tblparametros();
    //updparametros();
    obtenerFechaActualizacion();


    
    terminarLoader();
  }, []);

  /** PARAMETROS**/

  tblparametros = async (myResponse) => {
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    console.log("PARAMETROS Registro de Datos Paramtros ... ");

    var cont = 0;
    db.transaction((txn) => {
      //txn.executeSql("DROP TABLE IF EXISTS parametros");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS parametros(pa_codigo VARCHAR(20) primary key not null, pa_valor VARCHAR(50));"
      );

      //myResponse?.parametros.map((value, index) => {
        txn.executeSql(
          "INSERT INTO parametros(pa_codigo,pa_valor) VALUES (?, ?); ",
          //[value.pa_codigo,value.pa_valor],
          ["ACTFECHA","2035-03-04"],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      //});
    });

    console.log("PARAMETROS registros afectados:", cont);
  };

  updparametros = async (myResponse) => {
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    console.log("PARAMETROS Update de Datos Paramtros ... ");

    var cont = 0;
    db.transaction((txn) => {
      //myResponse?.parametros.map((value, index) => {
        txn.executeSql(
          " UPDATE parametros SET pa_valor = '2022-09-09' WHERE pa_codigo = 'ACTFECHA'); ",
          //[value.pa_valor, value.pa_codigo],
          [],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      //});
    });
    console.log("PARAMETROS registros afectados:", cont);
  };

  const obtenerFechaActualizacion = async () => {
    console.log("obtenerFechaActualizacion");

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT pa_valor, pa_codigo FROM parametros where pa_codigo = ?",
        ["ACTFECHA"],
        (tx, results) => {
          console.log("Query completed");

          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(row.pa_valor+"-"+row.pa_codigo);
            }
            console.log("Parametros Selected");
          } else {
            console.log("No se encontró registro de actualización");
          }
        }
      );
    });
  };

  
  return <></>;
}
