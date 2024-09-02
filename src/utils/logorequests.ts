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
      // console.log(response.data.access_token);

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
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post(path: string, data: any): Promise<any> {
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

      const response = await axios.post(`${this.url}/${path}`, data, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ApiClient;
