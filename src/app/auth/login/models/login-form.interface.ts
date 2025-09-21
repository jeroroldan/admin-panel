/**
 * Login form data interface
 * Defines the structure of login form values
 */
export interface LoginFormData {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Whether to remember the user */
  rememberMe: boolean;
}

/**
 * Login form validation interface
 * Defines the validation state of form fields
 */
export interface LoginFormValidation {
  /** Email field validation state */
  email: {
    /** Whether the field is valid */
    isValid: boolean;
    /** Array of validation error messages */
    errors: string[];
  };
  /** Password field validation state */
  password: {
    /** Whether the field is valid */
    isValid: boolean;
    /** Array of validation error messages */
    errors: string[];
  };
  /** Overall form validity */
  isFormValid: boolean;
}

/**
 * Login form touched state interface
 * Tracks which fields have been interacted with
 */
export interface LoginFormTouched {
  /** Whether email field has been touched */
  email: boolean;
  /** Whether password field has been touched */
  password: boolean;
}

/**
 * Complete login form state interface
 * Combines data, validation, and interaction state
 */
export interface LoginFormState {
  /** Current form data */
  data: LoginFormData;
  /** Current validation state */
  validation: LoginFormValidation;
  /** Touch/interaction state */
  touched: LoginFormTouched;
  /** Whether form has been submitted */
  submitted: boolean;
}
