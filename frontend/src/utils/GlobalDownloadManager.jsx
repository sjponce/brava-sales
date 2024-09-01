import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentItem } from '@/redux/docs/selectors';

const GlobalDownloadManager = () => {
  const generatedDoc = useSelector(selectCurrentItem)?.result?.doc;
  const docInfo = useSelector(selectCurrentItem)?.result?.docInfo;
  useEffect(() => {
    if (generatedDoc && docInfo && generatedDoc.type === 'Buffer') {
      const blob = new Blob([new Uint8Array(generatedDoc.data)], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${docInfo.docName}.${docInfo.docExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    }
  }, [generatedDoc]);

  return null;
};

export default GlobalDownloadManager;
