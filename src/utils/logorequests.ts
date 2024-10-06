import axios from 'axios';
import qs from 'qs';
import { Buffer } from 'buffer';

export interface AccessTokenResponse {
  access_token: string;
  refresh_token: string;
  '.issued': string;
  '.expires': string;
}

export type Clientinfo = {
  clientId: string;
  clientSecret: string;
  url: string;
  password: string;
  username: string;
  firmno: string;
};
class ApiClient {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null;
  private url: string;
  private password: string;
  private username: string;
  private firmno: string;
  constructor(clientinfo: Clientinfo) {
    this.clientId = clientinfo.clientId;
    this.clientSecret = clientinfo.clientSecret;
    this.accessToken = null;
    this.url = clientinfo.url;
    this.password = clientinfo.password;
    this.username = clientinfo.username;
    this.firmno = clientinfo.firmno;
  }

  getacesstoken(): string {
    return this.accessToken;
  }
  async requestAccessToken(path: string): Promise<AccessTokenResponse> {
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
        `${this.url}/${path} `,
        data,
        {
          headers,
        },
      );

      // Store the access token
      this.accessToken = response.data.access_token;

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async get(path: string): Promise<any> {
    try {
      if (!this.accessToken) {
        const reqtoken = await this.requestAccessToken('token');
        this.accessToken = reqtoken.access_token;
      }

      if (!this.accessToken) {
        throw new Error(
          'Access token is not available. Please authenticate first.',
        );
      }

      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await axios.get(`${this.url}/${path}`, { headers });
    } catch (error) {
      throw error;
    }
  }

  async post(path: string, data: any): Promise<any> {
    try {
      // Ensure accessToken is available
      if (!this.accessToken) {
        const reqToken = await this.requestAccessToken('token');
        this.accessToken = reqToken?.access_token;
        console.log(data);
        if (!this.accessToken) {
          throw new Error(
            'Access token is not available. Please authenticate first.',
          );
        }
      }

      // Set headers
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      };

      // Send POST request using Axios
      const response = await axios.post(`${this.url}/${path}`, data, {
        headers,
      });
      return response.data;
    } catch (error) {
      // Improved error handling
      if (axios.isAxiosError(error)) {
        console.error(
          'Axios error:',
          error.response?.status,
          error.response?.data,
        );
        throw new Error(
          `HTTP error: ${error.response?.status} - ${error.response?.data}`,
        );
      } else {
        console.error('Unexpected error:', error);
        throw error;
      }
    }
  }
}

export default ApiClient;
