import Markdown from '../../../libs/markdown';

export default class MyComPicture extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/myComPicture.md`);
  }
}
