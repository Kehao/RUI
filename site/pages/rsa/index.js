import Markdown from '../../../libs/markdown';

export default class RSA extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/rsa.md`);
  }
}
