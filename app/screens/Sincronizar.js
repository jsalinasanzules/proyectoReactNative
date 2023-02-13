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
import { Icon } from "react-native-elements";
import CargarInformacion from "../navegations/CargarInformacion";

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

export default function Sincronizar(props) {
  const [tpedido, setTpedido] = useState(-1);
  const { navigation, route } = props;
  const [registro, setRegistro] = useState(defaultValueRegister);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataUser, setdataUser] = useState(defaultValueUser());
  const { signOut, signUp } = React.useContext(AuthContext);
  const [usuario, setUsuario] = useState(false);
  const [consta, setConsta] = useState("");
  const [cadena, setCadena] = useState("");
  const [idpedido, setIdPedido] = useState(0);
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
    if (dataUser) {
      if (!usuario) {
        getDataUser();
        //recargarPedidos();
      }
    }
  }, []);

  /*useEffect(() => {
        listarPedidos();
    },[dataUser]);*/



  const sincronizarDatos = async () => {
    try {
      setLoading(true);
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titlesWrapper}>
        <Text style={styles.titlesSubtitle}>Cotzul S.A.</Text>
        <Text style={styles.titlespick2}>Usuario: {dataUser.vn_nombre}</Text>
      </View>

      <View style={{ alignItems: "center" }}>
     

        {loading ? (
          <View style={{ marginHorizontal: 20, marginTop: 10, height: 200 }}>
            <Text style={styles.titlesSubtitle}>cargando...</Text>
            <ActivityIndicator size="large" color="purple" />
            <CargarInformacion terminarLoader={terminarLoader}/>
          </View>
        ) : (
            <Button
            title="Sincronizar"
            containerStyle={styles.btnContainerLogin}
            buttonStyle={styles.btnLogin}
            onPress={sincronizarDatos}          
          />
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
