import qs from 'qs';
import { parseValue } from './type-casting';

const qsOptions: qs.IStringifyOptions = {
  delimiter: ',',
};
export class EncodeURIComponent {
  /**
   * Encode a [deeply] nested object for use in a url
   * Assumes Array.each is defined
   */
  public static encode(queryObj: Array<unknown>, nesting = ''): string {
    return qs.stringify(queryObj, qsOptions);
  }
  public static decode(str: string): Array<unknown> {
    const vals = Object.values(qs.parse(str, qsOptions));
    const decoded = vals.map((val) => {
      return parseValue(val);
    });
    return decoded;
  }
}
