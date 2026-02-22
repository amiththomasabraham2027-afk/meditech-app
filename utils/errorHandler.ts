export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleError(error: any) {
  if (error instanceof ApiError) {
    return {
      success: false,
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
    };
  }

  if (error.code === 'PGRST116') {
    return {
      success: false,
      statusCode: 404,
      message: 'Resource not found',
    };
  }

  if (error.code === 'PGRST204') {
    return {
      success: false,
      statusCode: 204,
      message: 'No content',
    };
  }

  return {
    success: false,
    statusCode: 500,
    message: error.message || 'An unexpected error occurred',
    details: error,
  };
}

export function throwApiError(statusCode: number, message: string, details?: any) {
  throw new ApiError(statusCode, message, details);
}
