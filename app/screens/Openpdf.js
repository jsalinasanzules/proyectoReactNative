'use strict';

import React,{
    Component
} from 'react';

import {
    StyleSheet,
    View
} from 'react-native';

import Openpdf from 'react-native-pdf-view';

export default class PDF extends Component {
    constructor(props) {
        super(props);
    }

    render(){
      <Openpdf ref={(pdf)=>{this.pdfView = pdf;}} src={"https://app.cotzul.com/Pedidos/pdf/pdf.pdf"} onLoadComplete = {(pageCount)=>{ this.pdfView.setNativeProps({ zoom: 1.5 }); }} style={styles.pdf}/>
    }
}
var styles = StyleSheet.create({
    pdf: {
        flex:1
    }
});