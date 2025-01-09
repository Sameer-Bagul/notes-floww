import { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type NoteType = 'chapter' | 'main-topic' | 'sub-topic';

export interface TextNodeData {
  label: string;
  content?: string;
  type: NoteType;
}

const getNodeStyle = (type: NoteType) => {
  switch (type) {
    case 'chapter':
      return 'border-primary/50 bg-primary/5 hover:border-primary';
    case 'main-topic':
      return 'border-blue-500/50 bg-blue-50/50 hover:border-blue-500';
    case 'sub-topic':
      return 'border-green-500/50 bg-green-50/50 hover:border-green-500';
    default:
      return '';
  }
};

const getNodeBadgeStyle = (type: NoteType) => {
  switch (type) {
    case 'chapter':
      return 'bg-primary/10 text-primary hover:bg-primary/20';
    case 'main-topic':
      return 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20';
    case 'sub-topic':
      return 'bg-green-500/10 text-green-700 hover:bg-green-500/20';
    default:
      return '';
  }
};

const TextNode = ({ id, data, isConnectable }: { id: string, data: TextNodeData; isConnectable?: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const { deleteElements } = useReactFlow();

  const editor = useEditor({
    extensions: [StarterKit],
    content: data.content || '<p>Click to add content...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px]',
      },
    },
  });

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    data.label = label;
    if (editor) {
      data.content = editor.getHTML();
    }
  }, [data, editor, label]);

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key === 'Enter') {
        setIsEditing(false);
        data.label = label;
      }
    },
    [data, label]
  );

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
    toast.success('Node deleted');
  }, [deleteElements, id]);

  return (
    <Card className={cn(
      "min-w-[350px] min-h-[250px] p-6 bg-background/95 backdrop-blur-sm border-2 transition-colors duration-200",
      getNodeStyle(data.type)
    )}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-4 h-4 !bg-primary/50 hover:!bg-primary transition-colors"
      />
      <div className="h-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={cn("capitalize", getNodeBadgeStyle(data.type))}>
            {data.type.replace('-', ' ')}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive/90"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {isEditing ? (
          <Input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="text-lg font-medium"
            placeholder="Enter note title..."
          />
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            className="text-lg font-medium cursor-text select-none min-h-[40px] flex items-center"
          >
            {label || 'Double click to edit'}
          </div>
        )}
        <div 
          className="flex-1 bg-background rounded-lg p-4 text-sm text-foreground border cursor-text overflow-y-auto hover:border-ring"
          onClick={() => editor?.chain().focus().run()}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-4 h-4 !bg-primary/50 hover:!bg-primary transition-colors"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        isConnectable={isConnectable}
        className="w-4 h-4 !bg-primary/50 hover:!bg-primary transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={isConnectable}
        className="w-4 h-4 !bg-primary/50 hover:!bg-primary transition-colors"
      />
    </Card>
  );
};

export default TextNode;