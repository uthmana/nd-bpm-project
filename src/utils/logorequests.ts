import axios, { AxiosError, AxiosResponse } from 'axios';
import qs from 'qs';
import { Buffer } from 'buffer';

// Define the structure of the access token response
export interface AccessTokenResponse {
  access_token: string;
  refresh_token: string;
  '.issued': string;
  '.expires': string;
}

// Define the structure for the client info
export type ClientInfo = {
  clientId: string;
  clientSecret: string;
  url: string;
  password: string;
  username: string;
  firmno: string;
};

// Define the structure of the error message
interface ModelState {
  OtherError?: string[]; // Array of other errors
  DBError?: string[]; // Array of database errors
}

// Define the root structure of the response
interface LogoClientErrorResponse {
  Message: string; // General error message
  ModelState: ModelState; // Specific error details
}

class ApiClient {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null;
  private url: string;
  private password: string;
  private username: string;
  private firmno: string;

  constructor(clientInfo: ClientInfo) {
    this.clientId = clientInfo.clientId;
    this.clientSecret = clientInfo.clientSecret;
    this.accessToken = null;
    this.url = clientInfo.url;
    this.password = clientInfo.password;
    this.username = clientInfo.username;
    this.firmno = clientInfo.firmno;
  }

  // Getter for access token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Request a new access token
  async requestAccessToken(path: string) {
    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization:
          'Basic ' +
          Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
            'base64',
          ),
      };

      const data = qs.stringify({
        grant_type: 'password',
        username: this.username,
        password: this.password,
        firmno: this.firmno,
      });

      const response = await axios.post<AccessTokenResponse>(
        `${this.url}/${path}`,
        data,
        { headers },
      );

      this.accessToken = response.data.access_token; // Store the access token
    } catch (error) {
      console.error('Error requesting access token:', error);
      throw error;
    }
  }

  // Handle GET requests
  async get(path: string): Promise<any> {
    try {
      if (!this.accessToken) {
        await this.requestAccessToken('token'); // Authenticate if needed
      }

      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await axios.get(`${this.url}/${path}`, { headers });
      return response.data;
    } catch (error) {
      throw this.handleRequestError(error);
    }
  }

  // Handle POST requests
  async post(path: string, data: any): Promise<any> {
    try {
      if (!this.accessToken) {
        await this.requestAccessToken('token'); // Authenticate if needed
      }

      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await axios.post(`${this.url}/${path}`, data, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`${await this.handleRequestError(error)}`);
    }
  }

  // Error handling logic
  private async handleRequestError(error: any): Promise<string> {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      switch (status) {
        case 400:
          return this.parseErrorResponse(error.response?.data);
        case 401:
          return 'Unauthorized. Please check your credentials.';
        case 404:
          return 'Resource not found.';
        default:
          return `Unexpected error occurred: ${error.message}`;
      }
    } else {
      throw new Error(`An unexpected error occurred: ${error}`);
    }
  }

  // Parse and handle error response from the API
  private parseErrorResponse(data: LogoClientErrorResponse): string {
    let errorMessage = `Error: ${data.Message}`;

    if (data.ModelState.DBError) {
      data.ModelState.DBError.forEach((error) => {
        if (error.includes('Cannot insert duplicate key row')) {
          const duplicateKey = extractDuplicateKeyValue(error);
          errorMessage += `\nDuplicate record found: ${
            duplicateKey || 'unknown'
          }. This record already exists.`;
        } else {
          errorMessage += `\nDatabase Error: ${error}`;
        }
      });
    }

    if (data.ModelState.OtherError) {
      data.ModelState.OtherError.forEach((error) => {
        errorMessage += `\nOther Error: ${error}`;
      });
    }

    return errorMessage;
  }
}

// Utility function to extract the duplicate key value
function extractDuplicateKeyValue(errorMessage: string): string | null {
  const regex = /\(([^)]+)\)/; // Regular expression to match content inside parentheses
  const match = errorMessage.match(regex);
  return match ? match[1] : null;
}

export default ApiClient;
