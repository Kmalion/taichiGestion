'use client'

import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { useSession } from 'next-auth/react';
import axios from 'axios';




export default function EntradasTable() {
    let emptyProduct = {
        name: '',
        reference: '',
        image: null,
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        serials: [],
        brand: '',  // Agregado el campo 'brand'
        rating: 1,
        inventoryStatus: 'activo',
        owner: '',
        created: ''
    };


    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product,     setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const { data: session } = useSession();
    const [filteredProducts, setFilteredProducts] = useState(null); 

   
    

    const userEmail = session?.user?.email;
    
    
    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products/getProducts');
            console.log('Products fetched:', response.data);
            setProducts(response.data);
            filterProducts(typeof globalFilter === 'string' ? globalFilter : '');
        } catch (error) {
            console.error('Error fetching products:', error.message);
        }
    };
    
    useEffect(() => {
        fetchProducts();
    }, [session, product]);

      const filterProducts = (value) => {
        if (!products) {
            // Manejar el caso donde products es null
            return;
        }
    
        const filtered = products.filter((product) =>
            product.name && product.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered || []);
    };
    

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    
    const saveProduct = async () => {
        setSubmitted(true);
    
        if (product.name.trim()) {
            try {
                // Obtener la fecha y hora actual en formato dia/mes/ano y hora
                const currentDate = new Date();
                const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    
                const response = await fetch('/api/products/createProduct', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...product,
                        owner: session?.user?.email,
                        created: formattedDate, // Incluir la fecha y hora actual en la variable created
                    }),
                });
    
                const responseData = await response.json();
    
                if (response.ok) {
                    setProduct((prevProduct) => ({ ...prevProduct, owner: session?.user?.email }));
    
                    console.log('Owner: ', product.owner);
    
                    console.log('Producto guardado en el backend:', responseData);
    
                    toast.current.show({
                        severity: 'success',
                        summary: 'Exitoso',
                        detail: 'Producto guardado',
                        life: 3000,
                    });

                    window.location.href = '/entradas';
                } else {
                    console.error('Error al guardar el producto en el backend:', responseData);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al guardar el producto',
                        life: 3000,
                    });
                }
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al procesar la solicitud',
                    life: 3000,
                });
            }
    
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };
    

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);

        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Exitoso !', detail: 'Producto Borrado', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

 

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));

        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        // Verificar si el campo es 'serials' para manejar el array
        if (name === 'serials') {
            _product[name] = val.split(',').map((s) => s.trim());
        } else {
            _product[name] = val;
        }

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Registrar entrada" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Borrar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'activo':
                return 'success';

            case 'bajostock':
                return 'warning';

            case 'agotado':
                return 'danger';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Historial de entradas</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
    type="search"
    onInput={(e) => {
        setGlobalFilter(e.target.value);
        filterProducts(e.target.value);
    }}
    placeholder="Buscar..."
/>

            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );
    const serialsBodyTemplate = (rowData) => {
        // Verificar si rowData.serial es definido antes de intentar map
        if (rowData.serial && Array.isArray(rowData.serial)) {
            return (
                <ul>
                    {rowData.serial.map((serialItem, index) => (
                        <li key={index}>{serialItem}</li>
                    ))}
                </ul>
            );
        } else {
            return null; // O muestra algún mensaje o contenido alternativo si no hay datos serial
        }
    };
    console.log('Datos para el DataTable:', globalFilter ? filteredProducts : products);
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable
                    ref={dt}
                    value={globalFilter ? filteredProducts : products}
                    selection={selectedProducts}
                    onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="reference" header="Referencia" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="name" header="Nombre" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="description" header="Descripcion" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="brand" header="Marca" sortable style={{ minWidth: '12rem' }}></Column> 
                    <Column field="serial" header="Serial" sortable style={{ minWidth: '12rem' }} body={serialsBodyTemplate}></Column>
                    <Column field="image" header="Imágen" body={imageBodyTemplate}></Column>
                    <Column field="quantity" header="Cantidad" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="price" header="Precio" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="category" header="Categoria" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="inventoryStatus" header="Estado" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog
                visible={productDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Creación de nuevo producto"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}
            >
                {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre
                    </label>
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">El nombre es requerido</small>}
                </div>
                <div className="field">
                    <label htmlFor="reference" className="font-bold">
                        Referencia
                    </label>
                    <InputText id="reference" value={product.reference} onChange={(e) => onInputChange(e, 'reference')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.reference })} />
                    {submitted && !product.reference && <small className="p-error">La referencia es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="brand" className="font-bold">
                        Marca
                    </label>
                    <InputText
                        id="brand"
                        value={product.brand}
                        onChange={(e) => onInputChange(e, 'brand')}
                        required
                        autoFocus
                        className={classNames({
                            'p-invalid': submitted && !product.brand,
                        })}
                    />
                    {submitted && !product.brand && <small className="p-error">La marca es requerida</small>}
                </div>
                <div className="field">
                    <label htmlFor="serials" className="font-bold">
                        Serial
                    </label>
                    <InputText id="serials" value={product.serials} onChange={(e) => onInputChange(e, 'serials')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.serials })} />
                    {submitted && !product.serials && <small className="p-error">El serial es requerido</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Descripcion
                    </label>
                    <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                    {submitted && !product.name && <small className="p-error">La descripcion es requerida</small>}
                </div>

                <div className="field">
                    <label className="mb-3 font-bold">Categoria</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="accessorios" onChange={onCategoryChange} checked={product.category === 'accessorios'} />
                            <label htmlFor="category1">Accesorios</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="herramientas" onChange={onCategoryChange} checked={product.category === 'herramientas'} />
                            <label htmlFor="category2">Herramientas</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="equipos" onChange={onCategoryChange} checked={product.category === 'equipos'} />
                            <label htmlFor="category3">Equipos</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="repuestos" onChange={onCategoryChange} checked={product.category === 'repuestos'} />
                            <label htmlFor="category4">Repuestos</label>
                        </div>
                        
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Precio
                        </label>
                        <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                        {submitted && !product.name && <small className="p-error">El precio es requerido</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            Cantidad
                        </label>
                        <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                        {submitted && !product.name && <small className="p-error">La cantidad es requerida</small>}
                    </div>
                </div>
                <div className="card">
                        <FileUpload
                            name="demo[]"
                            url={'/api/upload'}
                            multiple
                            accept="image/*"
                            maxFileSize={1000000}
                            emptyTemplate={<p className="m-0">Arrastre la imagen para subirla</p>}
                            chooseLabel="Escoger"
                            uploadLabel="Subir"
                            cancelLabel="Cancelar"
                        />
                    </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmacion" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            esta seguro de que quiere borrar <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Esta seguro de que quiere borrar los productos seleccionados?</span>}
                </div>
            </Dialog>
        </div>
    );
}
