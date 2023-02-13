import React, {useState, useEffect, useCallback, useMemo} from 'react'
import { colors } from "react-native-elements";
import { Image, FlatList, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView} from 'react-native';
import axios from 'axios'
import {locationsRef} from "../utils/firebase"
import * as SQLite from 'expo-sqlite';
import {useNavigation} from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from "@react-native-community/netinfo";


const STORAGE_KEY = '@save_productos'
const database_name = 'CotzulBD.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;


export default function  DataExtra(props) {
   
    const [imageFirebase, setImage] = useState("")
    const [isLoading, setLoading] = useState(false)
    const navigation = useNavigation();
    const {texto, familia, tproducto} = props;

    const [actdata, setACTData] = useState(1);
    const [posts, setPosts] = useState([])
    const [internet, setInternet] = useState(true);
    const [cont, setCont] = useState(0);

    const [sqla, setSql] = useState("SELECT * FROM Producto WHERE pr_referencia LIKE ?");

   

    const abrirtablaProducto = async() => {
        getDataProd();
        console.log(sqla)
    }


    getDataProd = async () => {
        console.log("esta ingresando")
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            sqla,
            [`${texto}%`, familia],
            (tx, results) => {
                var temp = [];
                    console.log(results)
                    for (let i = 0; i < results.rows.length; ++i)
                        temp.push(results.rows.item(i));
                setPosts(temp);
                console.log("entro ")
            }
            );
    
        });
    };


useEffect(() => {
    var temp = [];
    setPosts(temp);
    console.log("se modifico el sql")
    abrirtablaProducto();
    setACTData(2);     
}, [cont]);



useEffect(() => {
    if(tproducto == 0){
        if(familia != 0){
                setSql("SELECT * FROM Producto WHERE pr_referencia LIKE ? AND pr_codfamilia = ?")
        }else{
                setSql("SELECT * FROM Producto WHERE pr_referencia LIKE ? AND pr_codfamilia != ?")
        }
    }else if(tproducto == 1){
        setSql("SELECT b.pr_codigo as pr_codigo, b.pr_codprod as pr_codprod, b.pr_referencia as pr_referencia, b.pr_familia as pr_familia, b.pr_nivel1 as pr_nivel1, b.pr_nivel2 as pr_nivel2, b.pr_pvp as pr_pvp, b.pr_rutaimg as pr_rutaimg, b.pr_stock as pr_stock, b.pr_arrayimg as arrayimg FROM ProdHueso a, Producto b WHERE a.ph_codigo = b.pr_codigo AND b.pr_referencia LIKE ? AND pr_codfamilia != ?")
    }else if(tproducto == 2){
        setSql("SELECT b.pr_codigo as pr_codigo, b.pr_codprod as pr_codprod, b.pr_referencia as pr_referencia, b.pr_familia as pr_familia, b.pr_nivel1 as pr_nivel1, b.pr_nivel2 as pr_nivel2, b.pr_pvp as pr_pvp, b.pr_rutaimg as pr_rutaimg, b.pr_stock as pr_stock, b.pr_arrayimg as arrayimg FROM ProdLiquidacion a, Producto b WHERE a.pl_codigo = b.pr_codigo AND b.pr_referencia LIKE ? AND pr_codfamilia != ?")
    }else if(tproducto == 3){
        setSql("SELECT b.pr_codigo as pr_codigo, b.pr_codprod as pr_codprod, b.pr_referencia as pr_referencia, b.pr_familia as pr_familia, b.pr_nivel1 as pr_nivel1, b.pr_nivel2 as pr_nivel2, b.pr_pvp as pr_pvp, b.pr_rutaimg as pr_rutaimg, b.pr_stock as pr_stock, b.pr_arrayimg as arrayimg FROM ProdxLlegar a, Producto b WHERE a.sf_codigo = b.pr_codigo AND b.pr_referencia LIKE ? AND b.pr_codfamilia != ?")
    }
    setCont(cont+1)
}, [texto,familia, tproducto]);

      
   useCallback(() => {
        NetInfo.fetch().then(state => {
            console.log("Connection type DataExtra", state.type);
            console.log("Is connected?", state.isConnected);
            setInternet(state.isConnected)
        });
    },[]);


   


    return (
           
        <View>
            {((posts.length <= 0) || (texto.length == 0 && familia == 0 && tproducto == 0)) ? (
                <NoFoundProducts />
            ) : (<View>
                <FlatList
                data = {posts}
                keyExtractor={( id , index) => index.toString()}
                renderItem={({ item }) => (<ListProducto producto={item} navigation={navigation} internet={internet} 
                /> )} 
                ListFooterComponent={() => <View style={{flex:1,justifyContent: "center",alignItems: "center"}}><Text style={styles.finalproducto}>--- Fin de busqueda ---</Text></View>}
                />

            </View>)}
        </View>
        
    
)
   
};


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
    const {producto, navigation, internet} = props;
    const {pr_codigo,pr_codprod, pr_referencia, pr_familia, pr_nivel1, pr_nivel2, pr_pvp, pr_rutaimg, pr_stock, pr_arrayimg} = producto;
    const [actual, setActual] = useState(0); 
    const [presiono, setPresiono] = useState(0); 



    const goProducto = () =>{
        if(presiono == 0){
            setPresiono(1)
            setActual(pr_codigo)
        }else if(presiono == 1 && actual == pr_codigo && internet){
            setPresiono(2)
            navigation.navigate("producto",{pr_codigo, pr_codprod, pr_referencia,}); 
        }else{
            setPresiono(1)
            setActual(pr_codigo)
        }
        
     }
     

    return (<TouchableOpacity onPress={goProducto}>
                <View style={styles.productoCardWrapper}>
                <View style={styles.productoImage}>
                    {(presiono == 1 && actual == pr_codigo) ? 
                        <Image PlaceholderContent = {<ActivityIndicator color="fff" />}
                        style={{width:100, height:100}}
                        source={{uri: pr_rutaimg}}
                        /> :
                    <Image
                    PlaceholderContent = {<ActivityIndicator color="fff" />}
                    style={{width:100, height:100}}
                    source={require("../../assets/img/noexiste.png")}
                    />}
                    
                </View>
                    <View style={styles.productoTexto}>
                        <Text style={styles.productoReferencia}>{pr_referencia}</Text>
                        <Text style={styles.productoCodigo}>{pr_codprod}</Text>
                        <Text style={styles.productoConf}>{pr_familia}</Text>
                        <Text style={styles.productoConf}>{pr_nivel1}</Text>
                        <Text style={styles.productoConf}>{pr_nivel2}</Text>
                        
                    </View>
                    <View style={styles.productoPrecio}>
                                <Text style={styles.textoPrecio}>cant: {pr_stock}</Text>
                    </View>
                </View>
                </TouchableOpacity>);
}




const styles = StyleSheet.create({
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
        width: 170,
    },
    productoPrecio:{
        flexDirection: 'column',
        width: 70,
        height:100,
        paddingRight:10,
    },
    textoPrecio:{
        textAlign:'left',
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
    finalproducto:{
        color:'#9462c1',
        fontSize: 15,
        height: 250,
        marginTop: 10,
    }
});


