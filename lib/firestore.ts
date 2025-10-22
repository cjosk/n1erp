type TimestampLike = {
  toDate: () => Date;
};

export const toIsoString = (value: unknown): string | undefined => {
  if (!value) return undefined;

  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'number') {
    return new Date(value).toISOString();
  }

  if (typeof value === 'object' && typeof (value as TimestampLike | null)?.toDate === 'function') {
    try {
      return (value as TimestampLike).toDate().toISOString();
    } catch (error) {
      console.error('Timestamp parse error', error);
      return undefined;
    }
  }

  return undefined;
};
