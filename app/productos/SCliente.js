import React,{useState, useEffect} from 'react'
import { Image, FlatList, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert} from 'react-native';
import axios from 'axios'
import { colors } from "react-native-elements";
import * as SQLite from 'expo-sqlite';

const database_name = 'CotzulBD.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;

export default function SCliente(props) {
    const {navigation, route} = props;
    const {cl_codigo,cl_cedula, cl_cliente} = route.params;
    const [posts, setPosts] = useState([])


    const abrirtablaCliProd = async() => {
        getDataCatCli();
        
    }


    const getDataCatCli = async () => {
        console.log("ingresando")
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            'SELECT * FROM Catalogo WHERE ct_codcliente = ?',
            [`${cl_codigo}`],
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
       
        abrirtablaCliProd();
    }, [cl_codigo]);

    return (
        <View style={styles.container}>
            <View style={styles.titlesWrapper}>
                <Text style={styles.titlesSubtitle}>{cl_cliente}</Text>
                <Text style={styles.titlesTitle}>{cl_cedula}</Text>
                <Text style={styles.titlesecond}>Listado de Catálogos:</Text>
            </View>
            <View>
            {posts == null || posts.length == 0 ? (
                <NoFoundProducts />
            ) : (<View>
                <FlatList
                data = {posts}
                keyExtractor={( id , index) => index.toString()}
                renderItem={({ item }) => (<ListCatalogos catalogo={item} navigation={navigation} /> )} 
                ListFooterComponent={() => <View style={{flex:1,justifyContent: "center",alignItems: "center"}}><Text style={styles.finalproducto}>--- Fin de busqueda ---</Text></View>}
                />

            </View>)}
            </View>
        </View>
    )
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


function ListCatalogos(props){
    const {catalogo, navigation} = props;
    const {ct_codigo,ct_nomcata, ct_nomcliente, ct_codcliente, ct_descargado, ct_cantprod, ct_cantpromo, ct_cantliqui, ct_cantprox} = catalogo;

    const goCatalogo = () =>{
        console.log("Detalle Catalogo");
        navigation.navigate("scatalogo",{ct_codigo,ct_nomcata, ct_nomcliente}); 
    }

    return (<TouchableOpacity onPress={goCatalogo}>
        <View style={styles.productoCardWrapper}>
        
            <View style={styles.productoTexto}>
                <Text style={styles.productoReferencia}>{ct_nomcata}</Text>
                <Text style={styles.productoCodigo}>{ct_nomcliente}</Text>
                <Text style={styles.productoConf}>Cantidad producto: {ct_cantprod}</Text>
                <Text style={styles.productoConf}>Cantidad promociones: {ct_cantpromo}</Text>
                <Text style={styles.productoConf}>Cantidad liquidaciones: {ct_cantliqui}</Text>
                <Text style={styles.productoConf}>Cantidad próximos: {ct_cantprox}</Text>
                
            </View>
            <View style={styles.productoPrecio}>
                        <Text style={styles.textoPrecio}>Descargado:</Text>
                        <Text style={styles.textoPrecio}>{ct_descargado}</Text>
            </View>
        </View>
        </TouchableOpacity>);
}

const styles = StyleSheet.create({

    titlesWrapper:{
        marginTop: 30,
        paddingHorizontal: 20,
    },
titlesSubtitle:{
   // fontFamily: 
   fontSize: 16,
   color:'#9462c1',
   fontSize: 30,
   fontWeight: 'bold',
   textAlign: 'center'
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
    width: 250,
},
productoPrecio:{
    flexDirection: 'column',
    width: 100,
    height:100,
},
textoPrecio:{
    textAlign:'right',
    paddingRight: 20,
    paddingTop:0,
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
finalproducto:{
    color:'#9462c1',
    fontSize: 15,
    height: 150,
    marginTop: 10,
}
})
