# Modal Component - Guía de Uso

## 📋 Descripción

Componente modal reutilizable y altamente personalizable para toda la aplicación. Incluye soporte para diferentes tamaños, tipos, animaciones, y manejo programático a través de un servicio.

## 🚀 Características

- ✅ **Totalmente personalizable**: tamaño, colores, botones, contenido
- ✅ **Responsive**: se adapta a diferentes pantallas
- ✅ **Animaciones suaves**: transiciones CSS3
- ✅ **Accesible**: soporte para lectores de pantalla
- ✅ **Programático**: control mediante servicio
- ✅ **Tipos predefinidos**: confirmación, alerta, loading
- ✅ **Slots de contenido**: header, body, footer personalizables

## 📦 Instalación

El componente ya está disponible en `shared/components/modal/`.

## 🔧 Uso Básico

### 1. Importar el componente

```typescript
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  // ...
  imports: [ModalComponent],
  // ...
})
```

### 2. Uso en template

```html
<app-modal
  [isOpen]="showModal"
  [config]="modalConfig"
  [buttons]="modalButtons"
  (closed)="onModalClosed()"
>
  <div>
    <h4>Contenido del modal</h4>
    <p>Este es el contenido principal del modal.</p>
  </div>
</app-modal>
```

### 3. Configuración en el componente

```typescript
export class MyComponent {
  showModal = false;
  
  modalConfig: ModalConfig = {
    title: 'Mi Modal',
    subtitle: 'Subtítulo opcional',
    size: 'md',
    showHeader: true,
    showFooter: true,
    closable: true
  };

  modalButtons: ModalButton[] = [
    {
      label: 'Cancelar',
      type: 'secondary',
      action: () => this.closeModal()
    },
    {
      label: 'Guardar',
      type: 'primary',
      action: () => this.saveData()
    }
  ];

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onModalClosed() {
    console.log('Modal cerrado');
  }
}
```

## 🎛️ Configuración Avanzada

### ModalConfig Interface

```typescript
interface ModalConfig {
  title?: string;           // Título del modal
  subtitle?: string;        // Subtítulo
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';  // Tamaño
  showHeader?: boolean;     // Mostrar header
  showFooter?: boolean;     // Mostrar footer
  closable?: boolean;       // Permitir cerrar
  backdrop?: boolean;       // Mostrar backdrop
  centered?: boolean;       // Centrar verticalmente
  scrollable?: boolean;     // Contenido scrollable
  animation?: boolean;      // Animaciones
  customClass?: string;     // Clases CSS personalizadas
  headerClass?: string;     // Clases para header
  bodyClass?: string;       // Clases para body
  footerClass?: string;     // Clases para footer
}
```

### ModalButton Interface

```typescript
interface ModalButton {
  label: string;                                    // Texto del botón
  action: () => void;                              // Función a ejecutar
  type?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';  // Tipo de botón
  disabled?: boolean;                              // Deshabilitado
  loading?: boolean;                               // Estado de carga
  icon?: string;                                   // Icono (clase CSS)
  customClass?: string;                            // Clases personalizadas
}
```

## 🔄 Uso con Servicio (Programático)

### 1. Configurar el servicio

```typescript
import { ModalService } from '../../shared/components/modal/modal.service';

@Component({
  // ...
})
export class AppComponent implements OnInit {
  constructor(
    private modalService: ModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    // Configurar el contenedor para los modales
    this.modalService.setViewContainer(this.viewContainerRef);
  }
}
```

### 2. Modal de confirmación

```typescript
async confirmDelete() {
  const confirmed = await this.modalService.confirm({
    title: 'Eliminar cliente',
    message: '¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    type: 'danger'
  });

  if (confirmed) {
    // Proceder con la eliminación
    this.deleteCustomer();
  }
}
```

### 3. Modal de alerta

```typescript
showSuccessAlert() {
  this.modalService.alert(
    'Cliente creado exitosamente',
    'Éxito',
    'success'
  );
}

showErrorAlert() {
  this.modalService.alert(
    'Error al procesar la solicitud. Intenta nuevamente.',
    'Error',
    'danger'
  );
}
```

### 4. Modal de loading

```typescript
async saveData() {
  const loadingModal = this.modalService.loading('Guardando datos...');
  
  try {
    await this.apiService.saveCustomer(this.customerData);
    this.modalService.closeModal(loadingModal);
    this.modalService.alert('Datos guardados exitosamente', 'Éxito', 'success');
  } catch (error) {
    this.modalService.closeModal(loadingModal);
    this.modalService.alert('Error al guardar los datos', 'Error', 'danger');
  }
}
```

### 5. Modal personalizado

```typescript
openCustomModal() {
  this.modalService.open({
    config: {
      title: 'Modal Personalizado',
      size: 'lg',
      showHeader: true,
      showFooter: true
    },
    content: `
      <div class="space-y-4">
        <p>Contenido HTML personalizado</p>
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-blue-800">Información importante</p>
        </div>
      </div>
    `,
    buttons: [
      {
        label: 'Cerrar',
        type: 'secondary',
        action: () => {
          // El modal se cierra automáticamente
        }
      }
    ]
  });
}
```

## 🎨 Slots de Contenido

### Header personalizado

```html
<app-modal [isOpen]="true" [config]="config">
  <div slot="header" class="flex items-center">
    <i class="fas fa-user mr-2"></i>
    <span>Header personalizado</span>
  </div>
  
  <!-- Contenido principal -->
  <p>Contenido del modal...</p>
</app-modal>
```

### Footer personalizado

```html
<app-modal [isOpen]="true" [config]="config">
  <!-- Contenido principal -->
  <p>Contenido del modal...</p>
  
  <div slot="footer" class="flex justify-between w-full">
    <button class="btn-secondary">Acción secundaria</button>
    <div class="space-x-2">
      <button class="btn-secondary">Cancelar</button>
      <button class="btn-primary">Guardar</button>
    </div>
  </div>
</app-modal>
```

## 📱 Tamaños de Modal

```typescript
// Pequeño (400px max)
config = { size: 'sm' }

// Mediano (512px max) - Default
config = { size: 'md' }

// Grande (768px max)
config = { size: 'lg' }

// Extra grande (1024px max)
config = { size: 'xl' }

// Pantalla completa
config = { size: 'full' }
```

## 🎯 Ejemplo Completo - Modal de Edición

```typescript
export class CustomerEditComponent {
  showEditModal = false;
  customer: Customer = {};

  editModalConfig: ModalConfig = {
    title: 'Editar Cliente',
    subtitle: 'Modifica la información del cliente',
    size: 'lg',
    showHeader: true,
    showFooter: true,
    closable: true,
    scrollable: true
  };

  editModalButtons: ModalButton[] = [
    {
      label: 'Cancelar',
      type: 'secondary',
      action: () => this.cancelEdit()
    },
    {
      label: 'Guardar Cambios',
      type: 'primary',
      action: () => this.saveCustomer(),
      loading: false
    }
  ];

  openEditModal(customer: Customer) {
    this.customer = { ...customer };
    this.showEditModal = true;
  }

  cancelEdit() {
    this.showEditModal = false;
    // Reset form data
    this.customer = {};
  }

  async saveCustomer() {
    // Set loading state
    this.editModalButtons[1].loading = true;
    
    try {
      await this.customerService.updateCustomer(this.customer);
      this.showEditModal = false;
      this.showSuccessMessage();
    } catch (error) {
      this.showErrorMessage();
    } finally {
      this.editModalButtons[1].loading = false;
    }
  }
}
```

```html
<app-modal
  [isOpen]="showEditModal"
  [config]="editModalConfig"
  [buttons]="editModalButtons"
  (closed)="cancelEdit()"
>
  <form class="space-y-6">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          [(ngModel)]="customer.firstName"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Apellido</label>
        <input
          type="text"
          [(ngModel)]="customer.lastName"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
      </div>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        [(ngModel)]="customer.email"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      >
    </div>
    
    <!-- Más campos... -->
  </form>
</app-modal>
```

## 🔐 Métodos Públicos

```typescript
// Abrir modal programáticamente
modalComponent.openModal();

// Cerrar modal
modalComponent.closeModal();

// Toggle modal
modalComponent.toggleModal();
```

## 🎨 Personalización de Estilos

El modal utiliza clases de Tailwind CSS y puede ser personalizado fácilmente:

```typescript
config: ModalConfig = {
  customClass: 'my-custom-modal',
  headerClass: 'bg-blue-600 text-white',
  bodyClass: 'bg-gray-50',
  footerClass: 'bg-gray-100 border-t-2 border-blue-200'
};
```

## 📝 Notas Importantes

1. **Scroll Lock**: El modal automáticamente bloquea el scroll del body cuando está abierto
2. **Accesibilidad**: Incluye soporte para ESC key y focus management
3. **Responsive**: Se adapta automáticamente a diferentes tamaños de pantalla
4. **Z-index**: Usa z-50 para estar encima de otros elementos
5. **Animaciones**: Las animaciones pueden deshabilitarse para mejor rendimiento

¡El componente modal está listo para usar en toda la aplicación! 🎉
