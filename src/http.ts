export class Http {
    public headers: { name: string, value: string }[] = [];

    public get = (url: string): Promise<string> => {
        return this.request("GET", url);
    }
    public put = (url: string, data?: string): Promise<string> => {
        return this.request("PUT", url, data);
    }
    public post = (url: string, data?: string): Promise<string> => {
        return this.request("POST", url, data)
    }
    public delete = (url: string): Promise<string> => {
        return this.request("DELETE", url)
    }

    private request = (method: string, url: string, data?: string): Promise<string> => {
        return new Promise((resolve, reject) => {

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(xhr.responseText);
                    } else {
                        reject();
                    }
                }
            };
            xhr.open(method, url, true);
            if (this.headers) {
                for (const header of this.headers) {
                    xhr.setRequestHeader(header.name, header.value);
                }
            }
            if (data) {
                xhr.send(data);
            }
            else {
                xhr.send();
            }
        });
    }
}