export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  company?: string;
  isActive: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para un solo customer del backend
export interface CustomerApiData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  company?: string;
  isActive: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Interfaz para la respuesta paginada del backend
export interface CustomerApiResponse {
  customers: CustomerApiData[];
  total: number;
  page: number;
  totalPages: number;
}

// Interfaz para la respuesta wrapeada del backend
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export class CustomerModel implements Customer {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone: string | undefined,
    public address: string | undefined,
    public city: string | undefined,
    public country: string | undefined,
    public company: string | undefined,
    public isActive: boolean,
    public totalOrders: number,
    public totalSpent: number,
    public lastOrderDate: Date | undefined,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  /**
   * Adapta los datos de la API al modelo de Customer
   */
  static adapt(apiData: CustomerApiData): Customer {
    return new CustomerModel(
      apiData.id,
      apiData.firstName,
      apiData.lastName,
      apiData.email,
      apiData.phone,
      apiData.address,
      apiData.city,
      apiData.country,
      apiData.company,
      apiData.isActive,
      apiData.totalOrders || 0,
      apiData.totalSpent || 0,
      apiData.lastOrderDate ? new Date(apiData.lastOrderDate) : undefined,
      new Date(apiData.createdAt),
      new Date(apiData.updatedAt)
    );
  }

  /**
   * Adapta múltiples elementos de la API
   */
  static adaptMany(apiDataArray: CustomerApiData[]): Customer[] {
    return apiDataArray.map((apiData) => CustomerModel.adapt(apiData));
  }

  /**
   * Adapta la respuesta wrapeada del backend para un solo customer
   */
  static adaptResponse(response: ApiResponse<CustomerApiData>): Customer {
    return CustomerModel.adapt(response.data);
  }

  /**
   * Adapta la respuesta wrapeada del backend para arrays
   */
  static adaptResponseMany(
    response: ApiResponse<CustomerApiData[]>
  ): Customer[] {
    return CustomerModel.adaptMany(response.data);
  }

  /**
   * Convierte el modelo a formato de API para envío
   */
  toApiFormat(): Omit<CustomerApiData, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      city: this.city,
      country: this.country,
      company: this.company,
      isActive: this.isActive,
      totalOrders: this.totalOrders,
      totalSpent: this.totalSpent,
      lastOrderDate: this.lastOrderDate?.toISOString(),
    };
  }

  /**
   * Obtiene el nombre completo del cliente
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Obtiene las iniciales del cliente
   */
  get initials(): string {
    return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
  }

  /**
   * Obtiene la dirección completa
   */
  get fullAddress(): string {
    const parts = [this.address, this.city, this.country].filter(Boolean);
    return parts.join(', ');
  }

  /**
   * Verifica si el cliente es nuevo (creado en los últimos 30 días)
   */
  get isNewCustomer(): boolean {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.createdAt > thirtyDaysAgo;
  }

  /**
   * Obtiene el promedio de gasto por pedido
   */
  get averageOrderValue(): number {
    return this.totalOrders > 0 ? this.totalSpent / this.totalOrders : 0;
  }

  /**
   * Formatea el total gastado como moneda
   */
  formatTotalSpent(locale: string = 'es-ES', currency: string = 'EUR'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(this.totalSpent);
  }

  /**
   * Formatea el promedio de gasto por pedido como moneda
   */
  formatAverageOrderValue(
    locale: string = 'es-ES',
    currency: string = 'EUR'
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(this.averageOrderValue);
  }

  /**
   * Crea un nuevo cliente con valores por defecto
   */
  static createEmpty(): Customer {
    return new CustomerModel(
      '',
      '',
      '',
      '',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined, // company
      true,
      0,
      0,
      undefined,
      new Date(),
      new Date()
    );
  }

  /**
   * Crea un cliente desde datos de formulario
   */
  static fromFormData(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    company?: string;
    isActive?: boolean;
  }): Omit<Customer, 'id'> {
    return {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      company: formData.company,
      isActive: formData.isActive ?? true,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Verifica si el cliente tiene información de contacto completa
   */
  get hasCompleteContactInfo(): boolean {
    return !!(this.phone && this.address && this.city && this.country);
  }

  /**
   * Obtiene el estado del cliente como texto
   */
  get statusText(): string {
    return this.isActive ? 'Activo' : 'Inactivo';
  }

  /**
   * Obtiene las clases CSS para el badge de estado
   */
  get statusBadgeClass(): string {
    return this.isActive ? 'badge-success' : 'badge-warning';
  }
}
