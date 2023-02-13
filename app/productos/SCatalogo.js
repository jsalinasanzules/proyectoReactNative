import React,{useState, useEffect} from 'react'
import { Image, FlatList, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Linking, Clipboard, ScrollView} from 'react-native';
import axios from 'axios'
import { colors, Button, Icon, SearchBar } from "react-native-elements";
import * as SQLite from 'expo-sqlite';
import RNPickerSelect from "react-native-picker-select";
import Modal from "react-native-modal";
import DataAddProd from '../data/DataAddProd'
import AsyncStorage from '@react-native-async-storage/async-storage'


const database_name = 'CotzulBD.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;

export default function SCatalogo(props) {
    const {navigation, route} = props;
    const {ct_codigo,ct_nomcata, ct_nomcliente, ct_codcliente} = route.params;
    const [posts, setPosts] = useState([])
    const [tprecio, setTprecio] = useState(0);
    const [precio, setPrecio] = useState("-");
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [search, setSearch] = useState("");
    const [tcatalogo, setCatalogo] = useState(1);
    const [nomcatalogo, setNomcatalogo] = useState("Catálogo de productos");
    const [codigofin, setCodigofin] = useState(0);
    const [arraydata, setArraydata] = useState([]);
    const [sql2, setSql2] = useState("");
    var codigovar = 0;
    var ArrayDatos = []
    const [sql, setSql] = useState("");
    var number = 0;
    const [btnvisible, setBtnvisible] = useState(true);
    const [textoespera, setTextoespera] = useState("Por favor espere, registrando productos...")

    

    const abrirtablaCatProd = async() => {
        getDataCatP();
        
    }

    const getDataCatP = async () => {
        
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            'SELECT a.pr_codigo as pr_codigo, a.pr_codprod as pr_codprod, a.pr_referencia as pr_referencia, a.pr_familia as pr_familia, a.pr_nivel1 as pr_nivel1, a.pr_nivel2 as pr_nivel2, a.pr_pvp as pr_pvp, a.pr_rutaimg as pr_rutaimg, a.pr_stock as pr_stock FROM Producto a, Catproducto b  WHERE b.cd_idcatalogo = ? AND b.cd_idproducto = a.pr_codigo',
            [`${ct_codigo}`],
            (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
                setPosts(temp);
                
            }
            );
        });
    };

    const getDataCatPromo = async () => {
        
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            'SELECT a.pr_codigo as pr_codigo, a.pr_codprod as pr_codprod, a.pr_referencia as pr_referencia, a.pr_familia as pr_familia, a.pr_nivel1 as pr_nivel1, a.pr_nivel2 as pr_nivel2, a.pr_pvp as pr_pvp, a.pr_rutaimg as pr_rutaimg, a.pr_stock as pr_stock FROM Producto a, CatPromociones b  WHERE b.ch_idcatalogo = ? AND b.ch_idproducto = a.pr_codigo',
            [`${ct_codigo}`],
            (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
                setPosts(temp);
                
            }
            );
        });
    };

    const getDataCatLiqui = async () => {
        
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            'SELECT a.pr_codigo as pr_codigo, a.pr_codprod as pr_codprod, a.pr_referencia as pr_referencia, a.pr_familia as pr_familia, a.pr_nivel1 as pr_nivel1, a.pr_nivel2 as pr_nivel2, a.pr_pvp as pr_pvp, a.pr_rutaimg as pr_rutaimg, a.pr_stock as pr_stock FROM Producto a, CatLiquidaciones b  WHERE b.cl_idcatalogo = ? AND b.cl_idproducto = a.pr_codigo',
            [`${ct_codigo}`],
            (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
                setPosts(temp);
                
            }
            );
        });
    };

    useEffect(() => {
       
        abrirtablaCatProd();
    }, [ct_codigo]);


    const handleModal = () => {
        if(!isModalVisible)
            setBtnvisible(true)
        setIsModalVisible(() => !isModalVisible);

    }



    
    useEffect(() => {
        if(tcatalogo == 1){
            setNomcatalogo("Catálogo de productos")
            setSql("SELECT * FROM Producto WHERE pr_referencia LIKE ?");
            getDataCatP()
        }else if(tcatalogo == 2){
            setNomcatalogo("Catálogo de promociones")
            setSql("SELECT b.pr_codigo as pr_codigo, b.pr_codprod as pr_codprod, b.pr_referencia as pr_referencia, b.pr_familia as pr_familia, b.pr_nivel1 as pr_nivel1, b.pr_nivel2 as pr_nivel2, b.pr_pvp as pr_pvp, b.pr_rutaimg as pr_rutaimg, b.pr_stock as pr_stock, b.pr_arrayimg as arrayimg FROM ProdHueso a, Producto b WHERE a.ph_codigo = b.pr_codigo AND b.pr_referencia LIKE ?");
            getDataCatPromo()
        }else if(tcatalogo == 3){
            setNomcatalogo("Catálogo de liquidaciones")
            setSql("SELECT b.pr_codigo as pr_codigo, b.pr_codprod as pr_codprod, b.pr_referencia as pr_referencia, b.pr_familia as pr_familia, b.pr_nivel1 as pr_nivel1, b.pr_nivel2 as pr_nivel2, b.pr_pvp as pr_pvp, b.pr_rutaimg as pr_rutaimg, b.pr_stock as pr_stock, b.pr_arrayimg as arrayimg FROM ProdLiquidacion a, Producto b WHERE a.pl_codigo = b.pr_codigo AND b.pr_referencia LIKE ?");
            getDataCatLiqui()
        }
    }, [tcatalogo]);

    const guardarProductos1 = () => {
        setBtnvisible(!btnvisible)
        number++;
        console.log("ok: "+number)

    }


    const guardarProductos = async () => {
        setBtnvisible(!btnvisible)
        if(tcatalogo == 1){
            setSql2('INSERT INTO Catproducto(cd_codigo, cd_idcatalogo, cd_idproducto) VALUES(?,?,?)');
        }else if(tcatalogo == 2){
            setSql2('INSERT INTO CatPromociones(ch_codigo, ch_idcatalogo, ch_idproducto) VALUES(?,?,?)');
        }else if(tcatalogo == 3){
            setSql2('INSERT INTO CatLiquidaciones(cl_codigo, cl_idcatalogo, cl_idproducto) VALUES(?,?,?)');
        }

        var dtproductos = "";
        var contv = 0;
        console.log("Lenght datos inicial: " + ArrayDatos.length)
        setArraydata(ArrayDatos)
        for (let idproducto of ArrayDatos) {
            if(contv != 0)
                dtproductos = dtproductos + "*";
            dtproductos = dtproductos + idproducto;
            contv++;
        }

        console.log(dtproductos)
        console.log(ct_codigo)
        console.log(tcatalogo)

        /*
        db.transaction((tx) => {
            tx.executeSql(
            sql1,
            [`${ct_codigo}`],
            (tx, results) => {
                    var len = results.rows.length;
                    console.log("tamaño: " + len)
                    
                    if(len > 0){
                        setCodigofin(results.rows.item(0).cd_codigo+1)
                        codigovar = results.rows.item(0).cd_codigo+1;
                    }
                    else {
                        setCodigofin(1)
                        codigovar = 1;
                    }
                    
                    var tot = ArrayDatos.length;
                    var num = 1;

                    for (let idproducto of ArrayDatos) {
                        console.log(codigovar)
                        console.log("id de producto*222: " + idproducto);
                        insertProductos(codigovar, idproducto, tot, num, sql2)
                        codigovar++;
                        num++;
                        
                    }
                    
                    
            }
            );
        });*/

        console.log("https://app.cotzul.com/Catalogo/php/conect/db_insertProductos.php?idcatalogo="+ct_codigo+"&idproductos="+dtproductos+"&tcatalogo="+tcatalogo);

        try {
            const response = await fetch(
              "https://app.cotzul.com/Catalogo/php/conect/db_insertProductos.php?idcatalogo="+ct_codigo+"&idproductos="+dtproductos+"&tcatalogo="+tcatalogo
            );
            const jsonResponse = await response.json();
            console.log(jsonResponse)
            jsonResponse?.productosid.map((value,index) => {
               setCodigofin(value.codigo)
            });

          } catch (error) {
            console.log("un error cachado");
            console.log(error);
          }
        
        
    }


    const updateCatalogo = async(ct_codigo, tot) =>{
        var sqlup = "";
        if(tcatalogo == 1){
            sqlup = "UPDATE Catalogo SET ct_cantprod = ct_cantprod + ? WHERE ct_codigo = ?";
        }else if(tcatalogo == 2){
            sqlup = "UPDATE Catalogo SET ct_cantpromo = ct_cantpromo + ? WHERE ct_codigo = ?";
        }else if(tcatalogo == 3){
            sqlup = "UPDATE Catalogo SET ct_cantliqui = ct_cantliqui + ? WHERE ct_codigo = ?";
        }
        db.transaction((tx) => {
            tx.executeSql(
            sqlup,
            [tot, ct_codigo],
            (tx, results) => {
                console.log("grabo el update de catalogo: " + sqlup);
                handleModal()
                setBtnvisible(!btnvisible)
                if(tcatalogo == 1){
                    getDataCatP()
                }else if(tcatalogo == 2){
                    getDataCatPromo()
                }else if(tcatalogo == 3){
                    getDataCatLiqui()
                }  
            }
            );
        });

            
                
    }

    const insertProductos = async (codigovar, idproducto, tot, num) => {
        db.transaction((tx) => {
                console.log("grabando este codigo: " + codigovar)

                tx.executeSql(
                    sql2,
                    [codigovar, ct_codigo, idproducto],
                    (tx, results) => {
                        console.log("ingresado con exito")
                        if(num == tot){
                            updateCatalogo(ct_codigo, tot)
                        }
                    }
                    );
        });
        
    };

    useEffect(() => {
        console.log("entro a codigo fin; " + codigofin)
        var contid = 0;
        var valid;
        var tot = arraydata.length;
        if(codigofin != 0){
            valid = codigofin.split("*");
            for (let idproducto of arraydata) {
                contid ++;
                insertProductos(valid[contid], idproducto, tot, contid)
            }
        
     }
    },[codigofin])


    return (
        <View style={styles.container}>
            <View style={styles.titlesWrapper}>
                <Text style={styles.titlesSubtitle}>{ct_nomcata}</Text>
                <Text style={styles.titlesTitle}>{ct_nomcliente}</Text>
                <Text style={styles.titlesTitle}>Tipo Precio: <RNPickerSelect
                    useNativeAndroidPickerStyle={false}
                    style={pickerStyle}
                    onValueChange={(tprecio) => setTprecio(tprecio)}
                    placeholder={{ label: "Seleccionar", value: 0 }}
                    items={[
                        { label: "Pvp", value: 1 },
                        { label: "Contado", value: 2 },
                        { label: "Credito", value: 3 },
                        { label: "Subdistribuidor", value: 4 },
                        { label: "Más iva", value: 5 }
                    ]}
                /></Text>
                <Modal isVisible={isModalVisible} tcatalogo={tcatalogo}>
                
                <View style={{ flex: 1,  backgroundColor:"white", 
    alignItems: "center", width: "100%"}}>
                <Icon
                    reverse
                    type="material-community"
                    name="close"
                    color="red"
                    containerStyle={styles.btnContainer}
                    onPress={handleModal} 
                />
                <View style={styles.titlesWrapper2}>
                <Text style={styles.titlesSubtitle1}>{tcatalogo == 1? "Agregar productos": tcatalogo == 2? "Agregar promociones" : "Agregar Liquidaciones" }</Text>
               
                <View style={styles.searchWrapper}>
                    <View style={styles.search}>
                        <SearchBar
                        placeholder="Buscar por referencia"
                        onChangeText={(e)=> setSearch(e)}
                        containerStyle = {StyleSheet.Searchbar}
                        value= {search}
                        />
                    </View>
                </View>
                
                <Text style={styles.titlesecond}>
                {tcatalogo == 1? "Listado de productos:": tcatalogo == 2? "Listado de promociones:" : "Listado de Liquidaciones:" }</Text>
                
                </View>

                
                
                <ScrollView style={styles.scrollview}>
                <View style={styles.productoWrapper}>
                <DataAddProd texto={search} sql={sql} tipocat={tcatalogo} ArrayDatos={ArrayDatos} />
                </View>
            </ScrollView>
                
            {(btnvisible) ? 
            <Button
                containerStyle={styles.btnContainerLogin2}
                buttonStyle = {styles.btnLogin}
                title='Agregar productos' 
                onPress={guardarProductos} 
                />
                 : 
                 <View style={styles.viewobservacion}>
                 <Text style={styles.observacion}>{textoespera}</Text>
                 <ActivityIndicator style={styles.actInd} size="large" color="#0000ff" />
                 </View>
                 }
                 
                
                </View>
                
                
            </Modal>
            <View style={styles.buttonsContainer}>
                <Button
                    containerStyle={styles.btnContainerLogin}
                    buttonStyle = {styles.btnLogin}
                    title='Ver' 
                    icon={
                        <Icon
                          type="material-community"
                          name="card-search-outline"
                          size={25}
                          color="white"
                        />
                      }

                      
                    onPress={ () => openUrl("https://app.cotzul.com/Catalogo/Presentacion/prod/productos.php?idcata="+ct_codigo+"&tipocata="+tcatalogo+"&tipo="+tprecio)} 
                    />
                <Button
                    containerStyle={styles.btnContainerLogin}
                    buttonStyle = {styles.btnLogin}
                    icon={
                        <Icon
                          type="material-community"
                          name="link-variant-plus"
                          size={25}
                          color="white"
                        />
                      }
                    title='Copiar' 
                    onPress={ () => copiarLink("https://app.cotzul.com/Catalogo/Presentacion/prod/productos.php?idcata="+ct_codigo+"&tipocata="+tcatalogo+"&tipo="+tprecio)} 
                    />
                <Button
                    containerStyle={styles.btnContainerLogin}
                    buttonStyle = {styles.btnLogin}
                    icon={
                        <Icon
                          type="material-community"
                          name="plus-thick"
                          size={25}
                          color="white"
                        />
                      }
                    title='Agregar' 
                    onPress={handleModal} 
                    />
                </View>
                <Text style={styles.titlesTitle}>Tipo de Catálogo: <RNPickerSelect
                    useNativeAndroidPickerStyle={false}
                    style={pickerStyle}
                    onValueChange={(tcatalogo) => setCatalogo(tcatalogo)}
                    placeholder={{ label: "Productos", value: 1 }}
                    items={[
                        { label: "Promociones", value: 2 },
                        { label: "Liquidaciones", value: 3 },
                    ]}
                /></Text>
                <Text style={styles.titlesecond}>{nomcatalogo}:</Text>
            </View>
            <ScrollView>
            {posts == null || posts.length == 0 ? (
                <NoFoundProducts />
            ) : (<View>
                <FlatList
                data = {posts}
                keyExtractor={( id , index) => index.toString()}
                renderItem={({ item }) => (<ListProducto producto={item} navigation={navigation} /> )} 
                ListFooterComponent={() => <View style={{flex:1,justifyContent: "center",alignItems: "center"}}><Text style={styles.finalproducto}>--- Fin de busqueda ---</Text></View>}
                />

            </View>)}
            </ScrollView>
        </View>
    )
}

function copiarLink(url){
    Clipboard.setString(url);
    Alert.alert("Link copiado con éxito");
}

function NoFoundProducts(){
    return(<View style={{flex: 1, alignItems: 'center', }}>
    <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode = "cover"
        style={{width: 200, height: 200}}
    />
</View>); 
}


function ListProducto(props){
    const {producto, navigation} = props;
    const {pr_codigo,pr_codprod, pr_referencia, pr_familia, pr_nivel1, pr_nivel2, pr_pvp, pr_stock, pr_rutaimg} = producto;

    const goProducto = () =>{
        navigation.navigate("producto",{pr_codigo, pr_codprod, pr_referencia,}); 
     }

    return (<TouchableOpacity onPress={goProducto}>
                <View style={styles.productoCardWrapper}>
                <View style={styles.productoImage}>
                <Image
                    PlaceholderContent = {<ActivityIndicator color="fff" />}
                    style={{width:100, height:100}}
                    source={{uri: pr_rutaimg}}
                />
                </View>
                    <View style={styles.productoTexto}>
                        <Text style={styles.productoReferencia}>{pr_referencia}</Text>
                        <Text style={styles.productoCodigo}>{pr_codprod}</Text>
                        <Text style={styles.productoConf}>{pr_familia}</Text>
                        <Text style={styles.productoConf}>{pr_nivel1}</Text>
                        <Text style={styles.productoConf}>{pr_nivel2}</Text>
                        
                    </View>
                    <View style={styles.productoPrecio}>
                                <Text style={styles.textoPrecio}>cant:{pr_pvp}</Text>
                    </View>
                </View>
                </TouchableOpacity>);
}

async function openUrl(url){
    console.log(url)
    const isSupported = await Linking.canOpenURL(url);
        if(isSupported){
            await Linking.openURL(url)
        }else{
            Alert.alert('No se encontro el archivo xls');
        }
}

const styles = StyleSheet.create({

    titlesWrapper:{
        marginTop: 10,
        paddingHorizontal: 20,
    },
    titlesWrapper2:{
        marginTop: 10,
        width: "100%",
        paddingHorizontal: 20,
    },
    buttonsContainer:{
        flexDirection: 'row',
        alignItems:'center',
        marginBottom: 10,
    },
    btnLogin:{
        backgroundColor: "#00a680",
    },
    btnContainerLogin:{
        marginTop: 10,
        paddingHorizontal: 5, 
        width: "33%"
    },
   
titlesSubtitle:{
   // fontFamily: 
   fontSize: 25,
   color:'#9462c1',
   fontWeight: 'bold',
   textAlign: 'center'
},
titlesSubtitle1:{
    // fontFamily: 
    fontSize: 18,
    color:'#9462c1',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 10
 },
btnContainerLogin2:{
    width: "90%",
    marginBottom: 10
},
titlesTitle:{
    // fontFamily: 
   fontSize: 15,
   color: colors.textDark,
   textAlign: 'center'
},
titlesecond:{
    paddingTop:30,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'grey'
},
viewobservacion:{
    paddingVertical: 10,
},
observacion:{
    fontSize: 15,
    fontWeight: 'bold',
    color: 'grey'
},
productoCardWrapper:{
    backgroundColor: '#CDCDCD',
    borderRadius:25,
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 0,
    marginLeft:10,
    marginRight:10,
    marginTop:10,
    height: 120,
    flexDirection: 'row',
},  
productoTexto:{
    flexDirection: 'column',
    width: 180,
},
productoPrecio:{
    flexDirection: 'column',
    width: 50,
    height:100,
},
textoPrecio:{
    textAlign:'right',
    paddingTop:80,
    color:'#9462c1',
    fontSize: 12,
},
productoReferencia:{
    color:'#9462c1',
    paddingLeft: 10,
    fontSize: 15,
    fontWeight: 'bold',
    flexShrink: 1,
},
productoCodigo:{
    color:'#000',
    paddingTop:2,
    paddingLeft: 10,
    fontSize: 12,
},
productoImage:{
    paddingTop: 0,
    paddingBottom: 10,
},
productoConf:{
    paddingTop:2,
    paddingLeft: 10,
    fontSize: 10,
    color: 'grey'
},
Searchbar:{
    marginBottom: 20,
    backgroundColor: '#fff'
}, 
finalproducto:{
    color:'#9462c1',
    fontSize: 15,
    height: 300,
    marginTop: 10,
},
scrollview:{
    marginTop:10,
    marginBottom: 10,
},
productoWrapper:{
    marginTop: 10,
},
})

const pickerStyle = {
    inputIOS: {
        color: 'white',
        paddingHorizontal: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    placeholder: {
        color: 'white',
      },
    inputAndroid: {
        width: 100,
        color: 'white',
        paddingHorizontal: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    searchWrapper:{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 0,
        marginTop: 10,
    },
    search:{
        flex: 1,
        marginLeft: 0,
        borderBottomColor: colors.textLight,
        borderBottomWidth: 1,
    }
};
