import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';


@Injectable()
export class PostProvider {

	url: string = environment.apiUrl;

	constructor(
		private http: HttpClient
	) { }

	callServiceFunction(constantObj, data?) {
		switch (constantObj.TYPE) {
			case 'GET':
				return this.http.get(this.url + constantObj.END_POINT)
			case 'POST':
				return this.http.post(this.url + constantObj.END_POINT, data)
			case 'UPLOAD':
				return this.http.post(this.url + constantObj.END_POINT, data, {
					reportProgress: true,
					observe: 'events'
				}).pipe(map((event) => {
					switch (event.type) {
						case HttpEventType.UploadProgress:
							const progress = Math.round(100 * event.loaded / event.total);
							return { status: 'progress', message: progress };

						case HttpEventType.Response:
							return event.body;
						default:
							return `Unhandled event: ${event.type}`;
					}
				})
				);
			case 'SEARCH':
				return this.http.post(this.url + constantObj.END_POINT, data)
			case 'DELETE':
				return this.http.delete(this.url + constantObj.END_POINT)
			case 'PATCH':
				return this.http.patch(this.url + constantObj.END_POINT, data)
		}
	}

	errorHandler() {

	}
}
