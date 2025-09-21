import { LoginFormState } from './login-form.interface';

/**
 * Login state interface
 * Defines the complete state of the login system
 */
export interface LoginState {
  /** Current user information */
  user: any | null;
  /** Whether login is in progress */
  loginLoading: boolean;
  /** Current login error message */
  loginError: string | null;
  /** URL to redirect to after successful login */
  returnUrl: string;
  /** Complete form state */
  loginForm: LoginFormState;
}

/**
 * Login configuration interface
 * Defines configurable options for the login component
 */
export interface LoginConfig {
  /** Page title */
  title?: string;
  /** Page subtitle */
  subtitle?: string;
  /** Whether to show remember me checkbox */
  showRememberMe?: boolean;
  /** Whether to show forgot password link */
  showForgotPassword?: boolean;
  /** Social login providers to display */
  socialProviders?: string[];
  /** URL to redirect to after login */
  redirectUrl?: string;
  /** Custom CSS classes */
  customClasses?: {
    container?: string;
    form?: string;
    button?: string;
  };
}

/**
 * Login credentials interface
 * Defines the structure of login request data
 */
export interface LoginCredentials {
  /** User's email */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Login response interface
 * Defines the structure of successful login response
 */
export interface LoginResponse {
  /** Access token */
  access_token: string;
  /** Refresh token */
  refresh_token?: string;
  /** User information */
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

/**
 * Login error interface
 * Defines the structure of login error responses
 */
export interface LoginError {
  /** Error message */
  message: string;
  /** HTTP status code */
  statusCode?: number;
  /** Error code for programmatic handling */
  code?: string;
  /** Additional error details */
  details?: any;
}
