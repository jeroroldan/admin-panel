import { Injectable, ComponentRef, ViewContainerRef, inject } from '@angular/core';
import { ModalConfig, ModalButton, ModalShare } from './modal-share';

export interface ModalData {
  config?: ModalConfig;
  content?: string;
  buttons?: ModalButton[];
  data?: any;
}

export interface ConfirmModalData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private viewContainer?: ViewContainerRef;
  private modalRefs: ComponentRef<ModalShare>[] = [];

  setViewContainer(viewContainer: ViewContainerRef) {
    this.viewContainer = viewContainer;
  }

  /**
   * Abrir modal genérico
   */
  open(modalData: ModalData): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.viewContainer) {
        reject(new Error('ViewContainer no configurado. Llama a setViewContainer() primero.'));
        return;
      }

      const modalRef = this.viewContainer.createComponent(ModalShare);
      const modalInstance = modalRef.instance;

      // Configurar el modal usando ComponentRef.setInput para signals
      modalRef.setInput('config', modalData.config || {});
      modalRef.setInput('content', modalData.content || '');
      modalRef.setInput('buttons', modalData.buttons || []);
      modalRef.setInput('isOpen', true);

      // Suscribirse a eventos
      modalInstance.closed.subscribe(() => {
        this.closeModal(modalRef);
        resolve(null);
      });

      modalInstance.backdropClick.subscribe(() => {
        if (modalInstance.mergedConfig().closable) {
          this.closeModal(modalRef);
          resolve(null);
        }
      });

      // Guardar referencia
      this.modalRefs.push(modalRef);

      // Abrir el modal
      modalInstance.openModal();
    });
  }

  /**
   * Modal de confirmación
   */
  confirm(data: ConfirmModalData): Promise<boolean> {
    return new Promise((resolve) => {
      const config: ModalConfig = {
        title: data.title || 'Confirmar acción',
        size: 'sm',
        showHeader: true,
        showFooter: true,
        closable: true,
        centered: true
      };

      const buttons: ModalButton[] = [
        {
          label: data.cancelText || 'Cancelar',
          type: 'secondary',
          action: () => {
            resolve(false);
          }
        },
        {
          label: data.confirmText || 'Confirmar',
          type: this.getConfirmButtonType(data.type),
          action: () => {
            resolve(true);
          }
        }
      ];

      this.open({
        config,
        content: `<p class="text-gray-700">${data.message}</p>`,
        buttons
      });
    });
  }

  /**
   * Modal de alerta/información
   */
  alert(message: string, title?: string, type: 'info' | 'success' | 'warning' | 'danger' = 'info'): Promise<void> {
    return new Promise((resolve) => {
      const config: ModalConfig = {
        title: title || this.getAlertTitle(type),
        size: 'sm',
        showHeader: true,
        showFooter: true,
        closable: true,
        centered: true
      };

      const buttons: ModalButton[] = [
        {
          label: 'Aceptar',
          type: 'primary',
          action: () => {
            resolve();
          }
        }
      ];

      const icon = this.getAlertIcon(type);
      const content = `
        <div class="flex items-start">
          ${icon}
          <div class="ml-3">
            <p class="text-gray-700">${message}</p>
          </div>
        </div>
      `;

      this.open({
        config,
        content,
        buttons
      });
    });
  }

  /**
   * Modal de loading
   */
  loading(message: string = 'Cargando...'): ComponentRef<ModalShare> {
    if (!this.viewContainer) {
      throw new Error('ViewContainer no configurado.');
    }

    const modalRef = this.viewContainer.createComponent(ModalShare);

    // Configurar el modal usando setInput para signals
    modalRef.setInput('config', {
      size: 'sm',
      showHeader: false,
      showFooter: false,
      closable: false,
      backdrop: true,
      centered: true
    });

    modalRef.setInput('loading', true);
    modalRef.setInput('content', `<div class="text-center"><p class="text-gray-700 mt-4">${message}</p></div>`);
    modalRef.setInput('isOpen', true);

    this.modalRefs.push(modalRef);
    modalRef.instance.openModal();

    return modalRef;
  }

  /**
   * Cerrar un modal específico
   */
  closeModal(modalRef: ComponentRef<ModalShare>) {
    const index = this.modalRefs.indexOf(modalRef);
    if (index > -1) {
      this.modalRefs.splice(index, 1);
      modalRef.destroy();
    }
  }

  /**
   * Cerrar todos los modales
   */
  closeAll() {
    this.modalRefs.forEach(modalRef => {
      modalRef.destroy();
    });
    this.modalRefs = [];
  }

  /**
   * Obtener el número de modales abiertos
   */
  getOpenModalsCount(): number {
    return this.modalRefs.length;
  }

  private getConfirmButtonType(type?: string): 'primary' | 'danger' | 'warning' | 'success' {
    switch (type) {
      case 'danger': return 'danger';
      case 'warning': return 'warning';
      case 'success': return 'success';
      default: return 'primary';
    }
  }

  private getAlertTitle(type: string): string {
    switch (type) {
      case 'success': return 'Éxito';
      case 'warning': return 'Advertencia';
      case 'danger': return 'Error';
      default: return 'Información';
    }
  }

  private getAlertIcon(type: string): string {
    const iconClasses = {
      info: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      danger: 'text-red-500'
    };

    const iconClass = iconClasses[type as keyof typeof iconClasses] || iconClasses.info;

    return `
      <div class="flex-shrink-0">
        <svg class="w-6 h-6 ${iconClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${this.getIconPath(type)}
        </svg>
      </div>
    `;
  }

  private getIconPath(type: string): string {
    switch (type) {
      case 'success':
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>';
      case 'warning':
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>';
      case 'danger':
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>';
      default:
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>';
    }
  }
}
