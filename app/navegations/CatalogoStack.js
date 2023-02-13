import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Catalogo from "../screens/Catalogo";
import SCatalogo from "../productos/SCatalogo";
import Producto from "../productos/Producto";

const Stack = createStackNavigator();
export default function CatalogoStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name="catalogos"
            component={Catalogo}
            options={{title:"Listado de Catálogos"}} />
            <Stack.Screen 
            name="scatalogo"
            component={SCatalogo}
            options={{title:"Catálogo seleccionado"}} />
            <Stack.Screen 
            name="producto"
            component={Producto}
            options={{title:"Detalle producto"}} />
        </Stack.Navigator>
    );
}