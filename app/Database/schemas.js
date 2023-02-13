export const SupportedTypes = {
    INTEGER: {
        value: 'INTEGER',
        type: 'INTEGER',
        default_value: null
    },
    LONG: {
        value: 'LONG',
        type: 'INTEGER',
        default_value: null
    },
    DOUBLE: {
        value: 'DOUBLE',
        type: 'REAL',
        default_value: null
    },
    TEXT: {
        value: 'TEXT',
        type: 'TEXT',
        default_value: null
    },
    BOOLEAN: {
        value: 'BOOLEAN',
        type: 'INTEGER',
        default_value: null
    },
    DATETIME: {
        value: 'DATETIME',
        type: 'TEXT',
        default_value: null
    },
    SYNC_STATUS: {
        value: 'STATUS',
        type: 'TEXT',
        default_value: null
    },
    JSON: {
        value: 'JSON',
        type: 'TEXT',
        default_value: null
    },
};

export const Tables = {
    Producto: {
        pr_codigo: {
            type: SupportedTypes.INTEGER,
            primary_key: true,
            default_value: null,
        },
        pr_codprod: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        pr_referencia: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        pr_idfamilia: {
            type: SupportedTypes.INTEGER,
            primary_key: false,
            default_value: null,
        },
        pr_idnivel1: {
            type: SupportedTypes.INTEGER,
            primary_key: false,
            default_value: null,
        },
        pr_idnivel2: {
            type: SupportedTypes.INTEGER,
            primary_key: false,
            default_value: null,
        },
        pr_familia: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        pr_nivel1: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        pr_nivel2: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        pr_pvp: {
            type: SupportedTypes.DOUBLE,
            primary_key: false,
            default_value: null,
        },
        pr_preciosub: {
            type: SupportedTypes.DOUBLE,
            primary_key: false,
            default_value: null,
        },
        pr_contado: {
            type: SupportedTypes.DOUBLE,
            primary_key: false,
            default_value: null,
        },
        pr_credito: {
            type: SupportedTypes.DOUBLE,
            primary_key: false,
            default_value: null,
        },
        pr_stock: {
            type: SupportedTypes.INTEGER,
            primary_key: false,
            default_value: null,
        },
    },
    Catalogo: {
        ct_codigo: {
            type: SupportedTypes.INTEGER,
            primary_key: true,
            default_value: null,
        },
        ct_idcliente: {
            type: SupportedTypes.INTEGER,
            primary_key: false,
            default_value: null,
        },
        ct_nomcata: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        ct_fecha: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        ct_idvendedor: {
            type: SupportedTypes.INTEGER,
            primary_key: false,
            default_value: null,
        }
    },
    Cliente: {
        cn_codigo: {
            type: SupportedTypes.INTEGER,
            primary_key: true,
            default_value: null,
        },
        cn_cedula: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        cn_tipoid: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        cn_cliente: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        cn_telefono: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        cn_direccion: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        cn_correo: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        }
    },
    Catproducto: {
        cd_codigo: {
            type: SupportedTypes.INTEGER,
            primary_key: true,
            default_value: null,
        },
        cd_idcatalogo: {
            type: SupportedTypes.INTEGER,
            primary_key: false,
            default_value: null,
        },
        cd_idproducto: {
            type: SupportedTypes.INTEGER,
            primary_key: false,
            default_value: null,
        }
    },
};