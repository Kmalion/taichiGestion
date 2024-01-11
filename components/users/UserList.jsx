'use client '
// Importa useState, useEffect, useRef y axios
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast'; // Agregado Toast
import { useSession } from 'next-auth/react';
import '@/app/styles/styles.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [layout, setLayout] = useState('grid');
  const { data: session } = useSession();
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const toast = useRef(null); // Agregada referencia de Toast

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/getUsers');

        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteConfirmation(true);
  };

  const confirmDeleteUser = async () => {
    try {
      // Realiza una solicitud DELETE a la API con el email del usuario
      const response = await axios.delete(`/api/users/deleteUser/${selectedUser.email}`);
      
      if (response.status === 200) {
        console.log('Usuario eliminado con éxito:', response.data.deletedUser);
        // Actualiza la lista de usuarios después de la eliminación
        setUsers(users.filter(user => user._id !== selectedUser._id));
      } else {
        console.error('Error al eliminar usuario:', response.data.error);
        // Maneja el error, muestra un mensaje al usuario, etc.
      }
    } catch (error) {
      console.error('Error en la solicitud DELETE:', error);
      // Maneja el error, muestra un mensaje al usuario, etc.
    } finally {
      // Cierra el diálogo de confirmación después de realizar la operación
      setDeleteConfirmation(false);
      setSelectedUser(null);
    }
  };
  
  const handleEditUser = (user) => {
    setEditedUser({ ...user });
    setEditDialogVisible(true);
  };

  const showToast = (severity, detail) => {
    toast.current.show({ severity, summary: severity === 'success' ? 'Éxito' : 'Error', detail, life: 5000 });
  };

  const saveEditedUser = async () => {
    try {
      const response = await axios.put(`/api/users/updateUser/${editedUser.email}`, editedUser);

      if (response.status === 200) {
        setUsers(users.map((user) => (user._id === editedUser._id ? editedUser : user)));
        setEditDialogVisible(false);
        setEditedUser(null);
        showToast('success', 'Usuario actualizado con éxito');
      } else {
        console.error('Error al actualizar usuario:', response.data.error);
        showToast('error', 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
      showToast('error', 'Error al actualizar usuario');
    }
  };

  const itemTemplate = (user) => (
    <div key={user._id} className="p-col-12 p-md-4 p-lg-3">
      <Card title={`${user.nombre} ${user.apellido}`} className="custom-card">
        <div className="circular-image-container zoomable-image">
          <img
            src={user.foto ? user.foto : '/img/generic-avatar.png'}
            alt={`${user.nombre} ${user.apellido}`}
            className="circular-image"
          />
        </div>
        <div className="user-info">
          <div className="info-label">Email:</div>
          <div className="info-value">{user.email}</div>
        </div>
        <div className="user-info">
          <div className="info-label">Cargo:</div>
          <div className="info-value">{user.cargo}</div>
        </div>
        <div className="user-info">
          <div className="info-label">Role:</div>
          <div className="info-value">{user.role}</div>
        </div>
        {/* Agrega más campos según tu modelo de usuario */}
        <div className="user-actions">
          {session && session.user.role === 'admin' && (
            <>
              <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-sm ml-2"
                onClick={() => handleDeleteUser(user)}
              />
              <Button
                icon="pi pi-pencil"
                className="p-button-primary p-button-sm ml-2"
                onClick={() => handleEditUser(user)}
              />
            </>
          )}
        </div>
      </Card>
    </div>
  );

  const onLayoutChange = (event) => {
    setLayout(event.value);
  };

  return (
    <div>
      <h2 className='text-center pagetitle'>Usuarios</h2>
      <div className='container'>
        <DataView value={users} itemTemplate={itemTemplate} layout={layout} rows={9}
          paginator position="both" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          rowsPerPageOptions={[3, 6, 9]}
        />
        <DataViewLayoutOptions layout={layout} onChange={onLayoutChange} />
      </div>

      {/* Diálogo de confirmación para eliminar usuario */}
      <Dialog
        visible={deleteConfirmation}
        onHide={() => setDeleteConfirmation(false)}
        breakpoints={{'960px': '75vw', '640px': '100vw'}}
        header="Confirmar Eliminación"
        modal
        footer={(
          <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setDeleteConfirmation(false)} className="p-button-text" />
            <Button label="Eliminar" icon="pi pi-trash" onClick={confirmDeleteUser} autoFocus />
          </div>
        )}
      >
        <div>
          ¿Estás seguro de que deseas eliminar al usuario {selectedUser && selectedUser.nombre} {selectedUser && selectedUser.apellido}?
        </div>
      </Dialog>

      {/* Diálogo de edición de usuario */}
      <Dialog
        visible={editDialogVisible}
        onHide={() => {
          setEditDialogVisible(false);
          setEditedUser(null);
        }}
        breakpoints={{ '960px': '75vw', '640px': '100vw' }}
        header="Editar Usuario"
        modal
        footer={(
          <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setEditDialogVisible(false)} className="p-button-text" />
            <Button label="Guardar" icon="pi pi-check" onClick={saveEditedUser} autoFocus />
          </div>
        )}
      >
        {editedUser && (
          <div>
            <div className="p-field">
              <label htmlFor="nombre">Nombre:</label>
              <InputText id="nombre" value={editedUser.nombre} onChange={(e) => setEditedUser({ ...editedUser, nombre: e.target.value })} />
            </div>
            <div className="p-field">
              <label htmlFor="apellido">Apellido:</label>
              <InputText id="apellido" value={editedUser.apellido} onChange={(e) => setEditedUser({ ...editedUser, apellido: e.target.value })} />
            </div>
            <div className="p-field">
              <label htmlFor="cargo">Cargo:</label>
              <InputText id="cargo" value={editedUser.cargo} onChange={(e) => setEditedUser({ ...editedUser, cargo: e.target.value })} />
            </div>
            <div className="p-field">
              <label htmlFor="role">Rol:</label>
              <Dropdown
                id="role"
                name="role"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleccione su rol"
                value={editedUser.role}
                options={[
                  { label: "User", value: "user" },
                  { label: "Admin", value: "admin" },
                  { label: "Premium", value: "premium" },
                ]}
                onChange={(e) => setEditedUser({ ...editedUser, role: e.value })}
              />
            </div>
          </div>
        )}
      </Dialog>

      {/* Toast para mostrar mensajes de éxito/error */}
      <Toast ref={toast} />

    </div>
  );
};

export default UsersList;
