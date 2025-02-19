import React from 'react';
import AceEditor from 'react-ace';

import { useApplicationContextSafe, useData } from 'core/presentation';

import { ManagedReader } from '..';
import { useLogEvent } from '../utils/logging';

const DeliveryConfigContentRenderer = ({ content }: { content: string }) => {
  return (
    <AceEditor
      mode="yaml"
      theme="textmate"
      readOnly
      fontSize={12}
      cursorStart={0}
      showPrintMargin={false}
      highlightActiveLine={true}
      maxLines={Infinity}
      value={content}
      setOptions={{
        firstLineNumber: 1,
        tabSize: 2,
        showLineNumbers: true,
        showFoldWidgets: true,
      }}
      style={{ width: 'auto' }}
      className="ace-editor sp-margin-s-top"
      editorProps={{ $blockScrolling: true }}
      onLoad={(editor) => {
        // This removes the built-in search box (as it doesn't scroll properly to matches)
        // commands is missing in the type def and therefore we have to cast as any
        (editor as any).commands?.removeCommand('find');
      }}
    />
  );
};

export const DeliveryConfig = () => {
  const app = useApplicationContextSafe();
  const { result, error, status } = useData(() => ManagedReader.getRawDeliveryConfig(app.name), undefined, [app]);
  const logError = useLogEvent('DeliveryConfig');
  React.useEffect(() => {
    if (error) {
      logError({ action: 'LoadingFailed', data: { error } });
    }
  }, [error, logError]);

  return (
    <div className="DeliveryConfig sp-margin-xl-top">
      {status === 'REJECTED' && <div className="error-message">Failed to load delivery config</div>}
      {status === 'RESOLVED' && result && (
        <>
          <div>
            <h4>Delivery Config</h4>
          </div>
          <DeliveryConfigContentRenderer content={result} />
        </>
      )}
    </div>
  );
};
