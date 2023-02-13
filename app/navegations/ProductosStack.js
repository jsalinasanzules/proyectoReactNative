import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Productos from "../screens/Productos";
import NuevoPed from "../screens/NuevoPed";
import EditaPed from "../screens/EditaPed";
import Perfil from "../screens/Perfil";

const Stack = createStackNavigator();
export default function ProductosStack(){
    
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name="productos"
            component={Productos}
            options={{title:"Pedidos Vendedor"}} />
            <Stack.Screen 
            name="nuevoped"
            component={NuevoPed}
            options={{title:"Nuevo Pedido"}} />
            <Stack.Screen 
            name="editapedido"
            component={EditaPed}
            options={{title:"Editar Pedido"}} />
        </Stack.Navigator>
        
    );
}