export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'INVALID_SIGNATURE'
  | 'ERROR'
  | 'NO_EXTENSION'
  | 'NO_ACCOUNT'
  | 'USER_REJECTED';

export class BizError extends Error {
  code: ErrorCode;
  message: string;

  constructor({ code, message }: { code: ErrorCode; message?: string }) {
    super(message);
    this.code = code;
    this.message = message ?? '';
  }

  static of(error: ErrorCode, message?: string) {
    return new BizError({ code: error, message });
  }

  static ofTrpc(error: ErrorCode, message?: string) {
    return new Error(
      JSON.stringify({
        type: 'TRPC_WARP',
        code: error,
        message,
      }),
    );
  }
}
