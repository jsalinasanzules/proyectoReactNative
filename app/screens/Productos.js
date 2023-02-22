import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  AppState,
} from "react-native";
import { colors } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import DetPedidos from "./DetPedidos";
import { AuthContext } from "../components/Context";
import * as SQLite from "expo-sqlite";

function defaultValueRegister() {
  return {
    cb_codigo: "",
    cb_coddocumento: "",
    cb_cliente: "",
    cb_vendedor: "",
    cb_accion: "",
    cb_valortotal: 0,
  };
}

function defaultValueUser() {
  return {
    us_codigo: "",
    us_nombre: "",
    us_usuario: "",
    us_clave: "",
    us_estatus: "",
    us_codusuario: "",
  };
}

const STORAGE_KEY = "@save_data";
const STORAGE_DB = "@login_data";

const STORAGE_CAD = "@save_cadena";

const dataped = [
  {
    cb_codigo: "0001",
    cb_coddocumento: "0002",
    cb_cliente: "PEDRO DURAN A.",
    cb_vendedor: "HENRY CRUZ",
    cb_accion: "D",
    cb_valortotal: 345,
  },
  {
    cb_codigo: "0002",
    cb_coddocumento: "0003",
    cb_cliente: "CARLOS CHOEZ",
    cb_vendedor: "HENRY CRUZ",
    cb_accion: "B",
    cb_valortotal: 2893,
  },
  {
    cb_codigo: "0003",
    cb_coddocumento: "0004",
    cb_cliente: "RICARDO VALLEJO",
    cb_vendedor: "HENRY CRUZ",
    cb_accion: "B",
    cb_valortotal: 2245,
  },
];

export default function Productos(props) {
  const [tpedido, setTpedido] = useState(-1);
  const { navigation, route } = props;
  const [registro, setRegistro] = useState(defaultValueRegister);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [data, setData] = useState([]);
  const [dataUser, setdataUser] = useState(defaultValueUser());
  const { signOut, signUp } = React.useContext(AuthContext);
  const [usuario, setUsuario] = useState(false);
  const [consta, setConsta] = useState("");
  const [cadena, setCadena] = useState("");
  const [idpedido, setIdPedido] = useState(0);

  const [responsePV, setResponsePV] = useState(null);

  var cont = 0;

  /* FUNCIONES RECURSIVAS */
  const getDataUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      console.log("si entrego : " + jsonValue);
      setdataUser(JSON.parse(jsonValue));
      setUsuario(true);
      console.log("INGRSA A PRODUCTO: " + dataUser.vn_nombre);
    } catch (e) {
      console.log("Error al coger el usuario");
      console.log(e);
    }
  };

  const getCadenaDB = async () => {
    try {
      const valu = await AsyncStorage.getItem(STORAGE_CAD);
      setConsta(valu);
      console.log("constant : " + valu);
      const response = await fetch(
        "https://app.cotzul.com/Pedidos/getAllPedidosN.php?idestatus=-1&usuario=" +
          dataUser.us_usuario +
          "&cadena=" +
          valu
      );
      console.log(
        "https://app.cotzul.com/Pedidos/getAllPedidosN.php?idestatus=-1&usuario=" +
          dataUser.us_usuario +
          "&cadena=" +
          valu
      );
      const jsonResponse = await response.json();
    } catch (e) {
      console.log("Error cadena");
      console.log(e);
    }
  };

  const setCad = async (value) => {
    try {
      await AsyncStorage.setItem(STORAGE_CAD, value);
    } catch (e) {
      console.log(e);
    }
  };

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    console.log("ENTRO JSA");
    if (dataUser) {
      if (!usuario) {
        getDataUser();
        recargarPedidos();
        console.log("ENTRO JSA2");
      }
    }
  }, []);

  useEffect(() => {
    listarPedidos();
  }, [dataUser]);

  const regresarFunc = () => {
    // console.log("ingreso a regresar");
    navigation.navigate("productos");
    listarPedidos();
  };

  const listarPedidos = async () => {
    try {
      /*const response = await fetch(
        "https://app.cotzul.com/Pedidos/getPedidosVendedor.php?idvendedor=" +
          dataUser.vn_codigo
      );*/
      const database_name = "CotzulBD.db";
      const database_version = "1.0";
      const database_displayname = "CotzulBD";
      const database_size = 200000;

      let db = null;
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
          setLoading(true);
          setData(results.rows._array);
          //const pedidosvendedor = { pedidovendedor: results.rows._array };
          //setResponsePV(pedidosvendedor);
        });
      });

      //console.log(responsePV);
      //const jsonResponse = await JSON.stringify(responsePV);
      //setLoading(true);
      //setData(responsePV?.pedidovendedor);
    } catch (error) {
      setLoading(false);
      console.log("un error cachado listar pedidos");
      console.log(error);
    }
  };

  const cargarDetalles = (pedidos) => {
    console.log(" data: " + pedidos);
    var cont = 0;
    var texto = "vacio";

    if (pedidos != undefined) {
      console.log("valor de mensjar: " + pedidos[0].cb_mensaje);

      if (pedidos[0].cb_mensaje != "X") {
        texto = '<?xml version="1.0" encoding="iso-8859-1"?><c c0="2" c1="1" >';
        for (let x = 0; x < pedidos.length; x++) {
          cont++;
          console.log(pedidos[x].cb_coddocumento);
          texto =
            texto +
            '<detalle d0="' +
            pedidos[x].cb_coddocumento +
            '" d1="' +
            cont +
            '"></detalle>';
        }
        texto = texto + "</c>";
      } else {
        //console.log(pedidos[0].cb_observacion);
        if (pedidos[0].cb_observacion != "X")
          Alert.alert(pedidos[0].cb_observacion);
      }
    }
    console.log(texto);
    setCadena(texto);
    setCad(texto);
  };

  const item = ({ item }) => {
    var cont = 0;

    if (item.cb_mensaje != "X") {
      const viewDetails = (props) => {
        console.log("Detalle pedido");

        for (let x = 0; x < data.length; x++) {
          cont++;
          console.log(item.pv_codigo);
          if (data[x].pv_codigo == item.pv_codigo) {
            data[x].background = "gray";
          } else {
            data[x].background = "white";
          }
        }

        if (data.length == 0) {
          setRegistro(defaultValueRegister);
        } else {
          setRegistro(item);
          setIdPedido(item.pv_codigo);
          console.log("valor idpedido: " + item.pv_codigo);
        }
      };

      return (
        <TouchableOpacity onPress={viewDetails}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: item.background,
              marginRight: 15,
            }}
          >
            <View
              style={{
                width: 60,
                height: 30,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletext}>{item.pv_numpedido}</Text>
            </View>

            <View
              style={{
                width: 120,
                height: 30,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletext}>{item.pv_cliente}</Text>
            </View>
            <View
              style={{
                width: 70,
                height: 30,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tableval}>
                {Number(item.pv_gngastos).toFixed(2)} %
              </Text>
            </View>
            <View
              style={{
                width: 100,
                height: 30,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletext}>
                {item.pv_estatus == 0
                  ? "NO APROBADO"
                  : item.pv_estatus == 1
                  ? "NUEVOS"
                  : item.pv_estatus == 2
                  ? "BACKORDER"
                  : item.pv_estatus == 3
                  ? "REACTIVADOS"
                  : item.pv_estatus == -1
                  ? "BORRADOR"
                  : "NINGUNO"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const nuevoPedido = () => {
    navigation.navigate("nuevoped", { dataUser, regresarFunc });
  };

  const editaPedido = () => {
    navigation.navigate("editapedido", { dataUser, idpedido, regresarFunc });
  }; 

  const recargarPedidos = () => {
    listarPedidos();
    setRegistro(defaultValueRegister);
  };

  const actualizaPedido = (tpedido) => {
    setLoading(false);
    setTpedido(tpedido);
    //listarPedidos(tpedido);
    setRegistro(defaultValueRegister);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titlesWrapper}>
        <Text style={styles.titlesSubtitle}>Cotzul S.A.</Text>
        <Text style={styles.titlespick2}>Usuario: {dataUser.vn_nombre}</Text>
      </View>
      {/*Search*/}

      <View style={{ alignItems: "center" }}>
        <Button
          title="Nuevo Pedido"
          containerStyle={styles.btnContainerLogin}
          buttonStyle={styles.btnLogin}
          onPress={nuevoPedido}
        />
      </View>
      <Text style={styles.titlespick}>Mis Pedidos:</Text>
      <ScrollView horizontal>
        <View style={{ marginHorizontal: 20, marginTop: 10, height: 200 }}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: 60,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>#Doc.</Text>
            </View>
            <View
              style={{
                width: 120,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Cliente</Text>
            </View>

            <View
              style={{
                width: 70,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Lote</Text>
            </View>
            <View
              style={{
                width: 100,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Estado</Text>
            </View>
          </View>

          {loading && loading2 ? (
            <FlatList
              data={data}
              renderItem={item}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <ActivityIndicator size="large" loading={loading && loading2} />
          )}
        </View>
      </ScrollView>
      <View style={styles.titlesWrapper}>
        <Text style={styles.titlesdetalle}>Cabecera de Pedidos</Text>
      </View>
      <DetPedidos registro={registro} />
      <View style={{ alignItems: "center" }}>
        {registro.pv_estatus == -1 ? (
          <Button
            title="Continuar Editando"
            containerStyle={styles.btnContainerLogin}
            buttonStyle={styles.btnLogin}
            onPress={editaPedido}
          />
        ) : (
          ""
        )}
      </View>
    </ScrollView>
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
