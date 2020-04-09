import Markdown from '../../../libs/markdown';

export default class MyVirtualTable extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/myVirtualTable.md`);
  }
}
