export class InvalidRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRequestError";
  }
}

export class OperationFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OperationFailedError";
  }
}

export class ServiceUnavailableError extends Error {
  type = "service-unavailable";
  name = "ServiceUnavailable";

  constructor(message: string = "Service Unavailable") {
    super(message);
  }
}

export class ServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServiceError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}
