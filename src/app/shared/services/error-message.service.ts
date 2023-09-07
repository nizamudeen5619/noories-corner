import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  getErrorMsg(statusCode: number) {
    let errorHeading = '';
    let errorInfo = '';
    switch (statusCode) {
      case 400:
        errorHeading = "Error: Bad Request";
        errorInfo = "The server could not understand your request due to malformed syntax or invalid data.";
        break;
      case 401:
        errorHeading = "Error: Unauthorized";
        errorInfo = "You are not authorized to access this resource. Please log in or provide valid credentials.";
        break;
      case 403:
        errorHeading = "Error: Forbidden";
        errorInfo = "You do not have permission to access this resource. Please contact the site administrator.";
        break;
      case 404:
        errorHeading = "Error: Page Not Found";
        errorInfo = "The page you are looking for could not be found. Please check the URL and try again.";
        break;
      case 409:
        errorHeading = "Error: Conflict";
        errorInfo = "The request could not be completed due to a conflict with the current state of the resource. Please resolve the conflict and try again.";
        break;
      case 500:
        errorHeading = "Error: Internal Server Error";
        errorInfo = "We're sorry, but there was an internal server error. Please try again later.";
        break;
      case 503:
        errorHeading = "Error: Service Unavailable";
        errorInfo = "The server is temporarily unavailable. Please try again later.";
        break;
      default:
        errorHeading = "Oops! Something went wrong.";
        errorInfo = "We're sorry, but we're having some technical difficulties right now. Please try again later.";
        break;
    }
    return { errorHeading, errorInfo };
  }
}
