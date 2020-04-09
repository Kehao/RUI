import * as common from './utils/common';
import * as numberOperate from './utils/numberOperate';
import * as RSA from './utils/rsa'
import print from './utils/print';
import request from './utils/request';

export { default as i18n } from './locale';
export { default as MySelect } from './MySelect';
export { default as MyViewer } from './MyViewer';
export { default as MyPreview } from './MyPreview';
export { default as MyLoading } from './MyLoading';
export { default as MyFamilyInput } from './MyFamilyInput';
export { default as MyComPicture } from './MyComPicture';
export { default as MyGeneInput } from './MyGeneInput';
export { default as MyTime } from './MyTime';
export { default as MyVirtualTable } from './MyVirtualTable';
export { default as MyOssUpload } from './MyOssUpload';
export const utils = {
  ...common,
  ...numberOperate,
  RSA,
  print,
  request
};

// export default {
//   i18n,
//   OssUpload,
//   MySelect,
//   MyViewer,
//   //   BioSanUtils,
//   MyLoading,
//   MyFamilyInput,
//   MyComPicture,
//   MyGeneInput,
//   MyPreview,
//   MyTime
//   //  MyVirtualTable
// };
