import { APIRequestContext, APIResponse } from '@playwright/test';
import { IResponse } from '../interfaces/iResponse';

export class UserClient {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createUser(endpoint: string, userData: any): Promise<IResponse> {
        const response = await this.request.post(endpoint, {
            data: userData,
        });
        return this.handleResponse(response);
    }

    async getUser(endpoint: string): Promise<IResponse> {
        const response = await this.request.get(endpoint);
        return this.handleResponse(response);
    }

    async updateUser(endpoint: string, userData: any): Promise<IResponse> {
        const response = await this.request.put(endpoint, {
            data: userData,
        });
        return this.handleResponse(response);
    }

    async deleteUser(endpoint: string): Promise<IResponse> {
        const response = await this.request.delete(endpoint);
        return this.handleResponse(response);
    }

    private async handleResponse(response: APIResponse): Promise<IResponse> {
        const status = response.status();
        if (status === 204) {
            return { status, data: null };
        }

        let body;
        try {
            body = await response.json();
        } catch (e) {
            body = await response.text();
        }

        if (!response.ok()) {
            return { status, error: body };
        }

        return { status, data: body };
    }
}