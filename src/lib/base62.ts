const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = BigInt(62);

/**
 * Encodes a base-10 integer into a Base62 string.
 */
export function encodeBase62(num: number | bigint | string): string {
  let value = BigInt(num);
  if (value === BigInt(0)) {
    return BASE62_ALPHABET[0];
  }

  let encoded = '';
  while (value > BigInt(0)) {
    const remainder = Number(value % BASE);
    encoded = BASE62_ALPHABET[remainder] + encoded;
    value = value / BASE;
  }

  return encoded;
}

/**
 * Decodes a Base62 string back into a base-10 integer.
 */
export function decodeBase62(str: string): bigint {
  let decoded = BigInt(0);
  for (let i = 0; i < str.length; i++) {
    const charIndex = BASE62_ALPHABET.indexOf(str[i]);
    if (charIndex === -1) {
      throw new Error(`Invalid character '${str[i]}' in Base62 string.`);
    }
    decoded = (decoded * BASE) + BigInt(charIndex);
  }
  return decoded;
}
