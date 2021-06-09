export default class FetchService{
    constructor() {
        this._headers = {"Content-Type": "application/json" };
    }

    async getFetch(url, headers = this._headers) {
        return fetch(url, {
            method: "GET",
            headers: headers
        })
    }

    async postFetch(url, body, headers = this._headers) {
        return fetch(url, {
            method: "POST",
            body: body,
            headers: headers,
        })
    }

    async patchFetch(url, body, headers = this._headers) {
        return fetch(url, {
            method: "PATCH",
            body: body,
            headers: headers,
        })
    }

    async deleteFetch(url, headers = this._headers) {
        return fetch(url, {
            method: "DELETE",
            headers: headers,
        })
    }
}