const host = () => typeof window !== 'undefined' && window.location.host;

class DomainParser {
  public static parse(hostString) {
    const [first, second, ...third] = hostString.split('.');
    const hasSubdomain = third && third.length === 1 && first !== 'www';

    const domain = hasSubdomain ? second : first;
    const subdomain = hasSubdomain ? first : undefined;
    const tld = hasSubdomain ? third[0] : second;
    const root = `${domain}.${tld}`;

    return {
      hasSubdomain,
      root,
      subdomain,
    };
  }

  public static getRoot(input = host()) {
    if (!input) { return; }

    return this.parse(input).root;
  }

  public static getUsername(input) {
    if (!input) { return; }

    return this.parse(input).subdomain;
  }

  public static hasSubdomain(input) {
    if (!input) { return; }

    return this.parse(input).hasSubdomain;
  }
}

export default DomainParser;
