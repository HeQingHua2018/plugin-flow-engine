function groupBy<T, K extends keyof any>(
  arr: T[],
  generateKey: string | ((item: T, index: number, array: T[]) => K),
): Record<K, T[]> {
  let keyGenerator: (item: T, index: number, array: T[]) => K;

  if (typeof generateKey === 'string') {
    const propName = generateKey;
    keyGenerator = (item) => item[propName as keyof T] as unknown as K;
  } else {
    keyGenerator = generateKey;
  }

  const result: Record<K, T[]> = {} as Record<K, T[]>;

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = keyGenerator(item, i, arr);

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(item);
  }

  return result;
}

export default groupBy;