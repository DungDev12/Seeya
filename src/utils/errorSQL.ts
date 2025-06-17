export function isSQLiteError(
  err: unknown,
): err is {code: number; message: string} {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as any).code === 'number' &&
    'message' in err &&
    typeof (err as any).message === 'string'
  );
}
