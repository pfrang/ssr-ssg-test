export class Slug {
  private constructor(private readonly slug: string) { }

  static from(slug?: string | string[]) {
    if (!slug) return new Slug("/");

    const stringifiedSlug = Array.isArray(slug) ? slug.join("/") : slug;
    const withSlash = `/${stringifiedSlug}`;

    return new Slug(
      decodeURIComponent(replaceMultipleSlashesWithOne(withSlash)),
    );
  }

  toString() {
    return this.slug;
  }

  toArray() {
    return this.slug.split("/").filter((p) => p.length > 0);
  }
}

const replaceMultipleSlashesWithOne = (str: string) => str.replace(/\/+/g, "/");
