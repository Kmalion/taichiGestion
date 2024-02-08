import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OutflowService } from "../../service/outflowService";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Paginator } from "primereact/paginator";
import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import {
  deleteSerialFromProduct,
  getProductByReference,
} from "@/service/productService";
import { updateProductQuantity } from "@/service/productService";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ProgressBar } from "primereact/progressbar";

const OutflowTable = () => {
  const [commentDialogVisible, setCommentDialogVisible] = useState(false);
  const [selectedOutflowComment, setSelectedOutflowComment] = useState("");
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedOutflowToDelete, setSelectedOutflowToDelete] = useState(null);
  const [outflows, setOutflows] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [first, setFirst] = useState(0); // Para el paginador
  const [rows, setRows] = useState(10);
  const toast = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const isAdminPremium =
    session?.user?.role === "admin" || session?.user?.role === "premium";
  const isAdmin = session?.user?.role === "admin";

  const onRowExpand = (event) => {
    const expandedRow = { [`${event.data.salidaNo}`]: true };
    setExpandedRows((prevRows) => ({ ...prevRows, ...expandedRow }));
  };

  useEffect(() => {
    try {
      OutflowService.getOutflows().then((data) => {
        setOutflows(data);
        console.log("Data entrada:", data)
      });
    } catch (error) {
      console.error("Error al obtener las salidas:", error);
    }
  }, []);

  const onRowCollapse = (event) => {
    const expandedRow = { [`${event.data.salidaNo}`]: false };
    setExpandedRows((prevRows) => ({ ...prevRows, ...expandedRow }));
  };
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  const expandAll = () => {
    let _expandedRows = {};

    if (outflows && outflows.length > 0) {
      outflows.forEach((outflow) => {
        _expandedRows[`${outflow.salidaNo}`] = true;
      });
    }

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const showCommentDialog = (comment) => {
    setSelectedOutflowComment(comment);
    setCommentDialogVisible(true);
  };

  const hideCommentDialog = () => {
    setCommentDialogVisible(false);
  };

  const confirmDeleteOutflow = (outflow) => {
    setSelectedOutflowToDelete(outflow);
    setConfirmDialogVisible(true);
  };

  const hideConfirmDialog = () => {
    // Oculta el cuadro de diálogo de confirmación
    setConfirmDialogVisible(false);
  };

  const onConfirmDelete = () => {
    // Lógica para confirmar la eliminación
    if (selectedOutflowToDelete) {
      deleteOutflow(selectedOutflowToDelete);
    }

    // Oculta el cuadro de diálogo después de la acción
    hideConfirmDialog();
  };

  const deleteOutflow = async (outflow) => {
    try {
      setLoading(true);
      // Verifica si hay productos
      if (!outflow || !outflow.products || outflow.products.length === 0) {
        console.warn("La salida no tiene productos o es undefined.");
        // Puedes manejar esta situación según tus necesidades
      } else {
        // Itera sobre los productos de la salida
        for (const product of outflow.products) {
          // Verifica si hay seriales en el producto
          if (!product || !product.serials || product.serials.length === 0) {
            console.warn("El producto no tiene seriales o es undefined.");
            // Puedes manejar esta situación según tus necesidades
          } else {
            try {
              // Obtiene la cantidad anterior del producto
              const oldProduct = await getProductByReference(product.reference);
              const oldQuantity = oldProduct.quantity;

              // Calcula la nueva cantidad restando la cantidad de la salida
              const newQuantity = oldQuantity - product.quantity;

              for (const serial of product.serials) {
                try {
                  // Llama a la función para eliminar el serial, lote y ubicación
                  await deleteSerialFromProduct(
                    product.reference,
                    serial.serial,
                    product.lote
                  );

                  // Actualiza la cantidad de producto existente utilizando la nueva cantidad calculada
                  await updateProductQuantity(product.reference, newQuantity);
                } catch (error) {
                  // Puedes manejar el error según tus necesidades
                }
              }
            } catch (error) {
              console.error(
                "Error al obtener la información del producto:",
                error
              );
              // Puedes manejar el error según tus necesidades
            }
          }
        }
      }

      // Elimina la salida
      await OutflowService.deleteOutflow(outflow.salidaNo);

      // Muestra un mensaje de éxito con Toast
      toast.current.show({
        severity: "success",
        summary: "Salida eliminada",
        detail: `La salida No. ${outflow.salidaNo} ha sido eliminada exitosamente.`,
      });

      // Actualiza la lista de salidas después de la eliminación
      setOutflows((prevEntries) =>
        prevEntries.filter((e) => e.salidaNo !== outflow.salidaNo)
      );

      // Cierra el cuadro de diálogo de confirmación si se utiliza una referencia
      hideConfirmDialog();
    } catch (error) {
      console.error("Error al eliminar la salida:", error);

      // Muestra un mensaje de error con Toast si la eliminación falla
      toast.current.show({
        severity: "error",
        summary: "Error al eliminar la salida",
        detail:
          "Hubo un problema al eliminar la salida. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setLoading(false); // Oculta la barra de progreso al finalizar la acción, ya sea con éxito o error
    }
  };

  const commentColumn = (rowData) => (
    <Button
      icon="pi pi-eye"
      onClick={() => showCommentDialog(rowData.comment)}
      className="p-button-text p-button-rounded"
      disabled={!rowData.comment}
    />
  );

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag value={rowData.status} severity={getOutflowSeverity(rowData)}></Tag>
    );
  };

  const getOutflowSeverity = (outflow) => {
    switch (outflow.status) {
      case "APPROVED":
        return "success";

      case "PENDING":
        return "warning";

      case "REJECTED":
        return "danger";

      default:
        return null;
    }
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h5>Detalles de la Salida No. {data.salidaNo}</h5>
        {data.products && data.products.length > 0 ? (
          <DataTable value={data.products}>
            <Column field="reference" header="Referencia" sortable />
            <Column field="quantity" header="Cantidad" sortable />
            <Column
              field="price"
              header="Precio de Venta"
              sortable
              body={(rowData) => (
                <span>
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(rowData.price)}
                </span>
              )}
            />
            <Column
              field="serials"
              header="Serials"
              body={(rowData) => (
                <ul>
                  {rowData.serials.map((serialData, index) => (
                    <li key={index}>
                      <strong>Serial:</strong> {serialData.serial},{" "}
                      <strong>Status:</strong> {serialData.status}
                    </li>
                  ))}
                </ul>
              )}
            />
            <Column field="lote" header="Lote" sortable />
            

            {/* Agrega más columnas según las propiedades de tus productos */}
          </DataTable>
        ) : (
          <p>No hay productos asociados a esta salida.</p>
        )}
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap justify-content-between">
      <Button
        className="p-button-success"
        icon="pi pi-plus"
        label="Registrar Salida"
        onClick={() => router.push("/salidas/registro")}
        disabled={!isAdminPremium} // Deshabilita el botón si no es admin o premium
      />
      <Button
        icon="pi pi-minus"
        label="Colapsar Todo"
        onClick={collapseAll}
        text
      />
    </div>
  );

  const DocumentColumn = (data) => {
    const handleDownload = () => {
      // Verifica si la propiedad 'document' está definida en data y no es vacía
      if (data && data.document && data.document.trim() !== "") {
        // Redirige a la URL del documento para descargarlo
        window.location.href = data.document;
      } else {
        console.error("No se pudo encontrar la URL del documento o está vacía");
        // Puedes mostrar una notificación al usuario indicando que no se puede descargar el documento
      }
    };

    return (
      <Button
        icon="pi pi-download"
        onClick={handleDownload}
        className="p-button-text p-button-rounded"
        disabled={!data || !data.document || data.document.trim() === ""}
      />
    );
  };
  const renderProveedor = (proveedor) => {
    if (typeof proveedor === "string") {
      // Si es una cadena (valor anterior), simplemente muéstrala
      return proveedor;
    } else if (typeof proveedor === "object") {
      // Si es un objeto, probablemente un objeto con label y value
      return proveedor.label || "N/A"; // Puedes ajustar esto según tus necesidades
    } else {
      // Otros tipos o valores inesperados
      return "N/A";
    }
  };
  const renderCliente = (cliente) => {
    if (typeof cliente === "string") {
      // Si es una cadena (valor anterior), simplemente muéstrala
      return cliente;
    } else if (typeof cliente === "object") {
      // Si es un objeto, probablemente un objeto con label y value
      return cliente.label || "N/A"; // Puedes ajustar esto según tus necesidades
    } else {
      // Otros tipos o valores inesperados
      return "N/A";
    }
  };

  const deleteButtonColumn = (rowData) => (
    <Button
      icon="pi pi-trash"
      onClick={() => isAdmin && confirmDeleteOutflow(rowData)}
      className="p-button-text p-button-rounded p-button-danger"
      disabled={!isAdmin}
    />
  );

  const handleDownloadPDF = (outflowData) => {
    // Crea un nuevo objeto jsPDF
    const doc = new jsPDF({
      orientation: "landscape", // Establece la orientación a horizontal
    });

    // Primer título
    const firstTitle = `Taichi Holdings Salida No. ${outflowData.salidaNo}`;
    const firstTitleWidth =
      (doc.getStringUnitWidth(firstTitle) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const firstTitleX = (doc.internal.pageSize.width - firstTitleWidth) / 2;
    doc.text(firstTitle, firstTitleX, 5);

    // Ajusta la posición inicial de la segunda tabla
    const secondTableStartY = 38; // Establece la posición fija

    doc.autoTable({
      head: [
        [
          "Salida No.",
          "Fecha",
          "Proveedor",
          "Cliente",
          "Responsable",
          "Tipo",
          "Documento",
          "Comentario",
        ],
      ],
      body: [
        [
          outflowData.salidaNo || "",
          outflowData.fechaSalida || "",
          Array.isArray(outflowData.proveedor)
            ? outflowData.proveedor.map((item) => item.label).join(", ")
            : outflowData.proveedor?.label || "",
          Array.isArray(outflowData.cliente)
            ? outflowData.cliente.map((item) => item.label).join(", ")
            : outflowData.cliente?.label || "",
          outflowData.asigned_to?.label || "",
          outflowData.tipo || "",
          outflowData.document || "",
          outflowData.comment || "",
        ],
      ],
    });

    // Ajusta la posición vertical del segundo título
    const secondTitleY = secondTableStartY - 2; // Ajusta el valor de acuerdo a tu preferencia

    // Segundo título
    const secondTitle = "Productos en la Salida";
    const secondTitleWidth =
      (doc.getStringUnitWidth(secondTitle) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const secondTitleX = (doc.internal.pageSize.width - secondTitleWidth) / 2;
    doc.text(secondTitle, secondTitleX, secondTitleY);

    doc.autoTable({
      startY: secondTableStartY, // Usa la posición ajustada
      head: [
        [
          "Referencia",
          "Cantidad",
          "Precio",
          "Serials",
          "Lote",
          "Ubicación",
          "Fecha de Expiración",
        ],
      ],
      body: outflowData.products.map((product) => [
        product.reference,
        product.quantity,
        product.price,
        product.serials
          .map((serialData) => `${serialData.serial}, ${serialData.status}`)
          .join("\n"),
        product.lote,
        product.ubicacion,
        product.exp_date
          ? new Intl.DateTimeFormat("es-ES", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }).format(new Date(product.exp_date))
          : "",
      ]),
    });

    // Guarda el PDF o abre una nueva ventana para descargarlo
    doc.save(`Salida_${outflowData.salidaNo}.pdf`);
  };

  const downloadButtonColumn = (rowData) => (
    <Button
      icon="pi pi-download"
      onClick={() => handleDownloadPDF(rowData)}
      className="p-button-text p-button-rounded"
    />
  );

  return (
    <div className="card">
      {loading && (
        <ProgressBar
          mode="indeterminate"
          style={{ height: "6px" }}
        ></ProgressBar>
      )}
      <Toast ref={toast} />
      <DataTable
        value={outflows.slice(first, first + rows)} // Aplicar la paginación
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        onRowExpand={onRowExpand}
        onRowCollapse={onRowCollapse}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="salidaNo"
        header={header}
        tableStyle={{ minWidth: "60rem" }}
        rows={rows} // Número de filas a mostrar por página
        totalRecords={outflows.length} // Total de registros para el paginador
        onPageChange={onPageChange} // Manejador de cambio de página
      >
        <Column expander style={{ width: "3rem", fontSize: "5px" }} />
        <Column field="salidaNo" header="Salida No." sortable />
        <Column field="fechaSalida" header="Fecha" sortable />
        <Column field="proveedor" header="Proveedor" sortable body={(rowData) => renderProveedor(rowData.proveedor)} />
        <Column field="tipo" header="Tipo" sortable />
        <Column
          field="totalPrice"
          header="Precio Total"
          sortable
          body={(rowData) => (
            <span>
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "COP",
              }).format(rowData.totalPrice)}
            </span>
          )}
        />
        <Column field="totalQuantity" header="Cantidad Total" sortable />
        <Column
          field="cliente"
          header="Cliente"
          sortable
          body={(rowData) => renderCliente(rowData.cliente)}
        />
        <Column
          field="document"
          header="Documento"
          body={DocumentColumn}
          sortable
        />
        <Column
          field="comment"
          header="Comentario"
          body={commentColumn}
          sortable
        />
        <Column
          field="asigned_to"
          header="Responsable"
          sortable
          body={(rowData) => rowData.asigned_to.label}
        />
        <Column field="created_by" header="Creado por" sortable />
        <Column body={downloadButtonColumn} />
        <Column body={deleteButtonColumn} />
      </DataTable>
      <Dialog
        visible={confirmDialogVisible}
        onHide={hideConfirmDialog}
        header="Confirmar Eliminación"
        modal
        footer={
          <div>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={hideConfirmDialog}
              className="p-button-text"
            />
            <Button
              label="Confirmar"
              icon="pi pi-check"
              onClick={onConfirmDelete}
              autoFocus
            />
          </div>
        }
      >
        <div>
          ¿Estás seguro de que deseas eliminar la salida No.{" "}
          {selectedOutflowToDelete?.salidaNo}?
        </div>
      </Dialog>
      <Paginator
        first={first}
        rows={rows}
        totalRecords={outflows.length}
        onPageChange={onPageChange}
      />
      <Dialog
        visible={commentDialogVisible}
        onHide={hideCommentDialog}
        header="Comentario"
        modal
        style={{ width: "30vw" }}
      >
        <div>{selectedOutflowComment}</div>
      </Dialog>
    </div>
  );
};

export default OutflowTable;
