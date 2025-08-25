import { Box } from '@mui/material';
import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../../core-module/editor/editorstyle.css";
import { EditorComponentProps } from '../../../utility/types/offer/offer';

interface ExtendedEditorComponentProps extends EditorComponentProps {
  maxLength?: number;
  showCharacterCount?: boolean;
}

const EditorComponent: React.FC<ExtendedEditorComponentProps> = ({
  onContentChange,
  value = '',
  placeholder = 'Add Description',
  height = '200px',
  minHeight = '150px',
  maxHeight = '400px',
  toolbarOptions,
  showToolbar = true,
  maxLength,
  showCharacterCount = false
}) => {
  const [data, setData] = useState(value);
  const quillRef = useRef<ReactQuill>(null);
  const getPlainText = (html: string): string => {
    const tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = html;
    return tempDivElement.textContent || tempDivElement.innerText || "";
  };

  // Default toolbar options
  const defaultToolbarOptions = [
    ['bold'],
    ['italic'],
    ['underline'],
    ['strike'],
    [{ script: 'sub' }],
    [{ script: 'super' }],
    ['link']
  ];

  // Predefined toolbar configurations
  const toolbarPresets = {
    basic: [
      ['bold', 'italic', 'underline']
    ],
    standard: [
      ['bold', 'italic', 'underline', 'strike'],
      ['link']
    ],
    advanced: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      ['link', 'image'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
    full: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ align: ['', 'center', 'right', 'justify'] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
    minimal: [
      ['bold', 'italic'],
      ['link']
    ]
  };

  // Determine which toolbar to use
  const getToolbarOptions = () => {
    if (!showToolbar) return false;
    if (typeof toolbarOptions === 'string') {
      return toolbarPresets[toolbarOptions as keyof typeof toolbarPresets] || defaultToolbarOptions;
    }
    return toolbarOptions || defaultToolbarOptions;
  };

  const modules = {
    toolbar: getToolbarOptions(),
  };

  const handleEditorChange = (content: string) => {
    if (maxLength) {
      const plainText = getPlainText(content);
      if (plainText.length > maxLength) {
        const truncatedText = plainText.substring(0, maxLength);
        const tempDiv = document.createElement('div');
        tempDiv.textContent = truncatedText;
        const truncatedContent = tempDiv.innerHTML;
        setData(truncatedContent);
        if (onContentChange) {
          onContentChange(truncatedContent);
        }
        return;
      }
    }
    setData(content);
    if (onContentChange) {
      onContentChange(content);
    }
  };

  React.useEffect(() => {
    if (maxLength && quillRef.current) {
      const editor = quillRef.current.getEditor();
      const editorElement = editor.root;
      const getTextLength = () => getPlainText(editor.root.innerHTML).length;
      const handleKeyDown = (event: KeyboardEvent) => {
        const currentLength = getTextLength();
        const allowedKeys = [
          'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
          'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab'
        ];
        if (event.ctrlKey || event.metaKey) return;
        if (currentLength >= maxLength && !allowedKeys.includes(event.key)) {
          event.preventDefault();
        }
      };

      const handlePaste = (event: ClipboardEvent) => {
        event.preventDefault();
        const clipboardText = event.clipboardData?.getData('text') || '';
        const currentLength = getTextLength();
        const remainingLength = maxLength - currentLength;
        if (remainingLength <= 0) return;
        const allowedText = clipboardText.substring(0, remainingLength);
        const editor = quillRef.current?.getEditor();
        const selection = editor?.getSelection(true);
        if (selection) {
          const insertIndex = selection.index;
          editor?.insertText(insertIndex, allowedText, 'user');
        }
      };
      editorElement.addEventListener('keydown', handleKeyDown);
      editorElement.addEventListener('paste', handlePaste);
      return () => {
        editorElement.removeEventListener('keydown', handleKeyDown);
        editorElement.removeEventListener('paste', handlePaste);
      };
    }
  }, [maxLength, data]);

  return (
    <Box>
      {showCharacterCount && maxLength && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <span style={{ fontSize: '12px', color: '#666' }}>
            {getPlainText(data).length}/{maxLength}
          </span>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          width: '100%',
          py: 1,
        }}
      >
        <Box
          className="custom-quill-wrapper"
          sx={{
            width: '100%',
            '& .ql-editor': {
              height: height,
              minHeight: minHeight,
              maxHeight: maxHeight,
              overflow: 'auto',
            },
            '& .ql-container': {
              height: 'auto',
            },
            ...(!showToolbar && {
              '& .ql-toolbar': {
                display: 'none',
              }
            })
          }}
        >
          <ReactQuill
            ref={quillRef}
            className="custom-quill-editor"
            modules={modules}
            value={data}
            placeholder={placeholder}
            onChange={handleEditorChange}
            style={{
              height: height,
              minHeight: minHeight,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EditorComponent;
