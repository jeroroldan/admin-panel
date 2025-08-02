export class CustomerModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<CustomerModel> = {}) {
    this.id = data.id || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.phone = data.phone;
    this.address = data.address;
    this.city = data.city;
    this.country = data.country;
    this.postalCode = data.postalCode;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  /**
   * Método estático para adaptar datos JSON a CustomerModel
   */
  static adapt(json: any): CustomerModel {
    if (!json) {
      throw new Error('Cannot adapt null or undefined data to CustomerModel');
    }

    return new CustomerModel({
      id: json.id || json._id || '', // Support both id and _id
      firstName: json.firstName || json.first_name || '',
      lastName: json.lastName || json.last_name || '',
      email: json.email || '',
      phone: json.phone || json.phoneNumber || undefined,
      address: json.address || json.streetAddress || undefined,
      city: json.city || undefined,
      country: json.country || undefined,
      postalCode:
        json.postalCode || json.postal_code || json.zipCode || undefined,
      isActive: json.isActive !== undefined ? Boolean(json.isActive) : true,
      createdAt:
        json.createdAt || json.created_at || json.dateCreated || new Date(),
      updatedAt:
        json.updatedAt || json.updated_at || json.dateUpdated || new Date(),
    });
  }

  /**
   * Método estático para adaptar array de datos JSON
   */
  static adaptArray(jsonArray: any[]): CustomerModel[] {
    if (!Array.isArray(jsonArray)) {
      return [];
    }
    return jsonArray.map((item) => CustomerModel.adapt(item));
  }

  /**
   * Método estático fromJson (delegado a adapt)
   */
  static fromJson(json: any): CustomerModel {
    return CustomerModel.adapt(json);
  }

  /**
   * Convertir instancia a JSON plano
   */
  toJson(): any {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      city: this.city,
      country: this.country,
      postalCode: this.postalCode,
      isActive: this.isActive,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Método fromJson de instancia
   */
  fromJson(json: any): CustomerModel {
    Object.assign(this, CustomerModel.adapt(json));
    return this;
  }

  /**
   * Obtener nombre completo
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /**
   * Obtener iniciales
   */
  get initials(): string {
    const firstInitial = this.firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = this.lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  }

  /**
   * Obtener dirección completa
   */
  get fullAddress(): string {
    const parts = [this.address, this.city, this.country].filter(Boolean);
    return parts.join(', ');
  }

  /**
   * Verificar si el customer tiene información de contacto completa
   */
  get hasCompleteContactInfo(): boolean {
    return !!(this.firstName && this.lastName && this.email);
  }

  /**
   * Verificar si el customer tiene dirección
   */
  get hasAddress(): boolean {
    return !!(this.address || this.city || this.country);
  }

  /**
   * Actualizar timestamp de modificación
   */
  touch(): void {
    this.updatedAt = new Date();
  }

  /**
   * Clonar la instancia
   */
  clone(): CustomerModel {
    return new CustomerModel(this.toJson());
  }

  /**
   * Validar los datos del customer
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!this.lastName?.trim()) {
      errors.push('Last name is required');
    }

    if (!this.email?.trim()) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        errors.push('Email format is invalid');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Comparar con otro customer
   */
  equals(other: CustomerModel): boolean {
    return this.id === other.id;
  }

  /**
   * Convertir a string para debug
   */
  toString(): string {
    return `CustomerModel(${this.id}: ${this.fullName} - ${this.email})`;
  }
}
