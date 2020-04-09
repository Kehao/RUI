import Markdown from '../../../libs/markdown';
import './style.scss';

export default class OssUpload extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/ossUpload.md`);
  }
}
