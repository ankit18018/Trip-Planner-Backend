import GenConst from '../../app/consts/gen-consts';

export default class GenUtil {
  static getOffsetAndLimit(
    page: number | string,
    pageSize = GenConst.PaginationLimit,
  ): { skip: number; take: number } {
    page = Number(page);
    const skip = (page < 1 ? 0 : page) * pageSize;
    const take = pageSize;
    return { skip, take };
  }
}
