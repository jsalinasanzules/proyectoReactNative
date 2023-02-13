import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from "react-native";
import { colors } from "react-native-elements";
import Feather from 'react-native-vector-icons/Feather';
import DataCliente from '../data/DataCliente'
import {SearchBar, ListItem, Icon} from "react-native-elements"

export default function Clientes(){
    const [search, setSearch] = useState("");
    return(
        <View style={styles.container}>
            <View style={styles.titlesWrapper}>
             <Text style={styles.titlesSubtitle}>Clientes</Text>
            </View>
            {/*Search*/}
            <View style={styles.searchWrapper}>
                
                <View style={styles.search}>
                <SearchBar
                    placeholder="Buscar por cliente"
                    onChangeText={(e)=> setSearch(e)}
                    containerStyle = {StyleSheet.Searchbar}
                    value= {search}
                    />
                </View>
            </View>
            {/*Familias*/}
            <ScrollView style={styles.scrollview}>
            <View style={styles.productoWrapper}>
               <DataCliente texto={search}  />
            </View>
            </ScrollView>
        </View>
    );
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
     },
titlesTitle:{
    // fontFamily: 
   fontSize: 32,
   color: colors.textDark,
},
searchWrapper:{
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 30,
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
    marginTop: 30,
},
Searchbar:{
    marginBottom: 20,
    backgroundColor: '#fff'
},
scrollview:{
    marginTop:10,
    marginBottom: 50,
}


});