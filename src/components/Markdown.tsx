import { MarkdownPreviewProps } from '@uiw/react-markdown-preview';
import { MDEditorProps } from '@uiw/react-md-editor';
import dynamic from 'next/dynamic';

import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const MDViewer = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

export const MarkdownEditor = ({ ...rest }: MDEditorProps) => (
  <div data-color-mode="light">
    <MDEditor {...rest} />
  </div>
);

export const MarkdownViewer = ({ ...rest }: MarkdownPreviewProps) => (
  <div data-color-mode="light">
    <MDViewer {...rest} />
  </div>
);
