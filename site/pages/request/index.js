import Markdown from '../../../libs/markdown';

export default class Request extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/request.md`);
  }
}
