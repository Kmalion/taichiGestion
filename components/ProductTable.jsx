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
import '../app/styles/styles.css'
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FilterMatchMode, FilterOperator } from 'primereact/api';



export default function EntradasTable() {
    let emptyProduct = {
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


    const [products, setProducts] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const { data: session } = useSession();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [serialsDialog, setSerialsDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: '', matchMode: FilterMatchMode.CONTAINS },
        reference: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
        // Agrega más filtros si es necesario para otras columnas
    });

    const referenceColumn = useRef(null);

    const exportPDF = () => {
        const unit = 'pt';
        const size = 'A4'; // Use A1, A2, A3, A4, etc.
        const orientation = 'landscape'; // portrait or landscape
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);
        doc.text('Productos en stock', 40, 40);

        const headers = [['Referencia', 'Descripción', 'Marca', 'Serial', 'Cantidad', 'Costo', 'Categoría', 'Estado', 'Creado por']];

        const data = products.map(product => [
            product.reference,
            product.description,
            product.brand,
            product.serials.join(', '),
            product.quantity,
            formatCurrency(product.price),
            product.category,
            product.inventoryStatus,
            product.owner
        ]);

        autoTable(doc, {
            head: headers,
            body: data,
            startY: 50,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 5, textColor: [50, 50, 50] },
            columnStyles: { 0: { cellWidth: 40 } },
        });

        doc.save('Taichi productos.pdf');
    };

    const exportExcel = () => {
        const headers = [['Referencia', 'Descripción', 'Marca', 'Serial', 'Imagen', 'Cantidad', 'Costo', 'Categoría', 'Estado', 'Creado por']];
        const data = products.map(product => [
            product.reference,
            product.description,
            product.brand,
            product.serials.join(', '),
            product.image,
            product.quantity,
            formatCurrency(product.price),
            product.category,
            product.inventoryStatus,
            product.owner
        ]);

        const ws = XLSX.utils.aoa_to_sheet([].concat(headers, data));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Productos');
        XLSX.writeFile(wb, 'productos.xlsx');
    };

    const onFileChange = (e) => {
        const file = e.files && e.files.length > 0 ? e.files[0] : null;
        setSelectedFile(file);
    };

    const hideSerialsDialog = () => {
        setSerialsDialog(false);
    };
    const serialsDialogFooter = (
        <Button label="Cerrar" icon="pi pi-check" onClick={hideSerialsDialog} />
    );
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
    const filterProducts = (value) => {
        if (!Array.isArray(products)) {
            return;
        }

        const filtered = products.filter((product) =>
            product.reference && product.reference.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (typeof globalFilter === 'string') {
            filterProducts(globalFilter);
        }
    }, [globalFilter, products]);



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

        if (product.reference.trim()) {
            try {
                let imageUrl = product.image; // Usa la URL de la imagen existente si está disponible
                const currentDate = new Date();
                const formattedDate = currentDate.toISOString();
                if (selectedFile) {
                    // Si se selecciona un nuevo archivo, súbelo
                    const formData = new FormData();
                    formData.append('file', selectedFile);

                    const uploadResponse = await axios.post('/api/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    imageUrl = uploadResponse.data.url;
                }

                const updatedProduct = {
                    ...product,
                    owner: session?.user?.email,
                    created: formattedDate,
                    image: imageUrl,
                    inventoryStatus: product.quantity === 0 ? 'agotado' : 'activo',
                };

                let response;
                if (product.idp) {
                    // Actualizar producto existente
                    response = await axios.put(`/api/products/updateProduct/${product.idp}`, updatedProduct);
                } else {
                    // Crear nuevo producto
                    const productId = uuidv4();
                    response = await axios.post('/api/products/createProduct', {
                        ...updatedProduct,
                        idp: productId,
                    });
                }

                const responseData = response.data;

                if (response.status === 200) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Exitoso',
                        detail: 'Producto guardado',
                        life: 3000,
                    });

                    // Recargar productos después de actualizar o crear
                    fetchProducts();
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



    const deleteProduct = async () => {
        try {
            console.log('Valor de product.idp:', product.idp);

            // Concatena la URL
            const deleteProductUrl = `/api/products/deleteProduct/${product.idp}`;
            console.log('URL delete:', deleteProductUrl);

            // Usa fetch con la URL concatenada
            const response = await fetch(deleteProductUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Eliminación exitosa
                const updatedProducts = products.filter((val) => val.idp !== product.idp);
                setProducts(updatedProducts);
                setDeleteProductDialog(false);
                setProduct(emptyProduct);
                toast.current.show({ severity: 'success', summary: 'Exitoso !', detail: 'Producto Borrado', life: 3000 });
            } else {
                console.error('Error al eliminar el producto:', await response.text());
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al eliminar el producto',
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
    };


    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
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

    const onInputChange = (e, reference) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        // Verificar si el campo es 'serials' para manejar el array
        if (reference === 'serials') {
            _product[reference] = val.split(',').map((s) => s.trim());
        } else {
            _product[reference] = val;
        }

        setProduct(_product);
    };

    const onInputNumberChange = (e, reference) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${reference}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        const isAdminOrPremium = session?.user?.role && (session.user.role.includes('admin') || session.user.role.includes('premium'));

        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="Crear producto"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={openNew}
                    disabled={!isAdminOrPremium} // Deshabilitar el botón si no es admin o premium
                />
                {/* Otros botones o elementos */}
            </div>
        )
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="Exportar"
                    icon="pi pi-upload"
                    className="p-button-help p-mr-3 p-p-1"
                    onClick={exportCSV}
                />
                <Button
                    label="Exportar PDF"
                    icon="pi pi-file-pdf"
                    className="p-button-warning p-mr-2 p-p-1"
                    onClick={exportPDF}
                />
                <Button
                    label="Exportar Excel"
                    icon="pi pi-file-excel"
                    className="p-button-success p-p-1"
                    onClick={exportExcel}
                />
            </div>
        );
    };


    const imageBodyTemplate = (rowData) => {
        return (
            <div className="zoomable-image">
                <img src={`${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />
            </div>
        );
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

        const isAdminOrPremium = session?.user?.role && (session.user.role.includes('admin') || session.user.role.includes('premium'));
        return (
            <React.Fragment>
                {isAdminOrPremium && (
                    <>
                        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
                    </>
                )}
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
            <h4 className="m-0">Productos en stock</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => {
                        const inputValue = e.target.value || '';
                        setGlobalFilter(inputValue);
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
        return (
            <React.Fragment>
                <Button icon="pi pi-search" onClick={() => showSerialsDialog(rowData)} />
            </React.Fragment>
        );
    };
    const showSerialsDialog = (rowData) => {
        setProduct(rowData);
        setSerialsDialog(true);
    };

    const onFilterChange = (e) => {
        const newFilters = { ...filters };
        newFilters[e.field] = { value: e.value, matchMode: e.matchMode };
        setFilters(newFilters);
    };
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
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
                    globalFilter={globalFilter}
                    header={header}
                    filters={filters}
                    onFilter={(e) => onFilterChange(e)}
                >
                    <Column field="reference" header="Referencia" sortable style={{ minWidth: '12rem' }} ref={referenceColumn} onFilter={(e) => onReferenceFilterChange(e.target.value)}></Column>
                    <Column field="description" header="Descripcion" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="brand" header="Marca" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="serials" header="Serial" sortable style={{ minWidth: '12rem' }} body={serialsBodyTemplate}></Column>
                    <Column field="image" header="Imágen" body={imageBodyTemplate}></Column>
                    <Column field="quantity" header="Cantidad" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="price" header="Costo" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="category" header="Categoria" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="inventoryStatus" header="Estado" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="owner" header="Creado por" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
                <Dialog
                    visible={serialsDialog}
                    style={{ width: '30rem' }}
                    header={`Seriales de ${product.reference}`}
                    modal
                    onHide={hideSerialsDialog}
                    footer={serialsDialogFooter}
                >
                    {product.serials && Array.isArray(product.serials) && product.serials.length > 0 ? (
                        <ul>
                            {product.serials.map((serialItem, index) => (
                                <li key={index}>{serialItem}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay seriales disponibles para este producto.</p>
                    )}
                </Dialog>
            </div>

            <Dialog
                visible={productDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Registrar producto"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}
            >
                {product.image && <img src={`${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />}

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
                {/* 
                
                Serial
                
                <div className="field">
                    <label htmlFor="serials" className="font-bold">
                        Serial
                    </label>
                    <InputText id="serials" value={product.serials} onChange={(e) => onInputChange(e, 'serials')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.serials })} />

                </div> */}
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Descripcion
                    </label>
                    <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                    {submitted && !product.description && <small className="p-error">La descripcion es requerida</small>}
                </div>

                <div className="field">
                    <label className="mb-3 font-bold">Categoria</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessorios" onChange={onCategoryChange} checked={product.category === 'Accessorios'} />
                            <label htmlFor="category1">Accesorios</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Herramientas" onChange={onCategoryChange} checked={product.category === 'Herramientas'} />
                            <label htmlFor="category2">Herramientas</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Equipos" onChange={onCategoryChange} checked={product.category === 'Equipos'} />
                            <label htmlFor="category3">Equipos</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Repuestos" onChange={onCategoryChange} checked={product.category === 'Repuestos'} />
                            <label htmlFor="category4">Repuestos</label>
                        </div>

                    </div>
                </div>

                {/*  Cantidad y precio
                
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Precio
                        </label>
                        <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                        {submitted && !product.price && <small className="p-error">El precio es requerido</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            Cantidad
                        </label>
                        <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                        {submitted && !product.quantity && <small className="p-error">La cantidad es requerida</small>}
                    </div>
                </div> */}
                <div className="card">
                    <FileUpload
                        name="file" // Asegúrate de que el nombre coincida con lo que esperas en el backend
                        url={'/api/upload'}
                        multiple
                        accept="image/*"
                        maxFileSize={1000000}
                        emptyTemplate={<p className="m-0">Arrastre la imagen para subirla</p>}
                        chooseLabel="Escoger"
                        uploadLabel="Subir"
                        cancelLabel="Cancelar"
                        onSelect={onFileChange}
                    />

                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmacion" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            esta seguro de que quiere borrar <b>{product.reference}</b>?
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
