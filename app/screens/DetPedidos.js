import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input, Icon, Button} from 'react-native-elements';
import { colors } from "react-native-elements";

export default function DetPedidos(props) {
    const {registro} = props;
    return (
        <View> 
            <View style={styles.detallebody}> 
                <Text style={{fontWeight:'bold'}}>Nombre Cliente:</Text>
                <Text style={styles.titlespick}>{registro.pv_cliente}</Text>
            </View>
            {/*<View style={{width:80, alignItems: 'left', paddingLeft: 10}}>
                        <Text style={{fontWeight:'bold'}}>#Docum.</Text>
                        <Text>{registro.cb_coddocumento}</Text>
                    </View>
                    <View style={{width:270, alignItems: 'left'}}>
                        <Text style={{fontWeight:'bold'}}>Vendedor</Text>
                        <Text>{registro.cb_vendedor}</Text>
                    </View>*/ }
            <View style={styles.dividobody}> 
                    <View style={{width:80}}>
                        <Text style={{fontWeight:'bold'}}>#Docum.</Text>
                        <Text style={styles.titlespick}>{registro.pv_numpedido}</Text>
                    </View>
                    <View style={{width:270}}>
                        <Text style={{fontWeight:'bold'}}>Vendedor</Text>
                        <Text style={styles.titlespick}>{registro.pv_vendedor}</Text>
                    </View>
                    
            </View>
            <View style={styles.totalbody}> 
            
                    <View style={{width:'100%'}}>
                        <Text style={{textAlign: 'right', paddingRight: 30,fontWeight:'bold'}}>Lote(%)</Text>
                        <Text style={{textAlign: 'right', paddingRight: 30}}>{Number(registro.pv_gngastos).toFixed(2)}</Text>
                    </View>
            </View>
           
        </View>

    )
}

const styles = StyleSheet.create({
    titlesWrapper:{
        marginTop: 10,
        paddingHorizontal: 20,
    },
titlesSubtitle:{
   // fontFamily: 
   fontSize: 16,
   color: colors.textDark,
},
titlesdetalle:{
    // fontFamily: 
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    paddingTop: 10,
 },
 titlesone:{
    fontSize: 16,
    fontWeight:'bold',
    color: colors.textDark,
    paddingHorizontal:10,
    paddingTop: 10,
},
titlespick:{
    fontSize: 14,
    color: colors.textDark,
    paddingHorizontal:10,
    paddingTop: 10,
},
btnContainerLogin:{
    marginTop: 10, 
    width: "90%"
},
btnLogin:{
    backgroundColor: "#6f4993",
}, 
iconRight:{
    color : "#c1c1c1",

},
detallebody:{

    height: 60,
    width: '90%',
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
},
dividobody:{
    flexDirection: "row",
    paddingTop: 20,
    height: 65,
    width: '90%',
    marginHorizontal: 20,
    borderWidth: 1,
},
totalbody:{
    borderWidth: 1,
    height: 65,
    width: '90%',
    marginHorizontal: 20,
    paddingTop: 20,
},
labelcorta:{
    marginTop: 10,
    fontSize: 16,
    color: colors.textDark,
    paddingHorizontal: 20,
},
titlesTitle:{
    // fontFamily: 
   fontSize: 35,
   color: colors.textDark,
},
searchWrapper:{
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
},
search:{
    flex: 1,
    marginLeft: 0,
    borderBottomColor: colors.textLight,
    borderBottomWidth: 1,


},
searchText:{
    fontSize: 14,
    marginBottom: 5,
    color: colors.textLight,

},
productoWrapper:{
    marginTop: 10,
},
Searchbar:{
    marginBottom: 20,
    backgroundColor: '#fff'
}, 
scrollview:{
    marginTop:10,
    marginBottom: 50,
},
categoriaWrapper:{
    paddingHorizontal: 20
},
categoriaWrapper1:{
    paddingHorizontal: 20,
    paddingVertical:10,
    alignItems: 'center', //Centered vertically
},
categoriaItemWrapper1:{
    marginTop: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: '#f5ca4b',
    borderRadius: 20,
    width: 120, 
    height: 70,
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    flex:1
},
categoriaItemWrapper2:{
    marginTop: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 120, 
    height: 70,
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    flex:1
},
textItem:{
    textAlign: 'center',
    fontSize: 10,
}


});

